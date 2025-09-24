
"use client";

import React, { useState, useCallback, useRef } from "react";
import ImageHandler from "@/components/app/image-handler";
import CritiqueModule from "@/components/app/critique-module";
import PaletteModule from "@/components/app/palette-module";
import RecipesModule from "@/components/app/recipes-module";
import type { Palette, MixingRecipe } from "@/lib/types";
import { extractColorPalette } from "@/ai/flows/extract-color-palette";
import { createMixingRecipes } from "@/ai/flows/generate-color-mixing-recipes";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type RequestType = "critique" | "palette" | "recipes";

export default function Home() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [critiqueResult, setCritiqueResult] = useState<string | null>(null);
  const [paletteResult, setPaletteResult] = useState<Palette | null>(null);
  const [recipesResult, setRecipesResult] = useState<MixingRecipe[] | null>(
    null
  );

  const [isCritiqueLoading, setIsCritiqueLoading] = useState(false);
  const [isPaletteLoading, setIsPaletteLoading] = useState(false);
  const [isRecipesLoading, setIsRecipesLoading] = useState(false);
  
  const clearDrawingRef = useRef<{ clear: () => void }>(null);

  const { toast } = useToast();

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageDataUrl(reader.result as string);
      // Reset all results when a new image is uploaded
      setCritiqueResult(null);
      setPaletteResult(null);
      setRecipesResult(null);
      if(clearDrawingRef.current) {
        clearDrawingRef.current.clear();
      }
    };
    reader.readAsDataURL(file);
  };

  const constructOnDevicePrompt = (
    requestType: RequestType,
    payload: any
  ): string => {
    switch (requestType) {
      case "critique":
        return `You are a world-renowned art critic. Provide a general critique focusing on the following topics: ${payload.topics.join(
          ", "
        )}. You must respond in plain text.`;
      case "recipes":
        return `You are a master painter and colorist. Your task is to create plausible paint mixing recipes for the given list of colors.
For EACH color provided, create a recipe using 1 to 3 common base paint colors (e.g., 'Titanium White', 'Phthalo Blue').
The percentages for each recipe MUST sum to exactly 100%.
Return ONLY a valid JSON array matching this exact schema: [{ "extractedColor": { "name": "...", "hex": "..." }, "recipe": [{ "name": "...", "percent": ... }] }]
Color Palette:
${JSON.stringify(payload.palette)}`;
      case "palette":
        // This case will always fail because on-device AI can't process images with this API,
        // thus it will trigger the fallback.
        return `You are an expert color theorist. Analyze the provided image and extract a color palette. Return ONLY a valid JSON object.`;
      default:
        return "";
    }
  };

  const callCloudFallback = async (requestType: RequestType, payload: any) => {
    try {
      switch (requestType) {
        case "critique":
          const critiqueResponse = await fetch('/api/generate-art-critique', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: payload.image,
              topics: payload.topics,
            }),
          });
          if (!critiqueResponse.ok) throw new Error('Critique request failed');
          const critiqueData = await critiqueResponse.json();
          setCritiqueResult(critiqueData.critique);
          break;
        case "palette":
          const paletteResponse = await extractColorPalette({
            image: payload.image,
          });
          setPaletteResult(paletteResponse);
          break;
        case "recipes":
          const recipesResponse = await createMixingRecipes(payload.palette);
          setRecipesResult(recipesResponse);
          break;
      }
    } catch (error) {
      console.error(`Cloud fallback for ${requestType} failed:`, error);
      toast({
        variant: "destructive",
        title: "Cloud AI Error",
        description: "The request to the cloud AI failed. Please try again.",
      });
    }
  };

  const handleAIRequest = async (requestType: RequestType, payload: any) => {
    const setLoading = {
      critique: setIsCritiqueLoading,
      palette: setIsPaletteLoading,
      recipes: setIsRecipesLoading,
    }[requestType];

    setLoading(true);

    try {
      const canCreate = window.ai && await window.ai.canCreateTextSession();
      if (canCreate === 'readily') {
        console.log(`Using on-device Gemini Nano for ${requestType}...`);
        try {
          const session = await window.ai.createTextSession();
          const prompt = constructOnDevicePrompt(requestType, payload);
          const response = await session.prompt(prompt);

          // Process response
          if (requestType === "critique") {
            setCritiqueResult(response);
          } else if (requestType === "palette") {
            setPaletteResult(JSON.parse(response));
          } else if (requestType === "recipes") {
            setRecipesResult(JSON.parse(response));
          }
          toast({
            title: "On-Device AI Success",
            description: `Generated ${requestType} using Gemini Nano.`,
          });
          session.destroy();
        } catch (e) {
          console.error("On-device AI failed. Falling back to cloud.", e);
          await callCloudFallback(requestType, payload);
        }
      } else {
        console.log("On-device AI not available. Using cloud fallback...");
        await callCloudFallback(requestType, payload);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCritique = (topics: string[]) => {
    if (!imageDataUrl) return;
    handleAIRequest("critique", { image: imageDataUrl, topics });
  };

  const handleExtractPalette = () => {
    if (!imageDataUrl) return;
    handleAIRequest("palette", { image: imageDataUrl });
  };

  const handleGenerateRecipes = () => {
    if (!paletteResult) return;
    handleAIRequest("recipes", { palette: paletteResult });
  };

  return (
    <main className="min-h-screen container mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <span className="material-symbols-outlined">help</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>How to Use</DialogTitle>
              <DialogDescription>
                Follow these steps to get an AI analysis of your art.
              </DialogDescription>
            </DialogHeader>
            <div className="prose prose-sm dark:prose-invert">
              <ol>
                <li>
                  <strong>Upload Your Artwork:</strong> Drag and drop an image file or click the upload area to select a file from your device.
                </li>
                <li>
                  <strong>Select Critique Focus:</strong> Choose one or more topics like "Color Theory" or "Composition" that you want the AI to focus on, then click "Generate Critique."
                </li>
                <li>
                  <strong>Analyze Colors:</strong> Click "Extract Palette" to identify the prominent colors in your image.
                </li>
                <li>
                  <strong>Create Recipes:</strong> After extracting a palette, click "Generate Mixing Recipes" to get formulas for mixing those colors with traditional paints.
                </li>
                 <li>
                  <strong>Outline a Focus Area:</strong> You can click and drag on your uploaded image to draw a red outline around a specific part of your artwork. This helps focus the AI's analysis. Use the "Clear Outline" button to remove it.
                </li>
                <li>
                  <strong>Toggle Theme:</strong> Use the sun/moon icon in the top right to switch between light and dark modes.
                </li>
              </ol>
            </div>
          </DialogContent>
        </Dialog>
        <ThemeToggle />
      </div>
      <header className="text-center mb-8 md:mb-12">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground">
          AI Art Critic & Colorist
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Upload your art to get an AI-powered analysis.
        </p>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-6">
          <ImageHandler
            onImageUpload={handleImageUpload}
            imageUrl={imageDataUrl}
            clearDrawingRef={clearDrawingRef}
          />
        </div>

        <div className="flex flex-col gap-8">
          <CritiqueModule
            onGenerate={handleGenerateCritique}
            isLoading={isCritiqueLoading}
            result={critiqueResult}
            isImageUploaded={!!imageDataUrl}
          />
          <PaletteModule
            onGenerate={handleExtractPalette}
            isLoading={isPaletteLoading}
            result={paletteResult}
            isImageUploaded={!!imageDataUrl}
          />
          <RecipesModule
            onGenerate={handleGenerateRecipes}
            isLoading={isRecipesLoading}
            result={recipesResult}
            isPaletteExtracted={!!paletteResult}
          />
        </div>
      </div>
    </main>
  );
}

    