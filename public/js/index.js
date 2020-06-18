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

//define all the colors
var Colors = {
    red: 0xf25346,
    yellow: 0xedeb27,
    white: 0xd8d0d1,
    brown: 0x59332e,
    pink: 0xF5986E,
    brownDark: 0x23190f,
    blue: 0x68c3c0,
    green: 0x458248,
    purple: 0x551A8B,
    lightgreen: 0x629265,
    fog: 0xf7d9aa
};
//define petal colors
var petalColors = [Colors.red, Colors.yellow, Colors.blue];

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
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)
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

//create land object
Land = function () {
    //create a cylinder geometry
    var geom = new THREE.CylinderGeometry(600, 600, 1700, 40, 10);
    //rotate on the x axis
    geom.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    //create a material
    var mat = new THREE.MeshPhongMaterial({
        color: Colors.lightgreen,
        flatShading: true,
    });

    //create a mesh of the object
    this.mesh = new THREE.Mesh(geom, mat);
    //receive shadows
    this.mesh.receiveShadow = true;
}

//create orbit object
Orbit = function () {
    //create a 3D Object
    var geom = new THREE.Object3D();
    this.mesh = geom;
}

//create sun object
Sun = function () {
    //Create an empty container for the sun
    this.mesh = new THREE.Object3D();

    //create a sphere geometry
    var sunGeom = new THREE.SphereGeometry(400, 20, 10);
    //create a Material of the sun, with color: yellow and flatshading
    var sunMat = new THREE.MeshPhongMaterial({
        color: Colors.yellow,
        flatShading: true,
    });
    //create a mesh of sun
    var sun = new THREE.Mesh(sunGeom, sunMat);
    //disable cast shadow and receive shadow
    sun.castShadow = false;
    sun.receiveShadow = false;

    //add sun in the current mesh
    this.mesh.add(sun);
}

//create cloud object
Cloud = function () {
    // Create an empty container for the cloud
    this.mesh = new THREE.Object3D();
    
    // Cube geometry and material
    var geom = new THREE.DodecahedronGeometry(20, 0);
    var mat = new THREE.MeshPhongMaterial({
        color: Colors.white,
    });

    //each cloud combined with 3+random number of cubes
    var nBlocs = 3 + Math.floor(Math.random() * 3);

    for (var i = 0; i < nBlocs; i++) {
        //Clone mesh geometry
        var m = new THREE.Mesh(geom, mat);
        //Randomly position each cube
        m.position.x = i * 15;
        m.position.y = Math.random() * 10;
        m.position.z = Math.random() * 10;
        m.rotation.z = Math.random() * Math.PI * 2;
        m.rotation.y = Math.random() * Math.PI * 2;

        //Randomly scale the cubes
        var s = .1 + Math.random() * .9;
        m.scale.set(s, s, s);
        
        //add each cloud into mesh
        this.mesh.add(m);
    }
}

//create sky object
Sky = function () {
    // Create an empty container for the sky
    this.mesh = new THREE.Object3D();

    // number of cloud groups
    this.nClouds = 25;

    // space the consistenly
    var stepAngle = Math.PI * 2 / this.nClouds;

    // Create the Clouds
    for (var i = 0; i < this.nClouds; i++) {

        var c = new Cloud();

        //set rotation and position using trigonometry
        var a = stepAngle * i;
        // this is the distance between the center of the axis and the cloud itself
        var h = 800 + Math.random() * 200;
        c.mesh.position.y = Math.sin(a) * h;
        c.mesh.position.x = Math.cos(a) * h;

        // rotate the cloud according to its position
        c.mesh.rotation.z = a + Math.PI / 2;

        // random depth for the clouds on the z-axis
        c.mesh.position.z = -400 - Math.random() * 400;

        // random scale for each cloud
        var s = 1 + Math.random() * 2;
        c.mesh.scale.set(s, s, s);

        //add sky into current mesh
        this.mesh.add(c.mesh);
    }
}

//create tree object
Tree = function () {
    // Create an empty container for the tree
    this.mesh = new THREE.Object3D();

    // tree leaves material
    var matTreeLeaves = new THREE.MeshPhongMaterial({
        color: Colors.green, 
        flatShading: true 
    });

    // tree base: box geometry and material
    var geonTreeBase = new THREE.BoxGeometry(10, 20, 10);
    var matTreeBase = new THREE.MeshBasicMaterial({ color: Colors.brown });
    var treeBase = new THREE.Mesh(geonTreeBase, matTreeBase);
    treeBase.castShadow = true;
    treeBase.receiveShadow = true;
    this.mesh.add(treeBase);

    // tree bottom level: cylinder geometry andd material
    var geomTreeLeaves1 = new THREE.CylinderGeometry(1, 12 * 3, 12 * 3, 4);
    var treeLeaves1 = new THREE.Mesh(geomTreeLeaves1, matTreeLeaves);
    treeLeaves1.castShadow = true;
    treeLeaves1.receiveShadow = true;
    treeLeaves1.position.y = 20
    this.mesh.add(treeLeaves1);

    // tree middle level: cylinder geometry andd material
    var geomTreeLeaves2 = new THREE.CylinderGeometry(1, 9 * 3, 9 * 3, 4);
    var treeLeaves2 = new THREE.Mesh(geomTreeLeaves2, matTreeLeaves);
    treeLeaves2.castShadow = true;
    treeLeaves2.position.y = 40;
    treeLeaves2.receiveShadow = true;
    this.mesh.add(treeLeaves2);

    //tree top level: cylinder geometry andd material
    var geomTreeLeaves3 = new THREE.CylinderGeometry(1, 6 * 3, 6 * 3, 4);
    var treeLeaves3 = new THREE.Mesh(geomTreeLeaves3, matTreeLeaves);
    treeLeaves3.castShadow = true;
    treeLeaves3.position.y = 55;
    treeLeaves3.receiveShadow = true;
    this.mesh.add(treeLeaves3);
}

