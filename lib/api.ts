// 定义我们自己的 Message 类型，匹配 DeepSeek API 的需求
export interface Message {
  role: string;
  content: string;
}

export interface ChatCompletionResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
      reasoning_content?: string;
      tool_calls?: {
        id: string;
        type: string;
        function: {
          name: string;
          arguments: string;
        };
      }[];
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  created: number;
  model: string;
  object: string;
}

// 自定义API错误类，包含更多详情
export class ApiError extends Error {
  status?: number;
  responseText?: string;
  type: 'timeout' | 'network' | 'api' | 'parse' | 'validation' | 'unknown';

  constructor(message: string, type: 'timeout' | 'network' | 'api' | 'parse' | 'validation' | 'unknown', status?: number, responseText?: string) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.status = status;
    this.responseText = responseText;
  }
}

// 默认的 API Key，如果环境变量不可用，就使用这个
const DEFAULT_API_KEY = "sk-hmnwfcnixfotejkfstpbxetstoukbuicttfqsshlmznwlxne";

export async function chatCompletion(
  messages: Message[],
  options?: {
    model?: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    top_k?: number;
    frequency_penalty?: number;
    timeout?: number;
  }
): Promise<ChatCompletionResponse> {
  const url = "https://api.siliconflow.cn/v1/chat/completions";
  
  const payload = {
    model: options?.model || "Qwen/QwQ-32B",
    stream: false,
    max_tokens: options?.max_tokens || 512,
    temperature: options?.temperature || 0.7,
    top_p: options?.top_p || 0.7,
    top_k: options?.top_k || 50,
    frequency_penalty: options?.frequency_penalty || 0.5,
    n: 1,
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  };
  
  // 从环境变量获取API密钥，如果未设置则使用默认值
  const apiKey = typeof window !== 'undefined' 
    ? window.localStorage.getItem('DEEPSEEK_API_KEY') || process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || DEFAULT_API_KEY
    : process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || DEFAULT_API_KEY;
  
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };
  
  try {
    console.log("正在调用 DeepSeek API...");
    console.log("API URL:", url);
    console.log("模型:", payload.model);
    
    // 检查网络连接
    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      throw new ApiError("无网络连接", "network");
    }
    
    // 设置请求超时
    const timeout = options?.timeout || 10000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal
    });
    
    clearTimeout(timeoutId); // 清除超时
    
    // 获取响应文本以便记录
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error("API request failed with status:", response.status);
      console.error("Response:", responseText);
      
      // 根据状态码返回更详细的错误
      if (response.status === 401) {
        throw new ApiError("API密钥无效或已过期", "api", response.status, responseText);
      } else if (response.status === 404) {
        throw new ApiError("API端点不存在", "api", response.status, responseText);
      } else if (response.status === 429) {
        throw new ApiError("API请求过于频繁，请稍后再试", "api", response.status, responseText);
      } else if (response.status >= 500) {
        throw new ApiError("API服务器错误，请稍后再试", "api", response.status, responseText);
      } else {
        throw new ApiError(`API请求失败，状态码: ${response.status}`, "api", response.status, responseText);
      }
    }
    
    // 尝试解析JSON响应
    try {
      const jsonData = JSON.parse(responseText);
      console.log("API调用成功");
      return jsonData;
    } catch (parseError) {
      console.error("解析响应JSON失败:", parseError);
      throw new ApiError("无法解析API响应", "parse");
    }
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    
    // 处理各种错误类型
    if (error instanceof ApiError) {
      throw error; // 已经是ApiError，直接抛出
    } else if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('请求超时，服务器响应时间过长', "timeout");
    } else if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError('网络请求失败，无法连接到API服务器', "network");
    } else {
      throw new ApiError(`API调用出错: ${error instanceof Error ? error.message : '未知错误'}`, "unknown");
    }
  }
}

