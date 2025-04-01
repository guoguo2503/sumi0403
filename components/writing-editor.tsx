'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface WritingEditorProps {
  prompt?: string;
  onSubmit: (content: string) => void;
  className?: string;
  disabled?: boolean;
}

export function WritingEditor({ prompt, onSubmit, className, disabled = false }: WritingEditorProps) {
  const [content, setContent] = useState('');
  const [hasStartedWriting, setHasStartedWriting] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5); // 5秒计时
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 自动保存到localStorage
  useEffect(() => {
    const savedContent = localStorage.getItem('draftContent');
    if (savedContent) {
      setContent(savedContent);
      
      // 如果有保存的内容，立即启动计时器
      // 这里不需要等待用户输入就开始计时
      if (!hasStartedWriting) {
        setHasStartedWriting(true);
        startTimer();
      }
    }
  }, []);

  useEffect(() => {
    if (content) {
      localStorage.setItem('draftContent', content);
    }
  }, [content]);

  // 开始计时器
  const startTimer = () => {
    // 清除任何已存在的计时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // 启动新的计时器
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // 时间到，显示按钮
          setShowButton(true);
          
          // 清除计时器
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 处理用户输入
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // 如果是第一次开始写作，启动计时器
    if (!hasStartedWriting && newContent.trim()) {
      setHasStartedWriting(true);
      // 重置并启动计时器
      setTimeLeft(5);
      startTimer();
    }
  };

  // 清理计时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // 调试用：打印状态
  useEffect(() => {
    console.log(`Time left: ${timeLeft}, Show button: ${showButton}, Has started: ${hasStartedWriting}`);
  }, [timeLeft, showButton, hasStartedWriting]);

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: '内容不能为空',
        description: '请输入一些文字再提交。',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 清除草稿
      localStorage.removeItem('draftContent');
      
      // 提交内容
      onSubmit(content);
      
      // 移除成功提示toast，由父组件处理
    } catch (error) {
      toast({
        title: '提交失败',
        description: '处理过程中出现错误，请稍后重试。',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      {prompt && (
        <div className="mb-4 p-3 bg-muted rounded-md">
          <p className="text-muted-foreground italic">{prompt}</p>
        </div>
      )}
      
      <Textarea
        value={content}
        onChange={handleContentChange}
        placeholder="开始写作..."
        className="min-h-[200px] mb-4 border-0 shadow-none focus-visible:ring-0 p-0"
        disabled={isSubmitting || disabled}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex-1"></div>
        
        {(showButton || timeLeft === 0) && (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim() || disabled}
          >
            {isSubmitting ? '提交中...' : '完成'}
          </Button>
        )}
      </div>
    </div>
  );
}