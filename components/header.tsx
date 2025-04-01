"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Moon, Sun, History, ImageIcon } from "lucide-react";
import { useTheme } from "next-themes";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Bolt
          </Link>

          <nav className="flex items-center gap-4">
            <Link href="/history">
              <Button variant="ghost" size="sm">
                <History className="h-5 w-5 mr-2" />
                历史创作
              </Button>
            </Link>

            <Link href="/image-test">
              <Button variant="ghost" size="sm">
                <ImageIcon className="h-5 w-5 mr-2" />
                生图测试
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">切换主题</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}