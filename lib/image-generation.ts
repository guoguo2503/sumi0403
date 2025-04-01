// 情绪类型定义
export type EmotionType = 
  | 'calm' 
  | 'happy' 
  | 'sad' 
  | 'anxious' 
  | 'excited' 
  | 'nostalgic' 
  | 'confused' 
  | 'hopeful' 
  | 'determined'
  | 'peaceful'
  | 'angry'        // 新增：愤怒
  | 'disappointed' // 新增：失望
  | 'grateful'     // 新增：感激
  | 'proud'        // 新增：自豪
  | 'lonely';      // 新增：孤独

// 情绪关键词映射 - 带权重的关键词系统
interface WeightedKeyword {
  word: string;
  weight: number;
}

const emotionKeywords: Record<EmotionType, WeightedKeyword[]> = {
  calm: [
    { word: '平静', weight: 1.5 },
    { word: '安宁', weight: 1.5 },
    { word: '宁静', weight: 1.5 },
    { word: '舒适', weight: 1.5 },
    { word: '放松', weight: 1.5 },
    { word: '平和', weight: 1.5 },
    { word: '静谧', weight: 1.5 },
    { word: '恬静', weight: 1.5 },
    { word: '沉着', weight: 1.5 },
    { word: '悠闲', weight: 1.5 },
    { word: '淡定', weight: 1.5 },
    { word: '从容', weight: 1.5 },
    { word: '冷静', weight: 1.5 },
    { word: '安详', weight: 1.5 },
    { word: '安心', weight: 1.5 },
    { word: '静止', weight: 1.5 },
    { word: '坦然', weight: 1.5 },
    { word: '宁谧', weight: 1.5 },
    { word: '镇定', weight: 1.5 },
    { word: '泰然', weight: 1.5 }
  ],
  happy: [
    { word: '快乐', weight: 2.5 },
    { word: '幸福', weight: 2.5 },
    { word: '高兴', weight: 2.5 },
    { word: '喜悦', weight: 2.5 },
    { word: '欢乐', weight: 2.5 },
    { word: '开心', weight: 2.5 },
    { word: '愉快', weight: 2.5 },
    { word: '欣喜', weight: 2.5 },
    { word: '欢欣', weight: 2.5 },
    { word: '兴奋', weight: 2.5 },
    { word: '微笑', weight: 2.5 },
    { word: '欢愉', weight: 2.5 },
    { word: '雀跃', weight: 2.5 },
    { word: '欢呼', weight: 2.5 },
    { word: '满足', weight: 2.5 },
    { word: '甜蜜', weight: 2.5 },
    { word: '惬意', weight: 2.5 },
    { word: '欢畅', weight: 2.5 },
    { word: '美好', weight: 2.5 },
    { word: '笑容', weight: 2.5 },
    { word: '欢笑', weight: 2.5 },
    { word: '舒畅', weight: 2.5 },
    { word: '欢喜', weight: 2.5 }
  ],
  sad: [
    { word: '悲伤', weight: 2.5 },
    { word: '忧郁', weight: 2.5 },
    { word: '悲痛', weight: 2.5 },
    { word: '哀愁', weight: 2.5 },
    { word: '难过', weight: 2.5 },
    { word: '伤感', weight: 2.5 },
    { word: '消沉', weight: 2.5 },
    { word: '沮丧', weight: 2.5 },
    { word: '痛苦', weight: 2.5 },
    { word: '失落', weight: 2.5 },
    { word: '哭泣', weight: 2.5 },
    { word: '心碎', weight: 2.5 },
    { word: '黯然', weight: 2.5 },
    { word: '叹息', weight: 2.5 },
    { word: '悲哀', weight: 2.5 },
    { word: '忧伤', weight: 2.5 },
    { word: '心痛', weight: 2.5 },
    { word: '遗憾', weight: 2.5 },
    { word: '泪水', weight: 2.5 },
    { word: '哀痛', weight: 2.5 },
    { word: '凄凉', weight: 2.5 },
    { word: '悲凉', weight: 2.5 },
    { word: '愁苦', weight: 2.5 },
    { word: '愁肠', weight: 2.5 },
    { word: '悲苦', weight: 2.5 }
  ],
  anxious: [
    { word: '焦虑', weight: 2.5 },
    { word: '紧张', weight: 2.5 },
    { word: '忧虑', weight: 2.5 },
    { word: '不安', weight: 2.5 },
    { word: '担心', weight: 2.5 },
    { word: '恐惧', weight: 2.5 },
    { word: '害怕', weight: 2.5 },
    { word: '惊慌', weight: 2.5 },
    { word: '慌张', weight: 2.5 },
    { word: '忐忑', weight: 2.5 },
    { word: '惶恐', weight: 2.5 },
    { word: '困扰', weight: 2.5 },
    { word: '惊惧', weight: 2.5 },
    { word: '惊恐', weight: 2.5 },
    { word: '烦躁', weight: 2.5 },
    { word: '生怕', weight: 2.5 },
    { word: '担忧', weight: 2.5 },
    { word: '战战兢兢', weight: 2.5 },
    { word: '心慌', weight: 2.5 },
    { word: '提心吊胆', weight: 2.5 },
    { word: '心神不宁', weight: 2.5 },
    { word: '坐立不安', weight: 2.5 }
  ],
  excited: [
    { word: '极速', weight: 3.0 },
    { word: '刺激', weight: 3.0 },
    { word: '飙升', weight: 3.0 },
    { word: '狂飙', weight: 3.0 },
    { word: '旋风', weight: 2.8 },
    { word: '自由', weight: 2.8 },
    { word: '兴奋', weight: 2.5 },
    { word: '激动', weight: 2.5 },
    { word: '热血', weight: 2.5 },
    { word: '澎湃', weight: 2.3 },
    { word: '热情', weight: 2.0 },
    { word: '振奋', weight: 2.0 },
    { word: '雀跃', weight: 2.0 },
    { word: '激昂', weight: 2.0 },
    { word: '活力', weight: 1.8 },
    { word: '昂扬', weight: 1.8 },
    { word: '热烈', weight: 1.8 },
    { word: '沸腾', weight: 1.8 },
    { word: '奔放', weight: 1.8 }
  ],
  nostalgic: [
    { word: '怀旧', weight: 2.5 },
    { word: '思念', weight: 2.5 },
    { word: '回忆', weight: 2.5 },
    { word: '追忆', weight: 2.5 },
    { word: '留恋', weight: 2.5 },
    { word: '眷恋', weight: 2.5 },
    { word: '缅怀', weight: 2.5 },
    { word: '思绪', weight: 2.5 },
    { word: '念旧', weight: 2.5 },
    { word: '想念', weight: 2.5 },
    { word: '追思', weight: 2.5 },
    { word: '思乡', weight: 2.5 },
    { word: '忆苦思甜', weight: 2.5 },
    { word: '记忆', weight: 2.5 },
    { word: '追溯', weight: 2.5 },
    { word: '追忆往昔', weight: 2.5 },
    { word: '留念', weight: 2.5 },
    { word: '念念不忘', weight: 2.5 },
    { word: '忆旧', weight: 2.5 },
    { word: '思往事', weight: 2.5 }
  ],
  confused: [
    { word: '困惑', weight: 2.5 },
    { word: '迷茫', weight: 2.5 },
    { word: '疑惑', weight: 2.5 },
    { word: '不解', weight: 2.5 },
    { word: '复杂', weight: 2.5 },
    { word: '矛盾', weight: 2.5 },
    { word: '挣扎', weight: 2.5 },
    { word: '犹豫', weight: 2.5 },
    { word: '迷惘', weight: 2.5 },
    { word: '茫然', weight: 2.5 },
    { word: '踌躇', weight: 2.5 },
    { word: '纠结', weight: 2.5 },
    { word: '不确定', weight: 2.5 },
    { word: '进退两难', weight: 2.5 },
    { word: '左右为难', weight: 2.5 },
    { word: '举棋不定', weight: 2.5 },
    { word: '模糊', weight: 2.5 },
    { word: '不明所以', weight: 2.5 },
    { word: '不知所措', weight: 2.5 },
    { word: '糊涂', weight: 2.5 }
  ],
  hopeful: [
    { word: '希望', weight: 2.5 },
    { word: '期待', weight: 2.5 },
    { word: '向往', weight: 2.5 },
    { word: '憧憬', weight: 2.5 },
    { word: '期望', weight: 2.5 },
    { word: '梦想', weight: 2.5 },
    { word: '向上', weight: 2.5 },
    { word: '乐观', weight: 2.5 },
    { word: '展望', weight: 2.5 },
    { word: '盼望', weight: 2.5 },
    { word: '企盼', weight: 2.5 },
    { word: '期盼', weight: 2.5 },
    { word: '憧憬', weight: 2.5 },
    { word: '向往', weight: 2.5 },
    { word: '盼头', weight: 2.5 },
    { word: '寄望', weight: 2.5 },
    { word: '指望', weight: 2.5 },
    { word: '光明', weight: 2.5 },
    { word: '美好', weight: 2.5 },
    { word: '充满希望', weight: 2.5 },
    { word: '抱有期待', weight: 2.5 }
  ],
  determined: [
    { word: '决心', weight: 2.0 },
    { word: '毅力', weight: 2.0 },
    { word: '坚定', weight: 2.0 },
    { word: '坚持', weight: 1.8 },
    { word: '努力', weight: 1.5 },
    { word: '奋斗', weight: 1.5 },
    { word: '拼搏', weight: 1.5 },
    { word: '挑战', weight: 1.5 },
    { word: '克服', weight: 1.2 },
    { word: '勇敢', weight: 1.2 }
  ],
  peaceful: [
    { word: '和平', weight: 1.5 },
    { word: '祥和', weight: 1.5 },
    { word: '宁和', weight: 1.2 },
    { word: '静谧', weight: 1.2 },
    { word: '安详', weight: 1.2 },
    { word: '恬淡', weight: 1.0 },
    { word: '平静', weight: 1.0 },
    { word: '安逸', weight: 1.0 },
    { word: '和谐', weight: 1.0 },
    { word: '轻松', weight: 1.0 },
    { word: '舒缓', weight: 1.0 },
    { word: '安宁', weight: 1.0 },
    { word: '和睦', weight: 1.0 },
    { word: '宁静', weight: 1.0 },
    { word: '清幽', weight: 1.0 },
    { word: '宜人', weight: 1.0 },
    { word: '安泰', weight: 1.0 },
    { word: '怡然', weight: 1.0 },
    { word: '闲适', weight: 1.0 },
    { word: '闲情', weight: 1.0 },
    { word: '安闲', weight: 1.0 }
  ],
  angry: [
    { word: '愤怒', weight: 2.5 },
    { word: '生气', weight: 2.5 },
    { word: '恼火', weight: 2.5 },
    { word: '发火', weight: 2.5 },
    { word: '发怒', weight: 2.5 },
    { word: '气愤', weight: 2.5 },
    { word: '暴怒', weight: 2.5 },
    { word: '恼怒', weight: 2.5 },
    { word: '火冒三丈', weight: 2.5 },
    { word: '大发雷霆', weight: 2.5 },
    { word: '怒不可遏', weight: 2.5 },
    { word: '怒火', weight: 2.5 },
    { word: '恼羞成怒', weight: 2.5 },
    { word: '暴跳如雷', weight: 2.5 },
    { word: '勃然大怒', weight: 2.5 },
    { word: '气急败坏', weight: 2.5 },
    { word: '怒气冲冲', weight: 2.5 },
    { word: '怒形于色', weight: 2.5 }
  ],
  disappointed: [
    { word: '失望', weight: 2.5 },
    { word: '灰心', weight: 2.5 },
    { word: '绝望', weight: 2.5 },
    { word: '失落', weight: 2.5 },
    { word: '泄气', weight: 2.5 },
    { word: '丧气', weight: 2.5 },
    { word: '不满', weight: 2.5 },
    { word: '扫兴', weight: 2.5 },
    { word: '心灰意冷', weight: 2.5 },
    { word: '败兴', weight: 2.5 },
    { word: '无望', weight: 2.5 },
    { word: '痛心', weight: 2.5 },
    { word: '遗憾', weight: 2.5 },
    { word: '不如意', weight: 2.5 },
    { word: '失意', weight: 2.5 },
    { word: '不称心', weight: 2.5 },
    { word: '大失所望', weight: 2.5 },
    { word: '心凉', weight: 2.5 }
  ],
  grateful: [
    { word: '感激', weight: 2.5 },
    { word: '感谢', weight: 2.5 },
    { word: '谢意', weight: 2.5 },
    { word: '感恩', weight: 2.5 },
    { word: '谢谢', weight: 2.5 },
    { word: '铭记', weight: 2.5 },
    { word: '铭感', weight: 2.5 },
    { word: '感激不尽', weight: 2.5 },
    { word: '感谢不尽', weight: 2.5 },
    { word: '心存感激', weight: 2.5 },
    { word: '感激涕零', weight: 2.5 },
    { word: '感恩戴德', weight: 2.5 },
    { word: '感念', weight: 2.5 },
    { word: '铭记在心', weight: 2.5 },
    { word: '感激之情', weight: 2.5 }
  ],
  proud: [
    { word: '骄傲', weight: 2.5 },
    { word: '自豪', weight: 2.5 },
    { word: '自满', weight: 2.5 },
    { word: '得意', weight: 2.5 },
    { word: '荣幸', weight: 2.5 },
    { word: '荣耀', weight: 2.5 },
    { word: '引以为荣', weight: 2.5 },
    { word: '与有荣焉', weight: 2.5 },
    { word: '得意洋洋', weight: 2.5 },
    { word: '志得意满', weight: 2.5 },
    { word: '昂首挺胸', weight: 2.5 },
    { word: '洋洋得意', weight: 2.5 },
    { word: '趾高气扬', weight: 2.5 },
    { word: '扬眉吐气', weight: 2.5 },
    { word: '意气风发', weight: 2.5 }
  ],
  lonely: [
    { word: '孤独', weight: 2.5 },
    { word: '寂寞', weight: 2.5 },
    { word: '孤单', weight: 2.5 },
    { word: '落寞', weight: 2.5 },
    { word: '独处', weight: 2.5 },
    { word: '单独', weight: 2.5 },
    { word: '独自', weight: 2.5 },
    { word: '孤寂', weight: 2.5 },
    { word: '孤苦伶仃', weight: 2.5 },
    { word: '形单影只', weight: 2.5 },
    { word: '孤家寡人', weight: 2.5 },
    { word: '孤独无助', weight: 2.5 },
    { word: '孑然一身', weight: 2.5 },
    { word: '孤身一人', weight: 2.5 },
    { word: '孤零零', weight: 2.5 },
    { word: '一个人', weight: 2.5 }
  ]
};

