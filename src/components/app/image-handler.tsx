"use client";

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useImperativeHandle,
} from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageHandlerProps = {
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
  clearDrawingRef: React.RefObject<{ clear: () => void }>;
};

type Point = { x: number; y: number };

export default function ImageHandler({
  onImageUpload,
  imageUrl,
  clearDrawingRef,
}: ImageHandlerProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(clearDrawingRef, () => ({
    clear: handleClear,
  }));

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageUpload(acceptedFiles[0]);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".gif", ".webp"] },
    multiple: false,
  });

  const getCanvasCoordinates = (event: React.MouseEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoordinates(event);
    if (!coords) return;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    context.beginPath();
    context.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const coords = getCanvasCoordinates(event);
    if (!coords) return;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    context.lineTo(coords.x, coords.y);
    context.stroke();
  };

  const stopDrawing = () => {
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = imageContainerRef.current;
    if (canvas && container && imageUrl) {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (context) {
        context.strokeStyle = "rgba(215, 38, 61, 0.7)"; // Semi-transparent crimson
        context.lineWidth = 3;
        context.lineCap = "round";
        context.lineJoin = "round";
      }
    }
  }, [imageUrl]);

  return (
    <div className="space-y-4">
      <div
        ref={imageContainerRef}
        {...getRootProps()}
        className={cn(
          "relative w-full aspect-[4/3] rounded-lg border-2 border-dashed transition-colors duration-300 glassmorphism flex items-center justify-center cursor-pointer",
          { "border-cyan-400/80": isDragActive, "border-cyan-400/50": !isDragActive }
        )}
      >
        <input {...getInputProps()} />
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt="Uploaded artwork"
              fill
              className="object-contain rounded-md"
            />
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="absolute top-0 left-0 w-full h-full cursor-crosshair"
            />
          </>
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center text-center p-8"
          >
            <span className="material-symbols-outlined text-6xl text-cyan-400">
              cloud_upload
            </span>
            <p className="font-bold text-xl mt-4">
              {isDragActive
                ? "Drop the image here..."
                : "Drag & drop art here, or click to select"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Supports PNG, JPG, GIF, WEBP
            </p>
          </div>
        )}
      </div>
      {imageUrl && (
        <div className="flex justify-between items-center">
            <div {...getRootProps()} className="w-auto">
              <input {...getInputProps()} />
              <Button variant="outline">Change Image</Button>
            </div>
           <Button variant="destructive" onClick={(e) => { e.stopPropagation(); handleClear(); }}>
              <Eraser className="mr-2 h-4 w-4" />
              Clear Outline
            </Button>
        </div>
      )}
    </div>
  );
}
