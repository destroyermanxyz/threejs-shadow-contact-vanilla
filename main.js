import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import vertex from "./shaders/vertex.glsl?raw";
import fragment from "./shaders/fragment.glsl?raw";
import GUI from "lil-gui";
import Stats from "./Stats";
import ShadowContact from "./ShadowContact";

class Experience {
  constructor(canvas) {
    window.experience = this;

    this.canvas = canvas;

    this.scene = new THREE.Scene();

    this.setRenderer();
    this.setMesh();
    this.setCamera();
    this.setLights();
    this.setEvents();
    this.setTick();
    this.setDebug();

    this.setShadowContact();
  }

  setShadowContact() {
    this.shadowContact = new ShadowContact(this.renderer, this.scene);
  }

  setMesh() {
    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.5),
      new THREE.MeshStandardMaterial({
        color: "hotpink",
      })
    );

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.scene.add(this.mesh);
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 1, 2);

    const controls = new OrbitControls(this.camera, this.canvas);
    controls.enableDamping = true;

    this.updateControls = function (deltaTime) {
      controls.dampingFactor = deltaTime * 5;
      controls.update();
    };
  }

  setLights() {
    this.dir = new THREE.DirectionalLight();
    this.dir.position.set(1.76, 2.26, 2.38);
    this.dir.castShadow = true;
    this.dir.shadow.mapSize = new THREE.Vector2(1024 * 2, 1024 * 2);

    this.dirHelp = new THREE.DirectionalLightHelper(this.dir, 1, "red");

    this.scene.add(this.dirHelp, this.dir);

    this.ambient = new THREE.AmbientLight();
    this.scene.add(this.ambient);
  }

  setEvents() {
    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor("white");
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.5;
  }

  setTick() {
    /**
     * Stats
     */
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);

    /**
     * RAF
     */
    this.previousTime = 0;

    this.tick = this.tick.bind(this);
    requestAnimationFrame(this.tick);
  }

  tick(t) {
    this.stats.begin();

    this.elapsedTime = t / 1000;
    this.deltaTime = this.elapsedTime - this.previousTime;
    this.previousTime = this.elapsedTime;

    this.renderer.render(this.scene, this.camera);

    this.mesh.rotation.y += this.deltaTime;

    this.updateControls(this.deltaTime);

    if (this.shadowContact) {
      this.shadowContact.update();
    }

    this.stats.end();
    requestAnimationFrame(this.tick);
  }

  setDebug() {
    const gui = new GUI();

    const dirFolder = gui.addFolder("Directional light");

    dirFolder
      .add(this.dir.position, "x", 0, 10)
      .onChange(() => this.dir.lookAt(0, 0, 0));
    dirFolder
      .add(this.dir.position, "y", 0, 10)
      .onChange(() => this.dir.lookAt(0, 0, 0));
    dirFolder
      .add(this.dir.position, "z", 0, 10)
      .onChange(() => this.dir.lookAt(0, 0, 0));
  }
}

const experience = new Experience(document.querySelector("canvas"));
