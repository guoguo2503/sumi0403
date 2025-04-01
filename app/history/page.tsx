"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { HistoryCard } from "@/components/history-card";
import { type EmotionType } from "@/lib/image-generation";

interface Creation {
  id: number;
  content: string;
  prompt?: string;
  date: string;
  image: string;
  hasGallery: boolean;
  emotion?: EmotionType;
}

export default function HistoryPage() {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [filterEmotion, setFilterEmotion] = useState<EmotionType | 'all'>('all');
  const [showGalleryOnly, setShowGalleryOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    setIsLoading(true);
    
    if (typeof window !== 'undefined') {
      // 添加小延迟以确保良好的加载体验
      setTimeout(() => {
        const savedCreations = JSON.parse(localStorage.getItem("creations") || "[]");
        setCreations(savedCreations);
        setIsLoading(false);
      }, 300);
    }
  }, []);
  
  // 过滤历史记录
  const filteredCreations = creations.filter(creation => {
    if (showGalleryOnly && !creation.hasGallery) {
      return false;
    }
    
    if (filterEmotion !== 'all' && creation.emotion !== filterEmotion) {
      return false;
    }
    
    return true;
  });
  
  // 获取所有可用的情绪类型
  const availableEmotions = creations
    .filter(c => c.hasGallery && c.emotion)
    .map(c => c.emotion as EmotionType)
    .filter((value, index, self) => self.indexOf(value) === index); // 去重
  
  // 情绪类型的中文名称映射
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
    'all': '全部'
  };
  
  if (!isMounted) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">你的过去</h1>
        <div className="flex items-center gap-2">
          <Link href="/write">
            <Button className="h-9">
              <Pencil className="mr-2 h-4 w-4" />
              重新画图
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="h-9">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回主页
            </Button>
          </Link>
        </div>
      </div>
      
      {creations.length > 0 && (
        <div className="mb-6 bg-muted/40 p-4 rounded-lg">
          <h2 className="text-sm font-medium mb-3">筛选创作</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterEmotion === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterEmotion('all')}
              className="text-xs h-8"
            >
              全部情绪
            </Button>
            
            {availableEmotions.map(emotion => (
              <Button
                key={emotion}
                variant={filterEmotion === emotion ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterEmotion(emotion)}
                className="text-xs h-8"
              >
                {emotionNames[emotion] || emotion}
              </Button>
            ))}
            
            {/* 仅显示情绪画廊切换 */}
            <Button
              variant={showGalleryOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowGalleryOnly(!showGalleryOnly)}
              className="text-xs h-8 ml-auto"
            >
              {showGalleryOnly ? '显示所有' : '仅显示情绪画廊'}
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : creations.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground mb-4">还没有任何创作记录</p>
          <Link href="/write" className="inline-block">
            <Button>开始创作</Button>
          </Link>
        </div>
      ) : filteredCreations.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground mb-4">没有符合筛选条件的创作</p>
          <Button 
            onClick={() => {
              setFilterEmotion('all');
              setShowGalleryOnly(false);
            }}
            className="mt-2"
          >
            重置筛选
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCreations.map((creation) => (
            <div key={creation.id} className="h-full">
              <HistoryCard
                {...creation}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}