//create flower object
Flower = function () {
    // Create an empty container for the flowers
    this.mesh = new THREE.Object3D();

    //flower stem box geometry and materials
    var geomStem = new THREE.BoxGeometry(5, 50, 5, 1, 1, 1);
    var matStem = new THREE.MeshPhongMaterial({
        color: Colors.green, 
        flatShading: true 
    });
    var stem = new THREE.Mesh(geomStem, matStem);
    stem.castShadow = false;
    stem.receiveShadow = true;
    this.mesh.add(stem);

    //flower petal core box geometry and material
    var geomPetalCore = new THREE.BoxGeometry(10, 10, 10, 1, 1, 1);
    var matPetalCore = new THREE.MeshPhongMaterial({
        color: Colors.yellow, 
        flatShading: true 
    });
    petalCore = new THREE.Mesh(geomPetalCore, matPetalCore);
    petalCore.castShadow = false;
    petalCore.receiveShadow = true;

    //flower petal color: randomly choose three colors
    var petalColor = petalColors[Math.floor(Math.random() * 3)];
    //flower petal box geometry and material 
    var geomPetal = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
    var matPetal = new THREE.MeshBasicMaterial({ color: petalColor });
    //make 4 petals for each flowers and set its vertices
    geomPetal.vertices[5].y -= 4;
    geomPetal.vertices[4].y -= 4;
    geomPetal.vertices[7].y += 4;
    geomPetal.vertices[6].y += 4;
    geomPetal.translate(12.5, 0, 3);

    //4 petals make one flower
    var petals = [];
    for (var i = 0; i < 4; i++) {

        petals[i] = new THREE.Mesh(geomPetal, matPetal);
        petals[i].rotation.z = i * Math.PI / 2;
        petals[i].castShadow = true;
        petals[i].receiveShadow = true;
    }

    //add petals to its core
    petalCore.add(petals[0], petals[1], petals[2], petals[3]);
    petalCore.position.y = 25;
    petalCore.position.z = 3;

    //add flowers to the current mesh
    this.mesh.add(petalCore);
}

//create forest object
Forest = function () {
    // Create an empty container for the forests
    this.mesh = new THREE.Object3D();

    // Number of Trees
    this.nTrees = 300;

    // Space the consistenly
    var stepAngle = Math.PI * 2 / this.nTrees;

    // Create the Trees
    for (var i = 0; i < this.nTrees; i++) {

        var t = new Tree();

        //set rotation and position using trigonometry
        var a = stepAngle * i;
        // this is the distance between the center of the axis and the tree itself
        var h = 605;
        t.mesh.position.y = Math.sin(a) * h;
        t.mesh.position.x = Math.cos(a) * h;

        // rotate the tree according to its position
        t.mesh.rotation.z = a + (Math.PI / 2) * 3;

        // random depth for the tree on the z-axis
        t.mesh.position.z = 0 - Math.random() * 600;

        // random scale for each tree
        var s = .3 + Math.random() * .75;
        t.mesh.scale.set(s, s, s);

        this.mesh.add(t.mesh);
    }

    // Number of flowers
    this.nFlowers = 350;

    // Space the consistenly
    var stepAngle = Math.PI * 2 / this.nFlowers;

    // Create the Trees
    for (var i = 0; i < this.nFlowers; i++) {

        var f = new Flower();

        //set rotation and position using trigonometry
        var a = stepAngle * i;

        // this is the distance between the center of the axis and the flowers itself
        var h = 605;
        f.mesh.position.y = Math.sin(a) * h;
        f.mesh.position.x = Math.cos(a) * h;

        // rotate the flowers according to its position
        f.mesh.rotation.z = a + (Math.PI / 2) * 3;

        // random depth for the flowers on the z-axis
        f.mesh.position.z = 0 - Math.random() * 600;

        // random scale for each flower
        var s = .1 + Math.random() * .3;
        f.mesh.scale.set(s, s, s);

        this.mesh.add(f.mesh);
    }

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