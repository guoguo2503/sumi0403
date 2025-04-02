import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8">
      <h2 className="text-2xl font-semibold">页面未找到</h2>
      <p className="text-muted-foreground text-center">
        抱歉，您请求的页面不存在
      </p>
      <Button asChild className="mt-4">
        <Link href="/">
          返回首页
        </Link>
      </Button>
    </div>
  );
} 