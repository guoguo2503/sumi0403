import { NextResponse } from 'next/server';

// 为fetch添加超时控制的工具函数
async function fetchWithTimeout(url: string, options: RequestInit, timeout = 30000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  const response = await fetch(url, {
    ...options,
    signal: controller.signal
  });
  
  clearTimeout(id);
  return response;
}

export async function POST(request: Request) {
  try {
    // 提取请求正文
    const bodyText = await request.text();
    console.log('收到原始请求体:', bodyText);
    
    let promptData;
    try {
      promptData = JSON.parse(bodyText);
    } catch (e) {
      console.error('JSON解析错误:', e);
      return NextResponse.json({ error: '无效的JSON格式' }, { status: 400 });
    }
    
    const { prompt } = promptData;
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: '提示文本不能为空' }, { status: 400 });
    }

    console.log('图像生成API收到请求，提示词:', prompt);
    console.log('提示词长度:', prompt.length);

    // 获取API密钥
    const apiKey = process.env.TOGETHER_API_KEY;
    
    if (!apiKey) {
      console.error('环境变量中缺少TOGETHER_API_KEY');
      return NextResponse.json({ error: 'API配置错误，请联系管理员' }, { status: 500 });
    }

    // 处理提示词
    let processedPrompt = prompt;
    // 删除"避免在图片中生成文字"这类指令，以免混淆模型
    processedPrompt = processedPrompt.replace(/避免.*(文字|符号|中文)/g, '')
                                    .replace(/不要.*(文字|符号|中文)/g, '')
                                    .replace(/不需要.*(文字|符号|中文)/g, '');
    
    // 优化提示词
    const enhancedPrompt = enhancePrompt(processedPrompt);
    console.log('优化后的提示词:', enhancedPrompt);

    // 定义图像生成参数
    const stepsValue = 4; // 符合API限制的最大值(1-4)
    
    // 添加负面提示词
    const negativePrompt = "text, words, letters, symbols, characters, signature, watermark, chinese characters, english text, asian characters, numbers, hieroglyphs, writing, calligraphy, bad anatomy, ugly, distorted, disfigured";

    // 准备API请求正文
    const requestBody = {
      model: 'black-forest-labs/FLUX.1-schnell-Free',
      prompt: enhancedPrompt,
      negative_prompt: negativePrompt,
      width: 1024,
      height: 768,
      steps: stepsValue,
      n: 1,
      response_format: 'b64_json',
      stop: []
    };
    
    console.log('发送到Together API的完整请求:', JSON.stringify(requestBody, null, 2));

    try {
      // 调用Together API，设置60秒超时
      const response = await fetchWithTimeout(
        'https://api.together.xyz/v1/images/generations', 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        },
        60000 // 60秒超时
      );

      // 获取响应文本以便记录
      const responseText = await response.text();
      
      if (!response.ok) {
        console.error('Together API错误状态码:', response.status);
        console.error('错误响应内容:', responseText);
        
        // 根据错误类型提供更具体的错误信息
        if (response.status === 401) {
          return NextResponse.json({ 
            error: 'API密钥无效或已过期', 
            details: responseText
          }, { status: response.status });
        } else if (response.status === 429) {
          return NextResponse.json({ 
            error: 'API调用次数超出限制，请稍后再试', 
            details: responseText
          }, { status: response.status });
        } else if (response.status >= 500) {
          return NextResponse.json({ 
            error: 'Together AI服务器错误，请稍后再试', 
            details: responseText
          }, { status: response.status });
        } else {
          return NextResponse.json({ 
            error: `图像生成失败: ${response.status} ${response.statusText}`, 
            details: responseText
          }, { status: response.status });
        }
      }

      // 尝试解析JSON响应
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Together API响应成功，收到数据');
        
        // 验证响应格式
        if (!data.data || !data.data[0] || !data.data[0].b64_json) {
          console.error('API响应缺少预期的数据结构:', JSON.stringify(data, null, 2));
          return NextResponse.json({ 
            error: '无效的API响应格式',
            details: 'API返回的数据结构缺少预期字段'
          }, { status: 500 });
        }
        
        return NextResponse.json(data);
      } catch (parseError) {
        console.error('解析API响应JSON失败:', parseError);
        console.error('收到的响应文本:', responseText);
        return NextResponse.json({ 
          error: '无法解析API响应',
          details: responseText.substring(0, 500) // 只返回部分响应以避免过大
        }, { status: 500 });
      }
    } catch (error: any) { // 使用any类型以访问可能的错误属性
      console.error('调用Together API时出错:', error);
      
      // 分类错误类型
      if (error.name === 'AbortError') {
        return NextResponse.json({ 
          error: 'API请求超时，服务器响应时间过长',
          details: error.message || '请求超时'
        }, { status: 504 });
      } else {
        return NextResponse.json({ 
          error: '调用图像生成API失败',
          details: error.message || '未知网络错误'
        }, { status: 500 });
      }
    }
  } catch (error: any) {
    console.error('处理请求时发生错误:', error);
    return NextResponse.json({ 
      error: '处理请求时出错',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}

/**
 * 增强提示词以获得更好的图像质量
 */
function enhancePrompt(originalPrompt: string): string {
  // 判断提示词是否是中文（主要包含中文字符）
  const isChinese = /[\u4e00-\u9fa5]/.test(originalPrompt) && 
                    originalPrompt.match(/[\u4e00-\u9fa5]/g)!.length > originalPrompt.length / 3;
  
  // 如果是中文提示词，尝试在末尾添加英文修饰词
  if (isChinese) {
    // 保留原始中文提示词并添加通用的高质量修饰词
    return `${originalPrompt}, high quality, detailed, fine details, realistic`;
  }
  
  // 如果已经是英文提示词或包含足够英文内容，仅添加质量相关修饰词（如果没有）
  if (!originalPrompt.toLowerCase().includes('quality') && 
      !originalPrompt.toLowerCase().includes('detailed') && 
      !originalPrompt.toLowerCase().includes('realistic')) {
    return `${originalPrompt}, high quality, detailed`;
  }
  
  // 原提示词已经包含质量词，直接返回
  return originalPrompt;
} 