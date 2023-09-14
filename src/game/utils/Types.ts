import type Sprite from 'game/sprite/Sprite';

export type Point = { x: number; z: number };

export type Frame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SpriteDataAnimation = {
  name: string;
  frames: Frame[];
};

export type SpriteDataObject = {
  id: string;
  name: string;
  animations: SpriteDataAnimation[];
};

export type SpriteData = {
  assetPath: string;
  objects: SpriteDataObject[];
};

export type Tile = {
  id: string;
  type: 'floor' | 'wall';
  frame?: Frame;
  frames?: Frame[];
  size?: { width: number; height: number };
  light?: {
    color?: string;
    intensity: number;
    distance: number;
    decay: number;
  };
  walkable?: boolean;
  color?: string;
  texture?: THREE.Texture;
  sprite?: Sprite;
};

export type Tileset = {
  assetUrl: string;
  tiles: Tile[];
  asset?: HTMLImageElement;
};

export type MapCell = {
  x: number;
  y: number;
  z: number;
  id: string;
  r?: number;
};

export type MapSize = { x: number; z: number; y?: number };

export type MapTile = { tile: Tile; cell: MapCell };
