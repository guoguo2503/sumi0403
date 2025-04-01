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
    console.log('收到翻译请求体:', bodyText);
    
    let textData;
    try {
      textData = JSON.parse(bodyText);
    } catch (e) {
      console.error('JSON解析错误:', e);
      return NextResponse.json({ error: '无效的JSON格式' }, { status: 400 });
    }
    
    const { text } = textData;
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: '文本不能为空' }, { status: 400 });
    }

    console.log('翻译API收到请求，原始文本:', text);
    console.log('文本长度:', text.length);

    // 获取API密钥
    const apiKey = process.env.TOGETHER_API_KEY;
    
    if (!apiKey) {
      console.error('环境变量中缺少TOGETHER_API_KEY');
      return NextResponse.json({ error: 'API配置错误，请联系管理员' }, { status: 500 });
    }

    // 准备翻译请求体
    const requestBody = {
      model: 'Qwen/Qwen2.5-7B-Instruct-Turbo',
      messages: [
        { role: "user", content: `Translate the following text to English. Keep the same tone and meaning, but make sure the translation sounds natural in English:\n\n${text}` },
      ],
      temperature: 0.3, // 使用较低的temperature以获得更精确的翻译
      max_tokens: 1000
    };
    
    console.log('发送到Together API的翻译请求:', JSON.stringify(requestBody, null, 2));

    try {
      // 调用Together API，设置30秒超时
      const response = await fetchWithTimeout(
        'https://api.together.xyz/v1/chat/completions', 
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        },
        30000 // 30秒超时
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
            error: `翻译失败: ${response.status} ${response.statusText}`, 
            details: responseText
          }, { status: response.status });
        }
      }

      // 尝试解析JSON响应
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Together API响应成功，收到翻译数据');
        
        // 验证响应格式并提取翻译文本
        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
          console.error('API响应缺少预期的数据结构:', JSON.stringify(data, null, 2));
          return NextResponse.json({ 
            error: '无效的API响应格式',
            details: 'API返回的数据结构缺少预期字段'
          }, { status: 500 });
        }
        
        const translatedText = data.choices[0].message.content.trim();
        console.log('翻译结果:', translatedText);
        
        return NextResponse.json({ translatedText });
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
          error: '调用翻译API失败',
          details: error.message || '未知网络错误'
        }, { status: 500 });
      }
    }
  } catch (error: any) {
    console.error('处理翻译请求时发生错误:', error);
    return NextResponse.json({ 
      error: '处理翻译请求时出错',
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
} 