// 情绪对应的图片风格和关键词 - 用于AI图像生成
const emotionImageStyles: Record<EmotionType, string> = {
  calm: 'minimalist landscape in soft blue tones, tranquil water, peaceful nature, serene atmosphere, gentle light',
  happy: 'vibrant colorful abstract with warm yellows and oranges, joyful spring scene, bright sunlight, cheerful atmosphere',
  sad: 'melancholic blue and grey abstract, rainy cityscape with moody atmosphere, lonely figure, dim lighting',
  anxious: 'chaotic strokes with sharp lines, dark and light contrast, surreal dreamscape, maze-like patterns, distorted perspective',
  excited: 'dynamic burst of colors with movement, energetic celebration, fireworks, action scene, vibrant composition',
  nostalgic: 'vintage sepia-toned photography style, faded memories, retro scene, old photographs, warm golden light',
  confused: 'abstract maze-like patterns with intertwining paths, surreal elements, optical illusion, foggy scene, multiple directions',
  hopeful: 'sunrise landscape with light breaking through clouds, hopeful dawn, path leading to horizon, open door with light',
  determined: 'bold strong shapes with upward motion, mountain peaks, achievement, person climbing, powerful composition',
  peaceful: 'zen garden inspired minimal scene, balanced elements, harmony, japanese garden, still water reflecting sky',
  angry: 'intense red and black abstract, stormy sky, angry storm, dark clouds, powerful composition',
  disappointed: 'melancholic blue and grey abstract, rainy cityscape with moody atmosphere, lonely figure, dim lighting',
  grateful: 'vibrant colorful abstract with warm yellows and oranges, joyful spring scene, bright sunlight, cheerful atmosphere',
  proud: 'vibrant colorful abstract with warm yellows and oranges, joyful spring scene, bright sunlight, cheerful atmosphere',
  lonely: 'minimalist landscape in soft blue tones, tranquil water, peaceful nature, serene atmosphere, gentle light'
};

