import type Sprite from 'game/sprite/Sprite';

export type Point = { x: number; z: number };

export type Frame = {
  x: number;
  y: number;
};

export type SpriteDataAnimation = {
  name: string;
  frames: Frame[];
};

export type SpriteDataObject = {
  id: string;
  name: string;
  width: number;
  height: number;
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
  frameSize: { width: number; height: number };
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

export type CreatureOrientation = 'left' | 'right';

export type MapSize = { x: number; z: number; y?: number };

export type MapTile = { tile: Tile; cell: MapCell };

export type CreatureStates =
  | 'idle'
  | 'walking'
  | 'talking'
  | 'attack'
  | 'chase'
  | 'dead'
  | 'dying'
  | 'to_remove';

export type CreatureEffectsTextTypes =
  | 'damage'
  | 'experience'
  | 'level_up';

export type PlayerStatistics = {
  alive: boolean;
  gold: number;
  health: number;
  maxHealth: number;
  level: number;
  experience: number;
  attack: number;
  defense: number;
};

export type EnemyLoot = {
  gold?: number;
};

export type TilesetLink = {
  firstgid: number;
  source: string;
};

export type TilesetLayer = {
  data: number[];
  name: string;
};

export type TiledMap = {
  width: number;
  height: number;
  layers: TilesetLayer[];
  tilesets: TilesetLink[];
};

export type TiledTileset = {
  columns: number;
  image: string;
  imageData?: HTMLImageElement;
  name: string;
  tileheight: number;
  tilewidth: number;
  textures?: Record<number, THREE.CanvasTexture>;
};
