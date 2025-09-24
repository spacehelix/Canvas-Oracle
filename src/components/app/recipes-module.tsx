"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brush, Sparkles } from "lucide-react";
import { Loader } from "./loader";
import type { MixingRecipe } from "@/lib/types";
import { Progress } from "@/components/ui/progress";

type RecipesModuleProps = {
  onGenerate: () => void;
  isLoading: boolean;
  result: MixingRecipe[] | null;
  isPaletteExtracted: boolean;
};

export default function RecipesModule({
  onGenerate,
  isLoading,
  result,
  isPaletteExtracted,
}: RecipesModuleProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Brush className="w-8 h-8 text-primary" />
          <div>
            <CardTitle className="font-headline text-2xl">
              3. Create Recipes
            </CardTitle>
            <CardDescription>
              Generate paint mixing recipes for your extracted colors.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button
          onClick={onGenerate}
          disabled={!isPaletteExtracted || isLoading}
          className="w-full font-bold"
          size="lg"
        >
          {isLoading ? <Loader /> : <Sparkles className="mr-2 h-4 w-4" />}
          Generate Mixing Recipes
        </Button>

        {isLoading && !result && (
          <div className="text-center p-4">
            <Loader />
            <p className="text-muted-foreground mt-2">
              AI is mixing your colors...
            </p>
          </div>
        )}
        {result && (
          <div className="space-y-4">
            <h4 className="font-bold font-headline text-lg">Mixing Recipes:</h4>
            <div className="space-y-6">
              {result.map(({ extractedColor, recipe }) => (
                <Card key={extractedColor.hex} className="bg-secondary/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full border-2 border-border"
                        style={{ backgroundColor: extractedColor.hex }}
                      />
                      <div>
                        <CardTitle className="text-xl">
                          {extractedColor.name}
                        </CardTitle>
                        <CardDescription className="font-mono">
                          {extractedColor.hex}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recipe.map((ingredient) => (
                        <div key={ingredient.name} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">
                              {ingredient.name}
                            </span>
                            <span className="text-muted-foreground">
                              {ingredient.percent}%
                            </span>
                          </div>
                          <Progress
                            value={ingredient.percent}
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
