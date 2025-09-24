# Canvas Oracle

**Tagline:** Create - Refine - Harmonize

Canvas Oracle is an AI-powered web application designed to be a digital companion for artists and creatives. It provides insightful critiques, detailed color analysis, and practical paint-mixing recipes, helping artists refine their work and deepen their understanding of color theory.

This project was built for the **Google Chrome Built-in AI Challenge 2025**.

## Features

- **AI-Powered Art Critiques:** Get instant, constructive feedback on your artwork. Select focus areas like "Color Theory," "Composition," and "Originality" to receive a tailored analysis.
- **Color Palette Extraction:** Upload an image to automatically identify and extract the dominant primary, secondary, and tertiary colors.
- **Paint Mixing Recipes:** Generate practical recipes for mixing the extracted colors using common, artist-friendly paint names.
- **Hybrid AI Strategy:** The application is built with a hybrid approach. It prioritizes using on-device AI (Gemini Nano) for speed, privacy, and offline access. If on-device AI is not available, it seamlessly falls back to cloud-based AI to ensure functionality for all users.
- **Light & Dark Mode:** Choose your preferred viewing experience with a sleek theme toggle.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (with App Router)
- **Generative AI:** [Google Genkit](https://firebase.google.com/docs/genkit) with the [Gemini API](https://ai.google.dev/docs)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
    cd <YOUR_REPO_NAME>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of the project and add your Google AI API key:
    ```
    GEMINI_API_KEY=your_google_ai_api_key_here
    ```

### Running the Development Server

To start the Next.js development server, run:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
