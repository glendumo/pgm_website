/* eslint-disable */
import * as THREE from 'three';

import dat from 'three/examples/jsm/libs/dat.gui.module';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class ColorGUIHelper {
  constructor (object, prop) {
    this.object = object;
    this.prop = prop;
  }

  get value () {
    return `#${this.object[this.prop].getHexString()}`;
  }

  set value (hexString) {
    this.object[this.prop].set(hexString);
  }
}

class Model {
  async render (model) {
    // Renderer
    const canvas = document.querySelector('.case-model');
    const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(700, 450);
    renderer.outputEncoding = THREE.sRGBEncoding;

    // GUI
    const gui = new dat.GUI();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
    camera.position.set(0, 0, 5);
    camera.lookAt(new THREE.Vector3(-1, 1, 1));

    const guiCameraPosition = gui.addFolder('Camera Position');
    guiCameraPosition.add(camera.position, 'z', 2, 15).name('Z');

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableZoom = false;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0f3ff);

    // Lighting
    const guiLighting = gui.addFolder('Lighting');
    const ambientLight = new THREE.AmbientLight(0x555555, 2);
    scene.add(ambientLight);
    gui.add(ambientLight, 'intensity', 0, 5);
    guiLighting
      .addColor(new ColorGUIHelper(ambientLight, 'color'), 'value')
      .name('AmbientLight');

    let directionalLight = new THREE.DirectionalLight(0x595959, 1);
    scene.add(directionalLight);
    directionalLight = new THREE.DirectionalLight(0x000055, .5);
    scene.add(directionalLight);

    guiLighting
      .addColor(new ColorGUIHelper(directionalLight, 'color'), 'value')
      .name('DirectionalLight');

    // Loaders
    let car;
    const loader = new GLTFLoader();
    loader.load(
      `${model.src}`,
      gltf => {
        scene.add(gltf.scene);
        car = gltf.scene.getObjectByName('Body');
      },
      xhr => {
        console.info(`${xhr.loaded / xhr.total * 100}% loaded`);
      },
      error => {
        console.error(error);
      }
    );

    const speed = { increment: .01 };
    gui
      .add(speed, 'increment', 0, 1, .01)
      .name('Rotation Speed');

    function rotateCar () {
      if (typeof car === 'object') {
        car.rotation.y += speed.increment;
        car.rotation.x += speed.increment;
        car.rotation.z += speed.increment;
      }
    }

    function resizeRendererToDisplaySize (renderer) {
      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width  = canvas.clientWidth  * pixelRatio | 0;
      const height = canvas.clientHeight * pixelRatio | 0;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    // Animation Loop
    (function animate () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      rotateCar();
      resizeRendererToDisplaySize(renderer);
    })();
  }

  async afterRender () {
    // Connect the listeners
    return this;
  }
}

export default Model;