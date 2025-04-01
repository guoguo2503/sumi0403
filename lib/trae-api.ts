// 导出情感分析相关的类型定义
export interface EmotionAnalysis {
  emotion: string;
  confidence?: number;
  secondaryEmotion?: string;
  emotionAnalysis?: string;
  keywords?: string[];
}

// 文本情感分析
export const analyzeEmotion = async (text: string): Promise<EmotionAnalysis> => {
  try {
    console.log('分析文本情感...');
    return await localAnalyzeEmotion(text);
  } catch (error) {
    console.error('情感分析失败:', error);
    throw new Error(`情感分析失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
};

// 使用本地算法分析情感
async function localAnalyzeEmotion(text: string): Promise<EmotionAnalysis> {
  // 导入本地情感分析函数
  const { analyzeEmotion } = await import('@/lib/image-generation');
  
  try {
    // 获取主要情感
    const primaryEmotion = analyzeEmotion(text);
    
    // 再次分析，但排除主要情感，找出次要情感
    const emotionCounts: Record<string, number> = {};
    const words = text.split(/\s+/);
    
    // 从lib/image-generation.ts导入的emotionKeywords不能直接使用，需要重新定义
    const basicEmotions = {
      '开心': ['快乐', '幸福', '高兴', '喜悦', '欢乐', '开心'],
      '悲伤': ['悲伤', '忧郁', '哀愁', '难过', '伤感'],
      '焦虑': ['焦虑', '紧张', '忧虑', '不安', '担心'],
      '愤怒': ['愤怒', '生气', '恼火', '气愤'],
      '平静': ['平静', '安宁', '宁静', '舒适', '放松']
    };
    
    // 简单计算情感词频率
    words.forEach(word => {
      Object.entries(basicEmotions).forEach(([emotion, keywords]) => {
        if (keywords.some(keyword => word.includes(keyword))) {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        }
      });
    });
    
    // 找出次要情感(排除主要情感后得分最高的)
    delete emotionCounts[primaryEmotion];
    let secondaryEmotion = '平静';
    let maxCount = 0;
    
    Object.entries(emotionCounts).forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxCount = count;
        secondaryEmotion = emotion;
      }
    });
    
    // 计算置信度(简单估算)
    const totalEmotionMentions = Object.values(emotionCounts).reduce((sum, count) => sum + count, 0);
    const confidence = totalEmotionMentions > 0 ? 0.5 + (0.5 * (1 - (Object.keys(emotionCounts).length / totalEmotionMentions))) : 0.7;
    
    return {
      emotion: primaryEmotion,
      confidence: Math.min(0.95, Math.max(0.5, confidence)), // 限制在0.5~0.95之间
      secondaryEmotion,
      emotionAnalysis: `文本主要表达了${primaryEmotion}情绪，同时也包含${secondaryEmotion}情绪。`,
      keywords: text.split(/\s+/).slice(0, 5) // 简单提取前5个词作为关键词
    };
  } catch (error) {
    console.error('本地情感分析失败:', error);
    return {
      emotion: 'calm',
      confidence: 0.5,
      secondaryEmotion: 'peaceful',
      emotionAnalysis: '无法准确分析文本情感。',
      keywords: []
    };
  }
}