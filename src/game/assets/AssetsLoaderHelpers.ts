export enum AssetNames {
  Nightborne = 'nightborne',
  FarmTileset = 'farmTileset',
  CatacombsTileset = 'catacombsTileset',
  BeastWaterTileset = 'beastWaterTileset',
  GrasslandGroundTileset = 'grasslandGroundTileset',
}

export enum FontNames {
  ExpressionPro = 'ExpressionPro',
  m5x7 = 'm5x7',
}

export const FontPaths: Record<FontNames, string> = {
  ExpressionPro: 'fonts/ExpressionPro.woff',
  m5x7: 'fonts/m5x7.ttf',
};

export const makeJsonAssetPromise = ({
  assetUrl,
  handler,
  passResolve = false,
}: {
  assetUrl: string;
  handler: (data: any, resolve?: () => void) => void; // eslint-disable-line
  passResolve?: boolean;
}) =>
  new Promise((resolve: (value?: unknown) => void) => {
    fetch(assetUrl)
      .then((response) => response.json())
      .then((spriteData) => {
        if (passResolve) {
          handler(spriteData, resolve);
        } else {
          handler(spriteData);
          resolve();
        }
      });
  });
