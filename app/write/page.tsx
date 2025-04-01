"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { WritingEditor } from "@/components/writing-editor";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { generateImageFromText, analyzeEmotion } from "@/lib/image-generation";

// 备用提示
const fallbackPrompts = [
  "描述一个让你感到平静的地方，尽可能使用感官细节。",
  "回忆一段美好的记忆，为什么它对你如此重要？",
  "如果你的情绪是一种天气，今天是什么样的天气？描述一下。",
  "写下一件让你感到快乐的小事，并思考为什么它会带给你喜悦。",
  "想象你在一个陌生的城市醒来，描述你看到、听到和感受到的。"
];

// 完整的50个写作提示列表
const writingPrompts = [
  "描述一个让你感到平静的地方，尽可能使用感官细节。",
  "回忆一个改变了你人生轨迹的决定，你当时的考虑是什么？",
  "如果你能与过去的自己对话，你最想告诉他/她什么？",
  "想象你醒来发现自己获得了一种超能力，这会如何改变你的日常生活？",
  "描述一个让你感到无比快乐的时刻，是什么让这一刻如此特别？",
  "写下一次你面对挑战时的经历，你从中学到了什么？",
  "想象你在一片陌生的森林中迷路，描述你的所见所感。",
  "如果你的情绪是一种天气，今天是什么样的天气？为什么？",
  "描述一个对你产生深远影响的人，他/她有什么特质？",
  "想象你收到了来自未来的一封信，信中会告诉你什么？",
  "描述一个你很想去但从未去过的地方，为什么它对你有吸引力？",
  "写下一个童年的记忆，并思考它如何塑造了今天的你。",
  "如果你可以与历史上的任何人共进晚餐，你会选择谁？为什么？",
  "想象你在一条陌生的街道上发现了一扇神秘的门，描述你推开门后看到了什么。",
  "描述一个你曾经害怕但后来克服的事物，这个过程教会了你什么？",
  "你最珍视的物品是什么？讲述它背后的故事。",
  "如果你的生活是一本书，现在这一章的标题会是什么？",
  "描述一次让你感到完全自由的体验。",
  "写下一个你不再与之联系的人，你想对他们说些什么？",
  "想象五年后的自己，你希望那时的生活是什么样子？",
  "描述一个在你生活中存在的但往往被忽视的美丽事物。",
  "如果你能掌握任何一种技能或才艺，不需要努力，你会选择什么？",
  "写下一个改变了你对世界看法的时刻。",
  "描述一次你感受到强烈情感的经历（可以是喜悦、悲伤、愤怒等）。",
  "如果你的生活有配乐，现在播放的是什么歌？为什么？",
  "想象你发现了一个能让你穿越到任何时间的机器，你会去哪个时期？",
  "描述一个你曾经相信但现在已经改变的观念。",
  "写下一个让你感到充满好奇的问题，并尝试探索可能的答案。",
  "描述一个你认为完美的一天，从早到晚。",
  "如果你可以创造一个新的传统或习俗，它会是什么样子？",
  "想象你在森林中发现了一种未知的生物，描述它的样子和行为。",
  "写下一个让你感到敬畏的自然现象。",
  "描述一个你曾经失败但从中学到重要一课的经历。",
  "如果你可以解决世界上的一个问题，你会选择哪一个？为什么？",
  "想象你发现了一本描述你未来的书，你会选择读完它吗？为什么？",
  "描述一种你很享受但很少有机会做的活动。",
  "写下一个让你感到感激的日常小事。",
  "如果你是一种动物，你觉得你会是什么？为什么？",
  "描述一次你做出了勇敢决定的经历。",
  "想象你被困在一个只有一种颜色的世界里，那会是什么样子？",
  "写下一个你希望别人理解的关于你自己的事情。",
  "描述你生活中的一个矛盾或两难处境。",
  "如果你可以与任何虚构人物共度一天，你会选择谁？你们会做什么？",
  "想象你在一个陌生的文化中生活了一年，这会如何改变你？",
  "描述一次你感受到深刻连接的时刻（可以是与人、自然或某种体验）。",
  "写下一个你想要实现但还未开始的目标，是什么阻碍了你？",
  "如果你可以看到任何历史事件，你会选择什么？",
  "描述你在生活中感到最有活力和充实的时刻。",
  "想象未来人类生活的样子，一百年后的世界会是什么样子？",
  "写下一段对某个让你感到困惑或矛盾的话题的思考。"
];

