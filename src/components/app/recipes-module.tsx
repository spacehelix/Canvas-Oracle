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
    <Card className="glassmorphism">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-teal-300">auto_awesome</span>
          <div>
            <CardTitle className="font-bold text-xl">
              3. Create Recipes
            </CardTitle>
            <CardDescription className="text-gray-300">
              Generate paint mixing recipes for your extracted colors.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button
          onClick={onGenerate}
          disabled={!isPaletteExtracted || isLoading}
          className="w-full font-bold text-white bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 transition-all"
          size="lg"
        >
          {isLoading ? <Loader /> : <span className="material-symbols-outlined mr-2">blender</span>}
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
            <h4 className="font-bold text-lg">Mixing Recipes:</h4>
            <div className="space-y-6">
              {result.map(({ extractedColor, recipe }) => (
                <Card key={extractedColor.hex} className="bg-black/30">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full border-2 border-white/20"
                        style={{ backgroundColor: extractedColor.hex }}
                      />
                      <div>
                        <CardTitle className="text-xl">
                          {extractedColor.name}
                        </CardTitle>
                        <CardDescription className="font-mono text-gray-400">
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
                            <span className="text-gray-400">
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
