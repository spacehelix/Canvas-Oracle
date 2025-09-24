# **App Name**: Arty Assistant

## Core Features:

- Art Critique: Generate an art critique based on user-selected topics (Color Theory, Composition, Originality, and Execution) using generative AI as a tool.
- Color Palette Extraction: Extract the prominent colors from an uploaded image and present them as color swatches with artist-friendly names and hex codes, using generative AI as a tool.
- Color Mixing Recipes: Generate plausible paint mixing recipes for each extracted color, using common base paint colors and percentages, powered by generative AI as a tool.
- Image Upload and Display: Allow users to upload an image via click-to-select or drag-and-drop, and prominently display the uploaded image.
- Canvas Overlay with Drawing Tool: Overlay an HTML5 canvas on the image, enabling users to draw semi-transparent, red outlines, with a 'Clear Outline' button to erase drawings. Only 3px outlines are supported to minimize memory use of local storage
- On-device AI Hybrid Logic: Implements hybrid logic, prioritizing on-device Gemini Nano for AI requests, falling back to Firebase Cloud Functions when on-device AI is unavailable.
- Results Display: Display critiques, color palettes, and mixing recipes in a clear and readable format, with loading states for AI operations.

## Style Guidelines:

- Primary color: A vibrant crimson (#D7263D) to capture the boldness of artistic creation.
- Background color: A very light, desaturated red (#F2E1E3) to provide a subtle, unobtrusive backdrop.
- Accent color: A bright orange (#FFA500) to highlight key interactive elements and focus areas.
- Font pairing: 'Playfair' (serif) for headlines to convey an elegant, high-end feel, and 'PT Sans' (sans-serif) for body text.
- Use simple, elegant icons to represent different features, following a minimalist style.
- Maintain a clean, centered layout with sufficient spacing for readability and visual clarity.
- Subtle animations for loading states and transitions to enhance the user experience.