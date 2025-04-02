'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-8">
      <h2 className="text-xl font-semibold">出现错误</h2>
      <p className="text-muted-foreground text-center">
        {error.message || '抱歉，处理您的请求时出错了'}
      </p>
      <Button 
        variant="outline" 
        onClick={reset}
        className="mt-4"
      >
        重试
      </Button>
    </div>
  );
} 