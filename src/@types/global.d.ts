interface Ai {
  canCreateTextSession(): Promise<"no" | "readily" | "after-download">;
  createTextSession(options?: any): Promise<TextSession>;
}

interface TextSession {
  prompt(input: string): Promise<string>;
  destroy(): void;
}

declare global {
  interface Window {
    ai?: Ai;
  }
}

export {};
