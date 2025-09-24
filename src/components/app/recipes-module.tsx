
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

  const recipesContent = (
      <div className="space-y-6 pt-2">
        {result && result.map(({ extractedColor, recipe }) => (
          <Card key={extractedColor.hex} className="bg-background/30 dark:bg-black/30">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border-2 border-white/20 dark:border-white/20"
                  style={{ backgroundColor: extractedColor.hex.startsWith('#') ? extractedColor.hex : `#${extractedColor.hex}` }}
                />
                <div>
                  <CardTitle className="text-xl">
                    {extractedColor.name}
                  </CardTitle>
                  <CardDescription className="font-mono text-muted-foreground">
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
    );


  return (
    <Card className="glassmorphism">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-teal-300">auto_awesome</span>
          <div>
            <CardTitle className="font-bold text-xl">
              3. Create Recipes
            </CardTitle>
            <CardDescription className="text-muted-foreground">
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

        {(isLoading && !result) && (
          <div className="text-center p-4">
            <Loader />
            <p className="text-muted-foreground mt-2">
              AI is mixing your colors...
            </p>
          </div>
        )}
        {result && (
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-bold">View Recipes</AccordionTrigger>
              <AccordionContent>
              {isLoading ? (
                  <div className="text-center p-4">
                    <Loader />
                    <p className="text-muted-foreground mt-2">AI is mixing your colors...</p>
                  </div>
              ) : (
                recipesContent
              )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
