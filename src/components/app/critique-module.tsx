"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanLine, Sparkles } from "lucide-react";
import { Loader } from "./loader";

type CritiqueModuleProps = {
  onGenerate: (topics: string[]) => void;
  isLoading: boolean;
  result: string | null;
  isImageUploaded: boolean;
};

const CRITIQUE_TOPICS = ["Color Theory", "Composition", "Originality", "Execution"];

export default function CritiqueModule({
  onGenerate,
  isLoading,
  result,
  isImageUploaded,
}: CritiqueModuleProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const handleGenerateClick = () => {
    if (selectedTopics.length > 0) {
      onGenerate(selectedTopics);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <ScanLine className="w-8 h-8 text-primary" />
          <div>
            <CardTitle className="font-headline text-2xl">
              1. Select Critique Focus
            </CardTitle>
            <CardDescription>
              Choose aspects of your art for the AI to analyze.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {CRITIQUE_TOPICS.map((topic) => (
            <Button
              key={topic}
              variant={selectedTopics.includes(topic) ? "default" : "outline"}
              onClick={() => handleTopicToggle(topic)}
              size="sm"
            >
              {topic}
            </Button>
          ))}
        </div>
        <Button
          onClick={handleGenerateClick}
          disabled={!isImageUploaded || selectedTopics.length === 0 || isLoading}
          className="w-full font-bold"
          size="lg"
        >
          {isLoading ? <Loader /> : <Sparkles className="mr-2 h-4 w-4" />}
          Generate Critique
        </Button>
        {isLoading && !result && (
          <div className="text-center p-4">
            <Loader />
            <p className="text-muted-foreground mt-2">
              AI is analyzing your work...
            </p>
          </div>
        )}
        {result && (
          <div className="p-4 bg-secondary rounded-lg">
            <h4 className="font-bold font-headline mb-2 text-lg">Critique Result:</h4>
            <p className="text-secondary-foreground whitespace-pre-wrap leading-relaxed">
              {result}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
