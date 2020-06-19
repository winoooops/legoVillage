import Colors from '../assets/colors.js'
import Land from './mesh/land.js'
import Sun from './mesh/sun.js'
import Sky from './mesh/sky.js'
import Forest from './mesh/forest.js'

//define all the constants
const dom_str = 'Threejs';
const resize_str = 'resize';
const load_str = 'load';

//define all the global variables
var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;
var SCREEN_HEIGHT = window.innerHeight,
    SCREEN_WIDTH = window.innerWidth;
var VIEW_ANGLE = 60,
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
    NEAR = 0.1,
    FAR = 20000;
var hemispshereLight, shadowLight;
var sky, forest, land, orbit, sun;

var mousePos = { x: 0, y: 0 };
var offSet = -600;

//initiate scene
function initScene(){
    // Create the scene.
    scene = new THREE.Scene();
    // Add FOV Fog effect to the scene. Same colour as the BG int he stylesheet.
    scene.fog = new THREE.Fog(Colors.fog, 100, 950);
}

//initiate camera
function initCamera(){
    // Create the camera
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT);
    // Position the camera
    camera.position.set(0, 150, 100);
    // camera.lookAt(scene.position);
}

//get the width and height of the screen and use them to setup the aspect ratio of the camera and the size of the renderer.
function initThree() {
    // Create the renderer
    renderer = new THREE.WebGLRenderer({
        // Alpha makes the background transparent, antialias is performant heavy
        alpha: true,
        antialias: true
    });

    //set the size of the renderer to fullscreen
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    //enable shadow rendering
    renderer.shadowMap.enabled = true;
    // Add the Renderer to the DOM, in the threejs div.
    container = document.getElementById(dom_str);
    container.appendChild(renderer.domElement);

    //responsive listener
    window.addEventListener(resize_str, handleWindowResize, false);
}

//responsive listener
function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

//create light
function initLight() {
    // Gradient coloured light - Sky, Ground, Intensity
    var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)
    // Parallel rays
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    shadowLight.position.set(0, 350, 350);
    shadowLight.castShadow = true;

    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -650;
    shadowLight.shadow.camera.right = 650;
    shadowLight.shadow.camera.top = 650;
    shadowLight.shadow.camera.bottom = -650;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    // Shadow map size
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    // Add the lights to the scene
    scene.add(hemisphereLight);
    scene.add(shadowLight);
}

//create orbit object
var Orbit = function () {
    //create a 3D Object
    var geom = new THREE.Object3D();
    this.mesh = geom;
}

//create sky
function createSky() {
    sky = new Sky();
    sky.mesh.position.y = offSet;
    scene.add(sky.mesh);
}

//create land
function createLand() {
    land = new Land();
    land.mesh.position.y = offSet;
    scene.add(land.mesh);
}

//create orbit
function createOrbit() {
    orbit = new Orbit();
    orbit.mesh.position.y = offSet;
    orbit.mesh.rotation.z = -Math.PI / 6;
    scene.add(orbit.mesh);
}

//create forest
function createForest() {
    forest = new Forest();
    forest.mesh.position.y = offSet;
    scene.add(forest.mesh);
}

//create sun
function createSun() {
    sun = new Sun();
    sun.mesh.scale.set(1, 1, .3);
    sun.mesh.position.set(0, -30, -850);
    scene.add(sun.mesh);
}

//make the land, orbit, sky and forest rotate
function loop() {
    land.mesh.rotation.z += .005;
    orbit.mesh.rotation.z += .001;
    sky.mesh.rotation.z += .003;
    forest.mesh.rotation.z += .005;

    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}


function init(event) {
    initScene()
    initCamera()
    initThree();
    initLight();
    createOrbit();
    createSun();
    createLand();
    createForest();
    createSky();
    loop();
}

window.addEventListener(load_str, init, false);