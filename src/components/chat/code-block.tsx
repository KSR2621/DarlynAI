"use client"

import { useState, memo } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  language: string;
  value: string;
}

export const CodeBlock = memo(({ language, value }: CodeBlockProps) => {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="relative rounded-md bg-secondary my-2">
      <div className="flex items-center justify-between py-1.5 px-3 border-b">
        <span className="text-xs text-muted-foreground">{language || "code"}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleCopy}
        >
          {hasCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
      <pre className="p-3 text-sm overflow-x-auto">
        <code>{value}</code>
      </pre>
    </div>
  );
});

CodeBlock.displayName = "CodeBlock";
