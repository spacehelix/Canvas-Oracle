"use client";

import React, { useState, useMemo } from "react";
import { marked } from "marked";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "./loader";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


type CritiqueModuleProps = {
  onGenerate: (topics: string[]) => void;
  isLoading: boolean;
  result: string | null;
  isImageUploaded: boolean;
};

const CRITIQUE_TOPICS = ["Color Theory", "Composition", "Originality", "Execution"];
const GRADIENT_CLASSES = ["gradient-border-1", "gradient-border-2", "gradient-border-3", "gradient-border-4"];

export default function CritiqueModule({ onGenerate, isLoading, result, isImageUploaded }: CritiqueModuleProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleGenerateClick = () => {
    if (selectedTopics.length > 0) {
      onGenerate(selectedTopics);
    }
  };
  
  const renderedCritique = useMemo(() => {
    if (!result) return null;
    // In a real-world app, you should use a sanitizer like DOMPurify here
    // for security. For this example, we'll trust the AI output.
    // import DOMPurify from 'dompurify';
    // const cleanHtml = DOMPurify.sanitize(dirtyHtml);
    return { __html: marked.parse(result) as string };
  }, [result]);


  return (
    <Card className="glassmorphism">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-red-400">palette</span>
          <div>
            <CardTitle className="font-bold text-xl">1. Select Critique Focus</CardTitle>
            <CardDescription className="text-muted-foreground">
              Choose aspects of your art for the AI to analyze.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4">
          {CRITIQUE_TOPICS.map((topic, index) => (
            <button
              key={topic}
              onClick={() => handleTopicToggle(topic)}
              className={cn(
                "px-6 py-2 rounded-md text-sm font-semibold transition-all",
                "border-2 border-gray-600 dark:border-gray-600 dark:hover:bg-gray-700/50",
                "light:border-gray-300 light:hover:bg-gray-200/50",
                selectedTopics.includes(topic)
                  ? `gradient-border ${GRADIENT_CLASSES[index]}`
                  : "border-2 border-border hover:bg-accent/10"
              )}
            >
              {topic}
            </button>
          ))}
        </div>
        
        <Button
          onClick={handleGenerateClick}
          disabled={!isImageUploaded || selectedTopics.length === 0 || isLoading}
          className="w-full font-bold text-white bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-500 hover:to-teal-600 transition-all"
          size="lg"
        >
          {isLoading ? <Loader /> : <span className="material-symbols-outlined mr-2">auto_fix_high</span>}
          Generate Critique
        </Button>

        {(isLoading && !result) && (
          <div className="text-center p-4">
            <Loader />
            <p className="text-muted-foreground mt-2">AI is analyzing your work...</p>
          </div>
        )}
        {result && (
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-bold">View Critique</AccordionTrigger>
              <AccordionContent>
                {isLoading ? (
                  <div className="text-center p-4">
                    <Loader />
                    <p className="text-muted-foreground mt-2">AI is analyzing your work...</p>
                  </div>
                ) : (
                  renderedCritique && (
                    <div className="p-4 bg-background/50 rounded-lg prose dark:prose-invert max-w-none">
                       <div
                        className="markdown-content"
                        dangerouslySetInnerHTML={renderedCritique}
                      />
                    </div>
                  )
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