// 生成写作提示
export async function generateWritingPrompt(): Promise<string> {
  console.log("正在生成写作提示...");
  const messages: Message[] = [
    {
      role: "system",
      content: "你是一个专业写作教练，能够提供温和且富有启发性的写作提示。请参考《642件可写的事儿》和伯恩斯焦虑自救法的写作风格，生成一个能激发用户互动和创作的提示。提示应该简短（不超过50字），引导用户进行自我探索，表达感受，或描述特定场景。"
    },
    {
      role: "user", 
      content: "请生成一个写作提示，帮助我开始创作。"
    }
  ];

  try {
    const response = await chatCompletion(messages, {
      max_tokens: 100,
      temperature: 0.8,
      timeout: 8000 // 8秒超时
    });

    if (response && response.choices && response.choices.length > 0) {
      const content = response.choices[0].message.content.trim();
      if (content) {
        console.log("成功生成写作提示:", content);
        return content;
      } else {
        console.error("API返回了空内容");
        throw new ApiError("API返回了空内容", "validation");
      }
    }
    console.error("API响应无效，缺少预期字段");
    throw new ApiError("API响应格式无效", "validation");
  } catch (error) {
    // ApiError类型的错误已经包含详细信息，直接抛出
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("生成写作提示失败:", error);
    throw new ApiError(`生成写作提示失败: ${error instanceof Error ? error.message : '未知错误'}`, "unknown");
  }
}

// 分析文本情感和语义
export async function analyzeTextEmotion(text: string): Promise<{
  emotion: string;
  keywords: string[];
  imagePrompt: string;
  confidence: number;
  secondaryEmotion: string;
  emotionAnalysis: string;
}> {
  console.log("正在分析文本情感...");
  const messages: Message[] = [
    {
      role: "system",
      content: `你是一个专业的NLP分析专家，擅长分析文本的情感和语义。请分析用户提供的文本，并返回以下JSON格式数据：
      {
        "emotion": "主要情感，例如：快乐、悲伤、愤怒、平静等",
        "secondaryEmotion": "次要情感，如果有多种情感交织",
        "confidence": 数字，从0.1到1.0，表示主要情感的置信度,
        "keywords": ["从文本中提取的3-5个关键词"],
        "imagePrompt": "一个能代表文本中心思想和情感的图像生成提示，约50字左右",
        "emotionAnalysis": "一段简短的文本情感分析说明，解释为何判断为此情感，不超过100字"
      }
      
      分析时请注意：
      1. 考虑整体上下文，不仅仅依赖于单个词语
      2. 识别否定词与情感词的搭配（如"不开心"）
      3. 考虑语气词和标点符号的作用
      4. 注意情感强度("非常高兴"比"高兴"强度更高)
      5. 考虑潜在的反讽或夸张表达`
    },
    {
      role: "user",
      content: text
    }
  ];

  try {
    const response = await chatCompletion(messages, {
      max_tokens: 500,
      temperature: 0.5,
      timeout: 10000
    });

    if (response && response.choices && response.choices.length > 0) {
      const content = response.choices[0].message.content;
      try {
        const parsedData = JSON.parse(content);
        if (parsedData.emotion && 
            Array.isArray(parsedData.keywords) && 
            parsedData.imagePrompt && 
            typeof parsedData.confidence === 'number' &&
            parsedData.secondaryEmotion &&
            parsedData.emotionAnalysis) {
          console.log("成功分析文本情感:", parsedData);
          return parsedData;
        }
        
        const result = {
          emotion: parsedData.emotion || '平静',
          keywords: Array.isArray(parsedData.keywords) ? parsedData.keywords : [],
          imagePrompt: parsedData.imagePrompt || '平静的场景',
          confidence: typeof parsedData.confidence === 'number' ? parsedData.confidence : 0.5,
          secondaryEmotion: parsedData.secondaryEmotion || '平静',
          emotionAnalysis: parsedData.emotionAnalysis || '无法提供详细分析'
        };
        
        console.log("部分数据格式不完整，已进行补充:", result);
        return result;
      } catch (e) {
        console.error("无法解析API返回的JSON:", e);
        throw new ApiError("无法解析API返回的JSON数据", "parse");
      }
    }
    
    console.error("API响应无效，缺少预期字段");
    throw new ApiError("API响应格式无效", "validation");
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("分析文本情感失败:", error);
    throw new ApiError(`分析文本情感失败: ${error instanceof Error ? error.message : '未知错误'}`, "unknown");
  }
} 