// 情绪相关的句式模式
const emotionPatterns: Record<EmotionType, RegExp[]> = {
  excited: [
    /太(激动|兴奋|刺激)了/,
    /非常(刺激|兴奋|激动)/,
    /好(刺激|兴奋|激动)/,
    /特别(刺激|兴奋|激动)/,
    /(极速|飞快|迅速).*?(前进|奔驰|飞驰)/,
    /带起.*?旋风/,
    /感觉.*?自由/,
    /没有.*?依靠/,
    /极限.*?运动/
  ],
  determined: [
    /一定(要|会)/,
    /必须|坚持/,
    /绝不|决不/,
    /挑战.*?极限/,
    /突破.*?自我/,
    /克服.*?困难/
  ],
  peaceful: [
    /安静|平静/,
    /舒适|舒服/,
    /放松/,
    /宁静.*?祥和/,
    /平和.*?安宁/
  ],
  calm: [
    /沉稳|冷静/,
    /深呼吸/,
    /沉着/,
    /淡定.*?从容/,
    /稳重.*?沉着/,
    /心平气和/
  ],
  happy: [
    /真(是|的)?(快乐|开心|高兴|幸福)/,
    /(喜欢|热爱|享受)/,
    /太棒了/,
    /真好/
  ],
  sad: [
    /感到(伤心|难过|悲伤)/,
    /(哭了|哭泣|流泪)/,
    /唉|唉呀|哎呀/,
    /痛苦/
  ],
  anxious: [
    /担心|害怕|恐惧/,
    /怎么(办|做)/,
    /可怕/,
    /(不安|忐忑)/
  ],
  nostalgic: [
    /过去|曾经|记得/,
    /想起|记忆/,
    /从前|那时/
  ],
  confused: [
    /不知道|不明白/,
    /为什么|怎么会/,
    /困惑|迷茫/
  ],
  hopeful: [
    /希望|期待/,
    /美好的(未来|明天)/,
    /梦想/
  ],
  angry: [
    /生气|愤怒|恼火/,
    /火大|气死/,
    /可恶|该死/,
    /气愤|气死我了/,
    /气得|恼怒/
  ],
  disappointed: [
    /失望|灰心/,
    /本以为|原以为/,
    /不如我(想的|期待的)/,
    /白费|竹篮打水/,
    /枉然|徒劳/
  ],
  grateful: [
    /感谢|谢谢|感激/,
    /多亏了|幸亏/,
    /谢天谢地|谢天/,
    /感恩|感谢/
  ],
  proud: [
    /自豪|骄傲|荣幸/,
    /值得骄傲/,
    /了不起|厉害/,
    /成就感|成绩/
  ],
  lonely: [
    /孤独|孤单|寂寞/,
    /一个人/,
    /无人|没人/,
    /形单影只|孑然一身/
  ]
};