export default function WritePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = useState(false);
  const [pendingContent, setPendingContent] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [toastExiting, setToastExiting] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [dominantEmotion, setDominantEmotion] = useState<string>("");

  useEffect(() => {
    setIsMounted(true);
    
    if (searchParams.get("type") === "prompt" && typeof window !== 'undefined') {
      // 从localStorage获取生成的提示
      const savedPrompt = localStorage.getItem("currentPrompt");
      if (savedPrompt) {
        setPrompt(savedPrompt);
        // 使用后清除，避免下次访问仍然显示
        localStorage.removeItem("currentPrompt");
        
        // 保存到已使用提示历史
        const usedPromptsHistory = JSON.parse(localStorage.getItem("usedPrompts") || "[]");
        if (!usedPromptsHistory.includes(savedPrompt)) {
          usedPromptsHistory.push(savedPrompt);
          localStorage.setItem("usedPrompts", JSON.stringify(usedPromptsHistory));
        }
      } else {
        // 如果没有保存的提示，选择一个新的随机提示
        
        // 获取已使用过的提示历史
        const usedPromptsHistory = JSON.parse(localStorage.getItem("usedPrompts") || "[]");
        
        // 从完整的50个提示中选择
        let availablePrompts = [...writingPrompts]; // 引用app/page.tsx中的完整提示列表
        if (usedPromptsHistory.length > 0 && usedPromptsHistory.length < writingPrompts.length) {
          availablePrompts = writingPrompts.filter(prompt => !usedPromptsHistory.includes(prompt));
        }
        
        // 如果所有提示都用过了，重置历史
        if (availablePrompts.length === 0) {
          localStorage.setItem("usedPrompts", JSON.stringify([]));
          availablePrompts = [...writingPrompts];
        }
        
        // 从可用提示中随机选择一个
        const randomIndex = Math.floor(Math.random() * availablePrompts.length);
        const randomPrompt = availablePrompts[randomIndex];
        
        // 更新使用历史
        usedPromptsHistory.push(randomPrompt);
        localStorage.setItem("usedPrompts", JSON.stringify(usedPromptsHistory));
        
        setPrompt(randomPrompt);
      }
    }
  }, [searchParams]);

  const handleSubmit = (content: string) => {
    if (!isMounted) return;
    
    // 保存内容以备后用
    setPendingContent(content);
    
    // 预先分析情绪，方便在对话框中展示
    const emotion = analyzeEmotion(content);
    setDominantEmotion(emotion);
    
    // 显示情绪画廊选择对话框
    setShowGalleryDialog(true);
  };

  const saveCreation = async (generateGallery: boolean) => {
    if (!pendingContent || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      let imageUrl = "";
      
      // 如果需要生成情绪画廊
      if (generateGallery) {
        setGeneratingImage(true);
        
        try {
          // 使用AI生成图像 - 现在是异步操作
          const generatedImageUrl = await generateImageFromText(pendingContent);
          imageUrl = generatedImageUrl;
          console.log("生成的AI图片URL:", imageUrl);
        } catch (error) {
          console.error("生成图片时出错:", error);
          // 出错时使用更简单的备用图片URL
          const seed = Date.now();
          imageUrl = `https://picsum.photos/seed/error-${seed}/800/600`;
        } finally {
          setGeneratingImage(false);
        }
      }
      
      // 保存内容到本地存储
      const creations = JSON.parse(localStorage.getItem("creations") || "[]");
      const newCreation = {
        id: Date.now(),
        content: pendingContent,
        prompt: prompt || undefined,
        date: new Date().toISOString(),
        image: imageUrl,
        hasGallery: generateGallery,
        emotion: generateGallery ? dominantEmotion : undefined
      };
      
      // 先进行存储以确保数据不丢失
      creations.unshift(newCreation);
      localStorage.setItem("creations", JSON.stringify(creations));
      
      // 清除草稿和临时内容
      localStorage.removeItem('draftContent');
      setPendingContent("");
      
      // 关闭对话框，显示成功提示
      setShowGalleryDialog(false);
      
      // 显示温和的成功提示
      setSuccessMessage(generateGallery ? "已保存并创建画廊" : "已保存创作");
      setShowSuccess(true);
      setToastExiting(false);
      setRedirecting(true);
      
      // 清除任何现有的超时
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      
      // 2秒后开始退出动画
      toastTimeoutRef.current = setTimeout(() => {
        setToastExiting(true);
        
        // 动画结束后隐藏提示并跳转
        setTimeout(() => {
          setShowSuccess(false);
          router.push("/history");
        }, 300); // 动画持续时间
      }, 2000);
    } catch (error) {
      console.error("Error submitting content:", error);
      toast({
        title: "保存失败",
        description: "保存创作时出现错误，请稍后重试。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 清理超时
  useEffect(() => {
    // 组件卸载时清理
    const cleanup = () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
    
    return cleanup;
  }, []);
  
  if (!isMounted) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <Card className="p-8 rounded-lg border shadow-sm">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12 relative">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">写作空间</h1>
        <Link href="/">
          <Button variant="outline" disabled={redirecting}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>
        </Link>
      </div>

      <Card className="p-8 rounded-lg border shadow-sm">
        <WritingEditor
          prompt={prompt}
          onSubmit={handleSubmit}
          className="mb-4"
          disabled={redirecting}
        />
      </Card>
      
      {/* 温和的成功提示 */}
      {showSuccess && (
        <div className={`fixed bottom-6 right-6 bg-background/95 backdrop-blur-sm border border-border shadow-sm rounded-full py-2 px-4 flex items-center space-x-2 text-sm ${toastExiting ? 'success-toast-exit' : 'success-toast-enter'}`}>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span>{successMessage}</span>
        </div>
      )}
      
      {/* 情绪画廊选择对话框 */}
      <Dialog open={showGalleryDialog} onOpenChange={(open) => {
        if (!open && !isSubmitting && !generatingImage) setShowGalleryDialog(false);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>是否生成情绪画廊？</DialogTitle>
            <DialogDescription>
              我们可以根据您的文字内容，创建一幅艺术作品，表达您的情绪和想法。
              {dominantEmotion && (
                <p className="mt-2 text-primary">
                  检测到的主要情绪: <span className="font-medium">{dominantEmotion === 'calm' ? '平静' : 
                    dominantEmotion === 'happy' ? '快乐' : 
                    dominantEmotion === 'sad' ? '悲伤' : 
                    dominantEmotion === 'anxious' ? '焦虑' :
                    dominantEmotion === 'excited' ? '兴奋' :
                    dominantEmotion === 'nostalgic' ? '怀旧' :
                    dominantEmotion === 'confused' ? '困惑' :
                    dominantEmotion === 'hopeful' ? '希望' : 
                    dominantEmotion === 'determined' ? '坚定' : '平和'}</span>
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="sm:justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting || generatingImage}
              onClick={() => setShowGalleryDialog(false)}
            >
              取消
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                disabled={isSubmitting || generatingImage}
                onClick={() => saveCreation(false)}
              >
                仅保存文字
              </Button>
              <Button
                type="button"
                variant="default"
                className="bg-primary"
                disabled={isSubmitting || generatingImage}
                onClick={() => saveCreation(true)}
              >
                {isSubmitting || generatingImage ? "生成中..." : "生成情绪画廊"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}