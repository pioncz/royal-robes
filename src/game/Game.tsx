import AssetsLoader from "./assets/AssetsLoader";

class Main {
  assetsLoader: AssetsLoader;
  loadingAssets: boolean;

  constructor() {
    this.assetsLoader = new AssetsLoader();
    this.loadingAssets = true;
    this.assetsLoader.load.then(() => {
      console.log('loaded')
    });
    //   this.scene = new Scene({ debug });

    //   this.maxAnisotropy = this.scene.getMaxAnisotropy();
    //   this.controls = this.scene.getControls();

    //   this.map = new Map({
    //     maxAnisotropy: this.maxAnisotropy,
    //     mapPos,
    //   });
    //   this.map.setPosition({ x: 20.5, z: 4 });
    //   this.scene.add(this.map.$);

    //   this.player = new Player({
    //     debug,
    //     maxAnisotropy: this.maxAnisotropy,
    //   });
    //   this.scene.add(this.player.$);

    //   this.npc = new Npc({
    //     debug,
    //     maxAnisotropy: this.maxAnisotropy,
    //     color: '#004400',
    //     position: { x: 3, y: 0.5, z: 1 },
    //   });
    //   this.map.addCreature(this.npc);

    //   this.enemies = [];
    //   this.enemy = new Enemy({
    //     debug,
    //     maxAnisotropy: this.maxAnisotropy,
    //     color: '#440000',
    //     position: { x: 28, y: 0.5, z: 2 },
    //   });
    //   this.map.addCreature(this.enemy);
    //   this.enemies.push(this.enemy);

    //   const nightborneSpriteData =
    //     this.assetsLoader.assets[AssetNames.Nightborne];

    //   this.player.sprite.setAssetPath(nightborneSpriteData.assetPath);
    //   this.player.sprite.setAnimations(
    //     nightborneSpriteData.objects[0],
    //   );
    //   this.player.sprite.playContinuous('idle');

    //   this.npc.sprite.setAssetPath(nightborneSpriteData.assetPath);
    //   this.npc.sprite.setAnimations(nightborneSpriteData.objects[0]);
    //   this.npc.sprite.playContinuous('idle');

    //   this.enemy.sprite.setAssetPath(nightborneSpriteData.assetPath);
    //   this.enemy.sprite.setAnimations(
    //     nightborneSpriteData.objects[0],
    //   );
    //   this.enemy.sprite.playContinuous('idle');

    //   this.loadingAssets = false;
    // });

    // // Clock
    // this.clock = new THREE.Clock();
    // this.lastAnimationTick = 0;

    // // Start main loop
    // setTimeout(() => {
    //   this.animate(0);
    // }, 0);
  }
}

export default Main;