// 场景关键词组合
interface SceneCombination {
  keywords: string[];
  emotion: EmotionType;
  weight: number;
}

const scenePatterns: SceneCombination[] = [
  {
    keywords: ['极速', '前进'],
    emotion: 'excited',
    weight: 3.0
  },
  {
    keywords: ['旋风', '带起'],
    emotion: 'excited',
    weight: 2.8
  },
  {
    keywords: ['没有', '依靠'],
    emotion: 'excited',
    weight: 2.5
  },
  {
    keywords: ['乌漆嘛黑', '隧道'],
    emotion: 'excited',
    weight: 2.0
  },
  {
    keywords: ['自由', '感觉'],
    emotion: 'excited',
    weight: 2.8
  },
  {
    keywords: ['飞驰', '奔跑'],
    emotion: 'excited',
    weight: 2.5
  },
  {
    keywords: ['挑战', '极限'],
    emotion: 'determined',
    weight: 2.5
  },
  {
    keywords: ['突破', '自我'],
    emotion: 'determined',
    weight: 2.5
  }
];

/**
 * 分析场景组合
 */
function analyzeSceneCombinations(text: string): Record<EmotionType, number> {
  const scores: Record<EmotionType, number> = {} as Record<EmotionType, number>;
  
  // 初始化分数
  Object.keys(emotionKeywords).forEach(emotion => {
    scores[emotion as EmotionType] = 0;
  });

  // 检查每个场景组合
  scenePatterns.forEach(scene => {
    // 检查场景中的所有关键词是否都出现在文本中
    const allKeywordsPresent = scene.keywords.every(keyword => 
      text.includes(keyword)
    );
    
    if (allKeywordsPresent) {
      // 如果所有关键词都出现，增加相应情绪的分数
      scores[scene.emotion] += scene.weight;
      
      // 检查关键词的距离，如果在同一句话中，增加权重
      const sentence = text.split(/[。！？.!?]+/).find(s => 
        scene.keywords.every(keyword => s.includes(keyword))
      );
      
      if (sentence) {
        scores[scene.emotion] += scene.weight * 0.5; // 同句加成
      }
    }
  });

  return scores;
}

/**
 * 分析情感强度
 */
function analyzeEmotionalIntensity(text: string): Record<EmotionType, number> {
  const scores: Record<EmotionType, number> = {} as Record<EmotionType, number>;
  
  // 初始化分数
  Object.keys(emotionKeywords).forEach(emotion => {
    scores[emotion as EmotionType] = 0;
  });

  // 强度标记词
  const intensityMarkers = {
    high: ['非常', '特别', '极其', '十分', '格外', '极度', '无比'],
    medium: ['很', '挺', '相当', '比较', '蛮'],
    low: ['有点', '稍微', '略微', '一点']
  };

  // 分析每个句子
  const sentences = text.split(/[。！？.!?]+/);
  sentences.forEach(sentence => {
    // 检查强度标记词
    let intensityMultiplier = 1;
    
    // 高强度标记
    if (intensityMarkers.high.some(marker => sentence.includes(marker))) {
      intensityMultiplier = 2;
    }
    // 中等强度标记
    else if (intensityMarkers.medium.some(marker => sentence.includes(marker))) {
      intensityMultiplier = 1.5;
    }
    // 低强度标记
    else if (intensityMarkers.low.some(marker => sentence.includes(marker))) {
      intensityMultiplier = 0.7;
    }

    // 感叹号增强情感强度
    if (sentence.includes('！') || sentence.includes('!')) {
      intensityMultiplier *= 1.5;
    }

    // 重复词增强情感强度
    const repeatedWords = sentence.match(/([^，。！？.!?\s])\1+/g);
    if (repeatedWords && repeatedWords.length > 0) {
      intensityMultiplier *= 1.2;
    }

    // 应用强度乘数到情感分数
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      keywords.forEach(({ word, weight }) => {
        if (sentence.includes(word)) {
          scores[emotion as EmotionType] += weight * intensityMultiplier;
        }
      });
    });
  });

  return scores;
}

