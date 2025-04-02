'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { Calendar, PenLine, Heart, Cloud } from 'lucide-react';
import { type EmotionType } from '@/lib/image-generation';
import { useToast } from '@/hooks/use-toast';

interface HistoryCardProps {
  id: number;
  content: string;
  prompt?: string;
  date: string;
  image?: string;
  hasGallery?: boolean;
  emotion?: EmotionType;
}

// 情绪类型映射到中文名称
const emotionNames: Record<string, string> = {
  'calm': '平静',
  'happy': '快乐',
  'sad': '悲伤',
  'anxious': '焦虑',
  'excited': '兴奋',
  'nostalgic': '怀旧',
  'confused': '困惑',
  'hopeful': '希望',
  'determined': '坚定',
  'peaceful': '平和',
  'angry': '愤怒',
  'disappointed': '失望',
  'grateful': '感激',
  'proud': '自豪',
  'lonely': '孤独'
};

// 情绪类型映射到颜色
const emotionColors: Record<string, string> = {
  'calm': 'bg-blue-100 text-blue-700',
  'happy': 'bg-yellow-100 text-yellow-700',
  'sad': 'bg-indigo-100 text-indigo-700',
  'anxious': 'bg-red-100 text-red-700',
  'excited': 'bg-orange-100 text-orange-700',
  'nostalgic': 'bg-amber-100 text-amber-700',
  'confused': 'bg-purple-100 text-purple-700',
  'hopeful': 'bg-emerald-100 text-emerald-700',
  'determined': 'bg-sky-100 text-sky-700',
  'peaceful': 'bg-green-100 text-green-700',
  'angry': 'bg-rose-100 text-rose-700',
  'disappointed': 'bg-slate-100 text-slate-700',
  'grateful': 'bg-teal-100 text-teal-700',
  'proud': 'bg-fuchsia-100 text-fuchsia-700',
  'lonely': 'bg-violet-100 text-violet-700'
};

