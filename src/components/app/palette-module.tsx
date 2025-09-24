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
import type { Color, Palette } from "@/lib/types";

type PaletteModuleProps = {
  onGenerate: () => void;
  isLoading: boolean;
  result: Palette | null;
  isImageUploaded: boolean;
};

const ColorSwatch = ({ name, hex }: Color) => (
  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-black/20 transition-colors">
    <div
      className="w-8 h-8 rounded-md border border-white/20"
      style={{ backgroundColor: hex }}
    />
    <div>
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-gray-400 font-mono">{hex}</p>
    </div>
  </div>
);

export default function PaletteModule({
  onGenerate,
  isLoading,
  result,
  isImageUploaded,
}: PaletteModuleProps) {
  return (
    <Card className="glassmorphism">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-pink-400">colorize</span>
          <div>
            <CardTitle className="font-bold text-xl">
              2. Analyze Colors
            </CardTitle>
            <CardDescription className="text-gray-300">
              Extract a palette of prominent colors from your artwork.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button
          onClick={onGenerate}
          disabled={!isImageUploaded || isLoading}
          className="w-full font-bold text-white bg-pink-500/80 hover:bg-pink-500/90 transition-all"
          size="lg"
        >
          {isLoading ? <Loader /> : <span className="material-symbols-outlined mr-2">science</span>}
          Extract Palette
        </Button>
        {isLoading && !result && (
          <div className="text-center p-4">
            <Loader />
            <p className="text-muted-foreground mt-2">
              AI is detecting colors...
            </p>
          </div>
        )}
        {result && (
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Color Palette:</h4>
            {result.primary.length > 0 && (
              <div>
                <h5 className="font-semibold text-gray-400 mb-2">Primary Colors</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.primary.map((color) => (
                    <ColorSwatch key={color.hex} {...color} />
                  ))}
                </div>
              </div>
            )}
            {result.secondary.length > 0 && (
              <div>
                <h5 className="font-semibold text-gray-400 mb-2">Secondary Colors</h5>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.secondary.map((color) => (
                    <ColorSwatch key={color.hex} {...color} />
                  ))}
                </div>
              </div>
            )}
            {result.tertiary.length > 0 && (
              <div>
                <h5 className="font-semibold text-gray-400 mb-2">Tertiary Colors</h5>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.tertiary.map((color) => (
                    <ColorSwatch key={color.hex} {...color} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