/**
 * 核心情感分析逻辑
 */
function analyzeEmotionCore(text: string): EmotionType {
  // 1. 基础关键词分析
  const keywordScores = Object.entries(emotionKeywords).reduce<Record<EmotionType, number>>((acc, [emotion, keywords]) => {
    acc[emotion as EmotionType] = keywords.reduce((score, { word, weight }) => {
      const regex = new RegExp(word, 'gi');
      const matches = text.match(regex) || [];
      return score + matches.length * weight;
    }, 0);
    return acc;
  }, {} as Record<EmotionType, number>);

  // 2. 场景组合分析
  const sceneScores = analyzeSceneCombinations(text);

  // 3. 情感强度分析
  const intensityScores = analyzeEmotionalIntensity(text);

  // 4. 句式模式分析
  const patternScores = analyzePatterns(text);

  // 5. 合并所有分数
  const finalScores: Record<EmotionType, number> = {} as Record<EmotionType, number>;
  Object.keys(emotionKeywords).forEach(emotion => {
    finalScores[emotion as EmotionType] = 
      keywordScores[emotion as EmotionType] * 1.0 +  // 基础权重
      sceneScores[emotion as EmotionType] * 1.5 +    // 场景组合权重更高
      intensityScores[emotion as EmotionType] * 1.2 + // 强度分析权重
      patternScores[emotion as EmotionType] * 1.3;    // 句式模式权重
  });

  // 6. 找出得分最高的情绪
  let dominantEmotion: EmotionType = 'calm';
  let highestScore = 0;

  Object.entries(finalScores).forEach(([emotion, score]) => {
    if (score > highestScore) {
      highestScore = score;
      dominantEmotion = emotion as EmotionType;
    }
  });

  // 输出详细的分析结果到控制台（调试用）
  console.log('Analysis Results:');
  console.log('Keyword Scores:', keywordScores);
  console.log('Scene Scores:', sceneScores);
  console.log('Intensity Scores:', intensityScores);
  console.log('Pattern Scores:', patternScores);
  console.log('Final Scores:', finalScores);
  console.log('Dominant Emotion:', dominantEmotion, 'with score:', highestScore);

  return dominantEmotion;
}

/**
 * 使用正则表达式模式分析文本
 */
function analyzePatterns(text: string): Record<EmotionType, number> {
  const scores: Record<EmotionType, number> = {
    calm: 0,
    happy: 0,
    sad: 0,
    anxious: 0,
    excited: 0,
    nostalgic: 0,
    confused: 0,
    hopeful: 0,
    determined: 0,
    peaceful: 0,
    angry: 0,
    disappointed: 0,
    grateful: 0,
    proud: 0,
    lonely: 0
  };

  // 遍历每种情绪的模式
  Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
    patterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      scores[emotion as EmotionType] += matches.length * 2; // 句式匹配权重加倍
    });
  });

  return scores;
}

/**
 * 分析文本中的否定词，处理"不开心"这类表达
 */
function handleNegation(text: string, scores: Record<EmotionType, number>): Record<EmotionType, number> {
  const negationWords = ['不', '没', '无', '非', '别', '莫', '勿', '未', '毫不', '决不', '绝不', '并不', '绝非', '否'];
  const negationRegex = new RegExp(`(${negationWords.join('|')})([^，。！？,!?\\s]{0,5})(${Object.values(emotionKeywords).flat().join('|')})`, 'g');
  
  // 复制分数对象，避免修改原对象
  const adjustedScores = { ...scores };
  
  // 查找所有否定表达
  const matches = Array.from(text.matchAll(negationRegex));
  
  matches.forEach(match => {
    const negatedWord = match[3]; // 被否定的情绪词
    
    // 查找该情绪词属于哪种情绪
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      if (keywords.some(kw => kw.word === negatedWord)) {
        // 降低被否定情绪的分数
        adjustedScores[emotion as EmotionType] = Math.max(0, adjustedScores[emotion as EmotionType] - 2);
        
        // 根据被否定的情绪增加相反情绪的分数
        if (emotion === 'happy') adjustedScores.sad += 1;
        else if (emotion === 'sad') adjustedScores.happy += 1;
        else if (emotion === 'excited') adjustedScores.calm += 1;
        else if (emotion === 'calm') adjustedScores.anxious += 1;
        else if (emotion === 'anxious') adjustedScores.peaceful += 1;
        else if (emotion === 'peaceful') adjustedScores.anxious += 1;
        else if (emotion === 'angry') adjustedScores.calm += 1;
        else if (emotion === 'confused') adjustedScores.determined += 1;
        else if (emotion === 'determined') adjustedScores.confused += 1;
      }
    });
  });
  
  return adjustedScores;
}

/**
 * 分析句子的情感强度
 */
