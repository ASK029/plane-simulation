/** @format */

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import gsap from "gsap";
import * as dat from "dat.gui";

// variabls
const canvas = document.querySelector("canvas.webgl");
const paramerters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + 10 });
  },
};
// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const pi = Math.PI;
const modelControls = {
  positionX: 0,
  positionY: 10,
  positionZ: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
};

// Scene
const scene = new THREE.Scene();
scene.rotateY((2 * Math.PI) / 5);

// Lights
const light = new THREE.DirectionalLight(0xffffff, 4);
light.position.set(0.25, 2, -2.25);
light.castShadow = true;
light.shadow.camera.far = 15;
scene.add(light);

// Material
const material = new THREE.MeshStandardMaterial({ color: paramerters.color });
material.roughness = 0;

// Object
const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 10000));
floor.rotateX((3 * Math.PI) / 2);
scene.add(floor);

// Debug
const gui = new dat.GUI();

gui.add(light, "intensity", 0, 10, 0.001).name("lightIntensity");
gui.add(light.position, "x", -5, 5, 0.001).name("lightX");
gui.add(light.position, "y", -5, 5, 0.001).name("lightY");
gui.add(light.position, "z", -5, 5, 0.001).name("lightZ");

gui.add(modelControls, "positionX", -50, 50).onChange(updateModelTransform);
gui.add(modelControls, "positionY", 0, 100).onChange(updateModelTransform);
gui.add(modelControls, "positionZ", -100, 100).onChange(updateModelTransform);
gui
  .add(modelControls, "rotationX", -Math.PI, Math.PI)
  .onChange(updateModelTransform);
gui
  .add(modelControls, "rotationY", -Math.PI, Math.PI)
  .onChange(updateModelTransform);
gui
  .add(modelControls, "rotationZ", -Math.PI, Math.PI)
  .onChange(updateModelTransform);

// Updat all Materials
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMap = environmentMap;
      child.material.envMapIntensity = 1;
    }
  });
};
// Models
let airplaneModel;
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfloader = new GLTFLoader();
gltfloader.setDRACOLoader(dracoLoader);

gltfloader.load("models/myAirplane2.glb", (gltf) => {
  airplaneModel = gltf.scene;
  scene.add(airplaneModel);
  updateAllMaterials();
});

function updateModelTransform() {
  if (airplaneModel) {
    airplaneModel.rotation.set(
      modelControls.rotationX,
      modelControls.rotationY,
      modelControls.rotationZ,
    );
    // airplaneModel.translateZ(modelControls.positionZ);
    airplaneModel.position.set(
      modelControls.positionX,
      modelControls.positionY,
      modelControls.positionZ,
    );
    // airplaneModel.position.set(
    //   modelControls.positionX +
    //     modelControls.positionZ * Math.sin(modelControls.rotationY),
    //   modelControls.positionY +
    //     modelControls.positionZ * Math.sin(-modelControls.rotationX) +
    //     modelControls.positionX * Math.sin(modelControls.rotationZ),
    //   modelControls.positionZ,
    // );
  }
}

// Environment Map
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMap = cubeTextureLoader.load([
  "/environment/5/px.png",
  "/environment/5/nx.png",
  "/environment/5/py.png",
  "/environment/5/ny.png",
  "/environment/5/pz.png",
  "/environment/5/nz.png",
]);
scene.background = environmentMap;

window.addEventListener("resize", () => {
  // Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// Axes Helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
const cameraOffset = new THREE.Vector3(0, 10, -30);
camera.position.copy(cameraOffset);

// cursor
const cursor = {
  x: 0,
  y: 0,
};
// ASK is the best
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);
renderer.physicallyCorrectLights = true;

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxPolarAngle = 1.5;
controls.maxDistance = 10;
controls.minDistance = 1;

function animate() {
  requestAnimationFrame(animate);
  airplaneModel.add(camera);
  renderer.render(scene, camera);
}

animate();

// Time
let time = Date.now();
const getDeltaTime = () => {
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  return deltaTime;
};

// Animation
const tick = () => {
  const deltaTime = getDeltaTime();

  //Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
