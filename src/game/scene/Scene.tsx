import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import GameControls from 'game/controls/GameControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from  'three/examples/jsm/controls/OrbitControls';
import { type GameContext } from './../Game';

class Scene {
  $: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.OrthographicCamera;
  controls: GameControls;
  composer: EffectComposer;
  debugControls?: OrbitControls;
  stats?: Stats;

  constructor(context: GameContext) {
    // Scene
    this.$ = new THREE.Scene();
    this.$.fog = new THREE.FogExp2(0x000000, 0.0025);

    // Stats
    if (context.debug) {
      this.stats = new Stats();
      this.stats.showPanel(0);
      document.body.appendChild(this.stats.dom);
    }

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);
    document.body.style.background = '#222';

    // Camera
    const x = 1.8;
    this.camera = new THREE.OrthographicCamera(
      -4 * x,
      4 * x,
      3 * x,
      -3 * x,
      -15.01,
      20,
    );
    this.camera.position.x = -3;
    this.camera.position.y = 3;
    this.camera.position.z = 3;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.$.add(this.camera);

    // Controls
    this.controls = new GameControls();

    // Ambient light
    if (context.debug) {
      this.$.add(new THREE.AmbientLight(0xffffff, 0.4));
    } else {
      this.$.add(new THREE.AmbientLight(0x002299, 0.18));
    }

    // post processing
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.$, this.camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(1.0,1.0), 0.3, 1.0, 0.1);
    this.composer.addPass(bloomPass);

    // DebugControls
    if (context.debug) {
      this.debugControls = new OrbitControls(
        this.camera,
        this.renderer.domElement,
      );
    }

    window.addEventListener('resize', this.onWindowResize, false);
  }

  onWindowResize = () => {
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  getMaxAnisotropy(): number {
    return this.renderer.capabilities.getMaxAnisotropy();
  }

  remove = () => {
    window.removeEventListener('resize', this.onWindowResize);
    if (this.stats) {
      document.body.removeChild(this.stats.dom);
    }
    document.body.removeChild(this.renderer.domElement);
    this.renderer.dispose();
    this.controls.remove();
    if (this.debugControls) {
      this.debugControls.dispose();
    }
  };

  animate = () => {
    if (this.stats) {
      this.stats.begin();
    }
  };

  animateFinish = () => {
    if (this.stats) {
      this.stats.end();
    }
  };
}

export default Scene;