function analyzeSentenceIntensity(sentence: string): Record<EmotionType, number> {
  const result: Record<EmotionType, number> = {} as Record<EmotionType, number>;
  Object.keys(emotionKeywords).forEach(emotion => {
    result[emotion as EmotionType] = 0;
  });
  
  // 强化词增强情感强度
  const intensifiers = ['非常', '十分', '极其', '格外', '特别', '尤其', '相当', '很', '太', '真的', '真是', '真'];
  const intensifierRegex = new RegExp(`(${intensifiers.join('|')})([^，。！？,!?\\s]{0,5})(${Object.values(emotionKeywords).flat().join('|')})`, 'g');
  
  // 查找所有强化表达
  const intensifierMatches = Array.from(sentence.matchAll(intensifierRegex));
  intensifierMatches.forEach(match => {
    const intensifiedWord = match[3]; // 被强化的情绪词
    
    // 查找该情绪词属于哪种情绪
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      if (keywords.some(kw => kw.word === intensifiedWord)) {
        // 增强该情绪的分数
        result[emotion as EmotionType] += 2; // 强化词使情感加倍
      }
    });
  });
  
  // 检查基本情感词
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    keywords.forEach(kw => {
      const regex = new RegExp(kw.word, 'gi');
      const matches = sentence.match(regex) || [];
      result[emotion as EmotionType] += matches.length * kw.weight;
    });
  });
  
  // 检查句式模式
  Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
    patterns.forEach(pattern => {
      if (pattern.test(sentence)) {
        result[emotion as EmotionType] += 2; // 句式匹配权重加倍
      }
    });
  });
  
  // 特殊标点符号处理
  if (sentence.includes('！') || sentence.includes('!')) {
    // 感叹号增强情感强度
    Object.keys(result).forEach(emotion => {
      if (result[emotion as EmotionType] > 0) {
        result[emotion as EmotionType] += 1;
      }
    });
    
    // 如果没有明显情绪，感叹号暗示兴奋或愤怒
    const hasEmotion = Object.values(result).some(score => score > 0);
    if (!hasEmotion) {
      result.excited += 1;
      result.angry += 1;
    }
  }
  
  return result;
}

/**
 * 使用上下文分析处理文本
 */
function analyzeContext(text: string): Record<EmotionType, number> {
  // 将文本分割成句子
  const sentences = text.split(/[。！？.!?]+/).filter(s => s.trim().length > 0);
  
  // 分析每个句子的情感
  const sentimentScores = sentences.map(analyzeSentenceIntensity);
  
  // 合并所有句子的情感得分
  const combinedScores: Record<EmotionType, number> = {} as Record<EmotionType, number>;
  Object.keys(emotionKeywords).forEach(emotion => {
    combinedScores[emotion as EmotionType] = 0;
  });
  
  // 赋予最后几个句子更大的权重（假设结尾更能表达作者真实情感）
  sentimentScores.forEach((scores, index) => {
    const weight = 1 + (index / sentences.length); // 权重随句子位置递增
    Object.entries(scores).forEach(([emotion, score]) => {
      combinedScores[emotion as EmotionType] += score * weight;
    });
  });
  
  // 对最后一句话额外加权
  if (sentimentScores.length > 0) {
    const lastSentiment = sentimentScores[sentimentScores.length - 1];
    Object.entries(lastSentiment).forEach(([emotion, score]) => {
      if (score > 0) {
        combinedScores[emotion as EmotionType] += score * 1.5; // 最后一句话权重额外加成
      }
    });
  }
  
  return combinedScores;
}

/**
 * 处理问答场景下的情绪分析，区分提示和回答
 */
function analyzeQuestionAnswerPair(question: string, answer: string): Record<EmotionType, number> {
  // 初始化得分
  const result: Record<EmotionType, number> = {} as Record<EmotionType, number>;
  Object.keys(emotionKeywords).forEach(emotion => {
    result[emotion as EmotionType] = 0;
  });
  
  // 检测问题中的情绪词
  const questionEmotions: Set<EmotionType> = new Set();
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    keywords.forEach(kw => {
      if (question.includes(kw.word)) {
        questionEmotions.add(emotion as EmotionType);
      }
    });
  });
  
  // 分析答案中的情绪
  const answerScores = analyzeContext(answer);
  
  // 检测否定句式（例如"没有痛苦"，"解决...问题"）
  const negationPatterns = [
    /没有(.{0,10})(痛苦|悲伤|忧郁|焦虑|恐惧|担心|难过|伤心)/g,
    /消除(.{0,10})(痛苦|悲伤|忧郁|焦虑|恐惧|担心|难过|伤心)/g,
    /解决(.{0,10})(问题|困难|麻烦|痛苦|悲伤)/g,
    /避免(.{0,10})(痛苦|悲伤|忧郁|焦虑|恐惧|担心|难过|伤心)/g
  ];
  
  let hasNegation = false;
  
  negationPatterns.forEach(pattern => {
    const matches = Array.from(answer.matchAll(pattern));
    if (matches.length > 0) {
      hasNegation = true;
    }
  });
  
  // 修正得分：如果存在否定形式而答案本身带有负面情绪词，提高希望和决心得分
  if (hasNegation) {
    // 降低负面情绪得分
    ['sad', 'anxious', 'confused', 'angry', 'disappointed', 'lonely'].forEach(emotion => {
      answerScores[emotion as EmotionType] *= 0.5; // 降低负面情绪权重
    });
    
    // 提高希望、决心等积极情绪得分
    answerScores.hopeful += 2;
    answerScores.determined += 2;
  }
  
  // 将问题中出现的情绪权重降低，避免干扰
  questionEmotions.forEach(emotion => {
    answerScores[emotion] *= 0.7; // 降低权重
  });
  
  // 如果答案包含积极愿景（"快乐"、"美好"等词与未来时态组合）
  const positiveVisionPatterns = [
    /(未来|将来|会有|希望有)(.{0,15})(快乐|幸福|美好|和平|健康)/g,
    /(所有人|大家|每个人|人们)(.{0,10})(快乐|幸福|美好|和平|健康)/g,
    /(创造|建立|实现)(.{0,10})(快乐|幸福|美好|和平|健康)/g
  ];
  
  let hasPositiveVision = false;
  positiveVisionPatterns.forEach(pattern => {
    const matches = Array.from(answer.matchAll(pattern));
    if (matches.length > 0) {
      hasPositiveVision = true;
    }
  });
  
  if (hasPositiveVision) {
    // 显著提高希望和平和感
    answerScores.hopeful += 3;
    answerScores.peaceful += 2;
    answerScores.happy += 2;
  }
  
  return answerScores;
}

