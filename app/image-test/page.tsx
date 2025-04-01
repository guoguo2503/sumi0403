'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ImageIcon, Loader2, InfoIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';

// 类型定义
type ErrorResponseType = {
  error?: string;
  details?: string;
};

type TranslationResponseType = {
  translatedText: string;
};

type ImageGenerationResponseType = {
  data?: {
    b64_json?: string;
  }[];
};

export default function ImageTestPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [translatedPrompt, setTranslatedPrompt] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    setTranslatedPrompt(null);
  };

  const clearError = () => {
    setError(null);
    setErrorDetails(null);
  };

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: '提示不能为空',
        description: '请输入一段描述以生成图片',
        variant: 'destructive',
      });
      return;
    }

    clearError();
    setIsGenerating(true);
    setImageUrl(null);
    setTranslatedPrompt(null);

    try {
      // 步骤1：使用大模型API将用户输入翻译成英文
      const translationResponse = await fetch('/api/translate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: prompt.trim() }),
      });
      
      // 安全地解析响应
      let translationData: unknown;
      try {
        translationData = await translationResponse.json();
      } catch (e) {
        throw new Error('解析翻译响应失败', { cause: '无效的JSON响应' });
      }
      
      if (!translationResponse.ok) {
        // 处理错误响应
        const errorData = translationData as Partial<ErrorResponseType>;
        throw new Error(errorData.error || '翻译失败', { 
          cause: errorData.details 
        });
      }
      
      // 类型保护：确保translationData有正确的结构
      if (
        !translationData || 
        typeof translationData !== 'object' ||
        !('translatedText' in translationData) ||
        typeof (translationData as any).translatedText !== 'string'
      ) {
        throw new Error('翻译服务返回的数据格式无效', {
          cause: '翻译结果缺少必要字段或格式不正确'
        });
      }
      
      // 现在可以安全地断言类型
      const typedTranslationData = translationData as TranslationResponseType;
      const englishPrompt = typedTranslationData.translatedText;
      
      // 保存翻译后的提示词以便在UI中显示
      setTranslatedPrompt(englishPrompt);
      
      console.log('原始提示词:', prompt.trim());
      console.log('翻译后提示词:', englishPrompt);

      // 步骤2：使用翻译后的英文提示词生成图片
      // 添加超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: englishPrompt }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // 安全地解析响应
      let imageData: unknown;
      try {
        imageData = await response.json();
      } catch (e) {
        throw new Error('解析图像响应失败', { cause: '无效的JSON响应' });
      }

      if (!response.ok) {
        // 处理错误响应
        const errorData = imageData as Partial<ErrorResponseType>;
        throw new Error(errorData.error || '图像生成失败', { 
          cause: errorData.details 
        });
      }

      // 类型保护：确保imageData有正确的结构
      if (
        !imageData || 
        typeof imageData !== 'object' ||
        !('data' in imageData) ||
        !Array.isArray((imageData as any).data) ||
        !(imageData as any).data.length ||
        typeof (imageData as any).data[0]?.b64_json !== 'string'
      ) {
        throw new Error('图像生成服务返回的数据格式无效', {
          cause: '响应结果缺少必要字段或格式不正确'
        });
      }
      
      // 现在可以安全地断言类型
      const typedImageData = imageData as ImageGenerationResponseType;
      const base64Data = typedImageData.data![0].b64_json!;
      
      // 转换为数据URL
      const imageDataUrl = `data:image/png;base64,${base64Data}`;
      setImageUrl(imageDataUrl);
      
    } catch (error: any) {
      console.error('图像生成错误:', error);
      
      let errorMessage = '生成图片时出错';
      let errorDetail: string | null = null;
      
      if (error.name === 'AbortError') {
        errorMessage = '请求超时，服务器响应时间过长';
      } else if (error instanceof Error) {
        errorMessage = error.message;
        errorDetail = error.cause as string || null;
      }
      
      setError(errorMessage);
      setErrorDetails(errorDetail);
      
      toast({
        title: '生成失败',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTryAgain = () => {
    clearError();
    generateImage();
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">生图测试</h1>
        <Link href="/">
          <Button variant="outline" className="h-9">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </Link>
      </div>

      <Card className="p-6 mb-8">
        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-md flex gap-3 mb-2">
            <InfoIcon className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">提示技巧：</p>
              <ul className="list-disc list-inside space-y-1">
                <li>使用详细、具体的描述会得到更好的结果</li>
                <li>避免要求生成文字，模型很难生成正确的文字</li>
                <li>可以指定图像风格，如"摄影风格"、"油画风格"、"3D渲染"等</li>
                <li>支持中文输入，系统会自动翻译成英文以获得最佳效果</li>
                <li>如果生成失败，可以尝试简化提示词或稍后再试</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="prompt" className="block text-sm font-medium">
              提示词
            </label>
            <Textarea
              id="prompt"
              placeholder="输入提示词来生成图片，例如：'一个美丽的山水风景，阳光照耀在湖面上'"
              value={prompt}
              onChange={handlePromptChange}
              className="min-h-[100px] flex-1"
              disabled={isGenerating}
            />
            <Button 
              onClick={generateImage} 
              disabled={isGenerating || !prompt.trim()}
              className="w-full mt-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成中
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  生成图片
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {(imageUrl || isGenerating || error) && (
        <Card className="p-6 overflow-hidden">
          <h2 className="text-xl font-semibold mb-4">生成结果</h2>
          
          {isGenerating && (
            <div className="flex justify-center items-center min-h-[300px] bg-muted/30 rounded-md">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">正在生成图片，请稍候...</p>
                <p className="text-xs text-muted-foreground">图片生成可能需要10-30秒</p>
              </div>
            </div>
          )}

          {error && !isGenerating && (
            <div className="flex flex-col justify-center items-center min-h-[300px] bg-destructive/10 rounded-md p-6">
              <div className="text-center max-w-md">
                <div className="flex justify-center mb-4">
                  <AlertCircle className="h-12 w-12 text-destructive" />
                </div>
                <p className="text-destructive font-medium text-lg mb-2">生成失败</p>
                <p className="text-muted-foreground mb-4">{error}</p>
                
                {errorDetails && (
                  <div className="bg-background/80 p-3 rounded-md text-left text-xs text-muted-foreground mb-6 max-h-[150px] overflow-y-auto">
                    <p className="font-mono whitespace-pre-wrap">{errorDetails}</p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={handleTryAgain}
                    className="flex items-center"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    重试
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setPrompt(prompt.split(',')[0] + ", simple style");
                      clearError();
                    }}
                  >
                    简化提示词
                  </Button>
                </div>
              </div>
            </div>
          )}

          {imageUrl && !isGenerating && (
            <div className="rounded-md overflow-hidden relative">
              <div className="aspect-[4/3] relative">
                <Image
                  src={imageUrl}
                  alt={prompt}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="mt-4 bg-muted/30 p-3 rounded-md space-y-2">
                <p className="text-sm text-muted-foreground">{prompt}</p>
                {translatedPrompt && (
                  <p className="text-xs text-muted-foreground italic">
                    翻译后的提示词: {translatedPrompt}
                  </p>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
} 