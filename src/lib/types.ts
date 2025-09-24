export type Color = {
  name: string;
  hex: string;
};

export type Palette = {
  primary: Color[];
  secondary: Color[];
  tertiary: Color[];
};

export type Recipe = {
  name: string;
  percent: number;
};

export type MixingRecipe = {
  extractedColor: Color;
  recipe: Recipe[];
};
