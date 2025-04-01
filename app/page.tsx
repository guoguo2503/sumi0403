"use client";

import { ArrowRight, Sparkles, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useState, useEffect } from "react";
import { generateWritingPrompt } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// 备用提示，当API调用失败时使用
const fallbackPrompts = [
  "描述一个让你感到平静的地方，尽可能使用感官细节。",
  "回忆一个令你感到骄傲的时刻，是什么让这个时刻如此特别？",
  "如果你能给过去的自己写一封信，你会告诉他/她什么？",
  "描述一个挑战，以及你如何面对它。",
  "想象一个与现实生活完全不同的一天，写下你的体验。"
];

// 写作提示列表
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

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // 确保我们只在客户端运行
  useEffect(() => {
    setIsMounted(true);
    // 清除任何可能存在的旧提示
    if (typeof window !== 'undefined') {
      localStorage.removeItem("currentPrompt");
    }
  }, []);

  const getRandomFallbackPrompt = () => {
    return fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)];
  };

  const handlePromptClick = async () => {
    if (!isMounted) return;
    
    // 获取已使用过的提示历史
    const usedPromptsHistory = JSON.parse(localStorage.getItem("usedPrompts") || "[]");
    
    // 过滤出未使用过的提示
    let availablePrompts = [...writingPrompts];
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
    
    // 保存到localStorage以供写作页面使用
    localStorage.setItem("currentPrompt", randomPrompt);
    
    // 不再显示toast通知，直接跳转到写作页面
    router.push("/write?type=prompt");
  };

  const handleUseFallbackPrompt = () => {
    if (!isMounted) return;
    
    const fallbackPrompt = getRandomFallbackPrompt();
    localStorage.setItem("currentPrompt", fallbackPrompt);
    
    // 直接跳转到写作页面，不显示提示
    router.push("/write?type=prompt");
  };

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Creation Options */}
      <section className="min-h-screen flex items-center justify-center bg-muted/50">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow bg-background/50 backdrop-blur">
              <div className="space-y-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">今日提示</h2>
                
                <Button 
                  className="w-full text-lg h-12"
                  onClick={handlePromptClick}
                >
                  获取随机提示
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow bg-background/50 backdrop-blur">
              <Link href="/write?type=free">
                <div className="space-y-6">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <History className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">灵感随想</h2>
                  <Button className="w-full text-lg h-12">
                    开始创作
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}