export function HistoryCard({ id, content, prompt, date, image, hasGallery, emotion }: HistoryCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imageUrl, setImageUrl] = useState(image || '');
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 修改截断方法，确保从头开始截取文本
  const truncateContent = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  // 获取情绪对应的颜色类名
  const getEmotionColorClass = (emotion?: string) => {
    if (!emotion || !emotionColors[emotion]) {
      return 'bg-primary/10 text-primary';
    }
    return emotionColors[emotion];
  };

  // 获取情绪的中文名称
  const getEmotionName = (emotion?: string) => {
    if (!emotion || !emotionNames[emotion]) {
      return '情绪画廊';
    }
    return emotionNames[emotion];
  };
  
  // 处理图片加载完成
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };
  
  // 处理图片加载错误
  const handleImageError = () => {
    // 如果是base64图像，不进行重试，直接显示错误
    if (imageUrl && imageUrl.startsWith('data:image')) {
      setImageError(true);
      setImageLoaded(false);
      console.error('Base64 image failed to load:', imageUrl.substring(0, 50) + '...');
      return;
    }
    
    // 最多重试2次
    if (retryCount < 2 && hasGallery && emotion) {
      setRetryCount(prev => prev + 1);
      // 生成新的备用图片URL
      const seed = Date.now();
      const fallbackUrl = `https://picsum.photos/seed/${emotion}-retry${retryCount}-${seed}/800/600`;
      console.log(`Image load failed, retrying with: ${fallbackUrl}`);
      setImageUrl(fallbackUrl);
    } else {
      setImageError(true);
      setImageLoaded(false);
      console.error('Image failed to load after retries:', image);
    }
  };
  
  // 使用情绪生成备用图像背景颜色
  const getEmotionBackgroundColor = (emotion?: string) => {
    const colorMap: Record<string, string> = {
      'calm': 'bg-blue-50',
      'happy': 'bg-yellow-50',
      'sad': 'bg-indigo-50',
      'anxious': 'bg-red-50',
      'excited': 'bg-orange-50',
      'nostalgic': 'bg-amber-50',
      'confused': 'bg-purple-50',
      'hopeful': 'bg-emerald-50',
      'determined': 'bg-sky-50',
      'peaceful': 'bg-green-50',
      'angry': 'bg-rose-50',
      'disappointed': 'bg-slate-50',
      'grateful': 'bg-teal-50',
      'proud': 'bg-fuchsia-50',
      'lonely': 'bg-violet-50'
    };
    
    return emotion && colorMap[emotion] ? colorMap[emotion] : 'bg-gray-50';
  };

  // 重试加载图片
  const retryLoadImage = () => {
    // 如果是base64图像，不尝试重新加载
    if (imageUrl && imageUrl.startsWith('data:image')) {
      toast({
        title: "无法重新加载",
        description: "AI生成的图像无法重新加载，请尝试在写作页面重新生成。",
        variant: "destructive",
      });
      return;
    }
    
    if (hasGallery && emotion) {
      setImageError(false);
      setImageLoaded(false);
      // 生成新的随机种子
      const seed = Date.now();
      const newUrl = `https://picsum.photos/seed/${emotion}-manual-${seed}/800/600`;
      setImageUrl(newUrl);
      setRetryCount(0);
    }
  };

  // 获取内容的第一段作为预览
  const getContentPreview = (text: string) => {
    if (!text) return '';
    // 获取第一段或者前100个字符
    const firstParagraph = text.split('\n')[0];
    return truncateContent(firstParagraph);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative aspect-video">
        {hasGallery && imageUrl && !imageError ? (
          <>
            {!imageLoaded && (
              <div className={`w-full h-full flex items-center justify-center ${getEmotionBackgroundColor(emotion)}`}>
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2"></div>
                  <span className="text-xs text-muted-foreground">加载图片中...</span>
                </div>
              </div>
            )}
            <Image
              src={imageUrl}
              alt="情绪画廊图片"
              fill
              className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              unoptimized={!imageUrl.startsWith('data:image')} // 仅对非base64图像禁用优化
            />
          </>
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${hasGallery && emotion ? getEmotionBackgroundColor(emotion) : 'bg-muted'}`}>
            <div className="flex flex-col items-center space-y-2">
              {hasGallery && imageError ? (
                <>
                  <PenLine className="h-12 w-12 text-muted-foreground opacity-50" />
                  <span className="text-sm text-muted-foreground">图片加载失败</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs"
                    onClick={retryLoadImage}
                  >
                    点击重试
                  </Button>
                </>
              ) : (
                <>
                  <PenLine className="h-12 w-12 text-muted-foreground opacity-50" />
                  <span className="text-sm text-muted-foreground">仅文字内容</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(date)}
          </div>
          {hasGallery && emotion && (
            <div className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 ${getEmotionColorClass(emotion)}`}>
              <Heart className="h-3 w-3" />
              <span>{getEmotionName(emotion)}</span>
            </div>
          )}
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full text-left p-0 h-auto flex-1 flex flex-col items-start justify-start">
              <div className="w-full space-y-2">
                {prompt && (
                  <div className="w-full">
                    <p className="text-sm text-muted-foreground italic line-clamp-1 w-full text-left overflow-hidden">
                      {prompt}
                    </p>
                  </div>
                )}
                <div className="w-full">
                  <p className="text-sm line-clamp-3 w-full text-left">{getContentPreview(content)}</p>
                </div>
              </div>
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {formatDate(date)}的创作
                {hasGallery && emotion && (
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full inline-flex items-center ${getEmotionColorClass(emotion)}`}>
                    <Heart className="h-3 w-3 mr-1" />
                    {getEmotionName(emotion)}
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              {prompt && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-muted-foreground italic">{prompt}</p>
                </div>
              )}

              {hasGallery && imageUrl ? (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt="情绪画廊图片"
                    fill
                    className="object-cover"
                    onError={handleImageError}
                    unoptimized // 禁用Next.js图像优化
                  />
                  {imageError && (
                    <div className={`absolute inset-0 flex items-center justify-center ${getEmotionBackgroundColor(emotion)}`}>
                      <div className="text-center p-4">
                        <p className="text-sm text-muted-foreground">图片加载失败</p>
                        <p className="text-xs text-muted-foreground mt-1">情绪：{getEmotionName(emotion)}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2 text-xs"
                          onClick={retryLoadImage}
                        >
                          点击重试
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              <div className="whitespace-pre-wrap">{content}</div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}