/**
 * 检测文本是否是问答对，并进行分析
 */
function detectAndAnalyzeQuestionAnswer(text: string): Record<EmotionType, number> | null {
  // 常见问题开头
  const questionStarters = [
    '如果你', '你会', '你认为', '你觉得', '请描述', '请问', '什么是', '为什么',
    '怎样', '怎么', '你希望', '你喜欢', '你想', '如何', '是否'
  ];
  
  // 文本按段落或行分割
  const paragraphs = text.split(/\n+/);
  
  // 如果只有一段，检查是否以问题开头
  if (paragraphs.length === 1) {
    const firstSentence = paragraphs[0].split(/[。！？.!?]/)[0];
    if (questionStarters.some(starter => firstSentence.includes(starter)) && firstSentence.includes('？')) {
      // 这可能是自问自答的情况，分离问题和答案
      const parts = paragraphs[0].split(/[？?]/);
      if (parts.length >= 2) {
        const question = parts[0] + '？';
        const answer = parts.slice(1).join('？');
        return analyzeQuestionAnswerPair(question, answer);
      }
    }
    return null;
  }
  
  // 检查第一段是否为问题
  const firstParagraph = paragraphs[0];
  const isQuestion = questionStarters.some(starter => firstParagraph.includes(starter)) ||
                     firstParagraph.includes('？') || 
                     firstParagraph.includes('?');
  
  if (isQuestion) {
    // 第一段是问题，其余是回答
    const question = firstParagraph;
    const answer = paragraphs.slice(1).join('\n');
    return analyzeQuestionAnswerPair(question, answer);
  }
  
  return null;
}

/**
 * 识别常见的写作提示，避免混淆情绪分析
 * 基于app/page.tsx中的随机提示列表
 */
function isWritingPrompt(text: string): boolean {
  // 从app/page.tsx中提取的常见提示开头
  const promptPrefixes = [
    "描述一个让你感到",
    "回忆一个",
    "如果你能",
    "想象你",
    "写下一次",
    "如果你的情绪是",
    "描述一个对你",
    "想象你收到",
    "写下一个童年",
    "如果你可以",
    "想象你在",
    "描述一次",
    "你最珍视的",
    "描述一个在你生活中",
    "写下一个改变",
    "描述一次你感受到",
    "如果你的生活",
    "想象你发现",
    "描述一种你很享受",
    "写下一个让你感到"
  ];
  
  // 判断是否以常见提示开头
  return promptPrefixes.some(prefix => text.trim().startsWith(prefix));
}

/**
 * 从文本中提取提示和回答
 * 尝试自动分离提示内容和用户回答
 */
function extractPromptAndAnswer(text: string): { prompt: string, answer: string } | null {
  // 检查是否包含localStorage中存储的当前提示
  if (typeof window !== 'undefined') {
    const currentPrompt = localStorage.getItem("currentPrompt");
    if (currentPrompt && text.includes(currentPrompt)) {
      // 从文本中找到提示的位置
      const promptIndex = text.indexOf(currentPrompt);
      // 将提示后的内容视为回答
      return {
        prompt: currentPrompt,
        answer: text.substring(promptIndex + currentPrompt.length).trim()
      };
    }
  }
  
  // 常见的提示结尾标记
  const promptEndMarkers = [
    '？ ', '?\n', '？\n', 
    '。 ', '。\n',
    '： ', '：\n',
    ': ', ':\n'
  ];
  
  // 检查是否是写作提示格式
  if (isWritingPrompt(text)) {
    // 尝试找到提示的结束位置
    for (const marker of promptEndMarkers) {
      const markerIndex = text.indexOf(marker);
      if (markerIndex > 20) { // 提示通常至少有20个字符
        return {
          prompt: text.substring(0, markerIndex + 1),
          answer: text.substring(markerIndex + 1).trim()
        };
      }
    }
    
    // 如果没有明确的分隔符，尝试按段落分割
    const paragraphs = text.split(/\n\s*\n/);
    if (paragraphs.length >= 2) {
      return {
        prompt: paragraphs[0],
        answer: paragraphs.slice(1).join('\n')
      };
    }
  }
  
  return null;
}

interface ImageGenerationResponse {
  data: any | null;
  error: string | null;
  details: string | null;
}

interface StoryAnalysis {
  emotion: string;
  visualElements: string[];
  understanding: string;
  visualMetaphor: string;
}

/**
 * 分析文本内容以确定主要情绪
 */
