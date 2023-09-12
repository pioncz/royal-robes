export type SpriteDataFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type SpriteDataAnimation = {
  name: string;
  frames: SpriteDataFrame[];
}

export type SpriteDataObject = {
  id: string;
  name: string;
  animations: SpriteDataAnimation[]
}

export type SpriteData = {
  assetPath: string;
  objects: SpriteDataObject[]
}

export enum AssetNames {
  Nightborne = 'nightborne',
}

export enum FontNames {
  ExpressionPro = 'ExpressionPro',
}