export async function analyzeEmotion(text: string): Promise<StoryAnalysis> {
  try {
    const prompt = `作为一个懂得倾听的朋友，仔细阅读以下这段分享：
"${text}"

请以一个朋友的视角，理解这段分享背后的情感和生活状态。然后，设想你要送给这个朋友一幅画，这幅画应该：
1. 体现你对她此刻心境的理解
2. 表达你对她的共情和支持
3. 用优美的视觉意象来呈现

请以JSON格式返回：
{
  "understanding": "你对这个故事的理解和感受",
  "emotion": "故事传达的核心情感基调",
  "visualMetaphor": "你想通过什么样的视觉意象来表达这种理解和情感",
  "visualElements": ["具体的视觉元素，最多4个，按重要性排序"]
}

注意：
- 不要拘泥于字面的场景描述
- 理解故事背后的情感脉络
- 用富有诗意的视觉隐喻来表达
- 创造一个能引起共鸣的画面

只返回JSON，不要其他文字。`;

    const response = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-7B-Instruct-Turbo",
        messages: [
          {
            role: "system",
            content: "你是一个善解人意的朋友，也是一个富有诗意的艺术家。你擅长倾听他人的故事，理解背后的情感，并用优美的视觉意象来表达你的理解和共情。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const result = JSON.parse(content);

    return {
      emotion: result.emotion,
      visualElements: result.visualElements,
      understanding: result.understanding,
      visualMetaphor: result.visualMetaphor
    };
  } catch (error) {
    console.error("故事理解失败:", error);
    return {
      emotion: "平静",
      visualElements: ["温暖的意象"],
      understanding: "生活中的平静时刻",
      visualMetaphor: "温暖的光线透过窗户"
    };
  }
}

/**
 * 根据情绪和文本生成提示词
 */
function generatePromptFromEmotion(emotion: EmotionType, text: string): string {
  // 获取情绪对应的图片风格
  const baseStyle = emotionImageStyles[emotion];
  
  // 从文本中提取关键内容（简单实现：取前50个字符）
  const textSummary = text.slice(0, 100).replace(/\s+/g, ' ').trim();
  
  // 结合情绪风格和文本内容生成提示词
  const prompt = `Based on this Chinese text excerpt: "${textSummary}", create a ${baseStyle}, digital art, cinematic lighting, highly detailed, 4k resolution`;
  
  return prompt;
}

/**
 * 使用AI生成图像
 */
async function callImageGenerationApi(prompt: string): Promise<string> {
  try {
    console.log('准备调用图像生成API，提示词长度:', prompt.length);
    console.log('完整提示词内容:', prompt);
    
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Image generation API error:', errorData);
      throw new Error(errorData.error || 'Image generation failed');
    }

    const data = await response.json();
    console.log('图像生成API返回成功，API中steps参数值为4，表示扩散模型的迭代次数，较小的值(4)生成速度更快但质量较低');
    
    // 从API响应中获取图片数据
    if (data && data.data && data.data.length > 0 && data.data[0].b64_json) {
      // 返回base64编码的图像数据
      return `data:image/jpeg;base64,${data.data[0].b64_json}`;
    } else {
      throw new Error('Invalid response format from image generation API');
    }
  } catch (error) {
    console.error('Error calling image generation API:', error);
    throw error;
  }
}

/**
 * 根据情绪生成相应的备用图片URL（在API调用失败时使用）
 */
function generateFallbackImage(emotion: EmotionType): string {
  // 使用Picsum Photos作为备用图片服务
  const seed = Date.now();
  return `https://picsum.photos/seed/${emotion}-${seed}/800/600`;
}

/**
 * 集成功能：分析文本并生成对应情绪的图片URL
 * 现在使用AI生成图像，并在失败时有备用选项
 */
export async function generateImageFromText(text: string): Promise<ImageGenerationResponse> {
  try {
    // 像朋友一样理解故事
    const { emotion, visualElements, understanding, visualMetaphor } = await analyzeEmotion(text);
    
    // 构建更丰富、更具艺术性的提示词
    const prompt = `Create a sophisticated fine art image that embodies: ${visualMetaphor}

    Core emotion: ${emotion}
    Visual elements: ${visualElements.join(", ")}
    
    Style requirements:
    - Artistic composition following the golden ratio
    - Atmospheric lighting with volumetric light and subtle shadows
    - Rich color palette with harmonious tones
    - Cinematic depth of field
    - Photorealistic details with painterly qualities
    - Elegant and refined aesthetic
    
    Mood and atmosphere:
    - Create a dreamy, ethereal quality
    - Emphasize emotional resonance through light and color
    - Maintain visual poetry and metaphorical expression
    
    Technical specifications:
    - Ultra-high detail and clarity
    - Professional photography aesthetics
    - Masterful use of light and shadow
    - Subtle textures and materials
    
    This is a meaningful artistic gift that captures the essence of: ${understanding}`;

    console.log("Story understanding:", understanding);
    console.log("Emotional core:", emotion);
    console.log("Visual metaphor:", visualMetaphor);
    console.log("Visual elements:", visualElements);
    console.log("Generated prompt:", prompt);

    // 调用图像生成API，使用更高质量的设置
    const response = await fetch("https://api.together.xyz/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "stabilityai/stable-diffusion-xl-base-1.0",
        prompt: prompt,
        negative_prompt: "anime, cartoon, illustration, drawing, painting, sketch, doodle, low quality, low resolution, blurry, noisy, oversaturated, overexposed, text, watermark, signature, frame, border, amateur, unprofessional",
        num_inference_steps: 20,  // 增加步数以提高质量
        guidance_scale: 9.0,      // 提高相关性
        width: 1024,
        height: 1024,
        num_images_per_prompt: 1,
        scheduler: "K_EULER_ANCESTRAL",  // 使用更好的采样器
        clip_guidance_preset: "FAST_BLUE",  // 添加CLIP引导
        sampler: "DDIM",  // 使用更精确的采样器
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      data: data,
      error: null,
      details: null
    };
  } catch (error) {
    console.error("图像生成失败:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "图像生成失败",
      details: error instanceof Error ? error.stack || null : null
    };
  }
} 