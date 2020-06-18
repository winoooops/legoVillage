//define all the constants
const dom_str = 'Threejs';
const resize_str = 'resize';
const grass_pic = 'assets/grass.jpg';
const soil_pic = 'assets/soil.jpg';
const alert_info = "No Reachable Path";
const character_model = 'assets/theCharacter.gltf'
const cloud_str = 'Cloud';
const color_str = 'color';
const rotate_speed_x_str = 'rotateSpeedX';
const rotate_speed_y_str = 'rotateSpeedY';
const rotate_speed_z_str = 'rotateSpeedZ';
const scenery_str = 'Scenery';
const season_str = 'season';
const render_str = 'renderType';
const spring_str = 'Spring';
const summer_str = 'Summer';
const autumn_str = 'Autumn';
const winter_str = 'Winter';
const tree_str = 'Tree';
const flower_Str = 'Flower'; 
const line_str = 'Line';
const show_str = 'show';
const click_str = 'click';
const absolute_str = 'absolute';
const bottom_px_str = '0px';
const load_str = 'load';

//define all the global variables
var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight;
var VIEW_ANGLE = 45,
    ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
    NEAR = 0.1,
    FAR = 20000;
    
var container, scene, camera, renderer, controls;
var hemispshereLight, shadowLight;
var planeMaterial;
var material_floor;
var windowWidth, windowHeight;
var result;
var params;
var visible = false;
var length = 200,
    flex = 2;
var offSet = -600;
var timesRun = 0;
var tempSphere;
var isAdded = false;

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
    aut: "#E67716",
    flog: 0xf7d9aa,
    grey: 0x808080
};
var petalColors = [Colors.red, Colors.yellow, Colors.blue];
var resultArray = new Array();

const clock = new THREE.Clock();//for Character Animation
var mixer, action;//for Character Animation

//define all the arrays
var graph = [];
var line = [];
var Trees = [];
var Flowers = [];
var Clouds = [];
var Snows=[];
var gui;
var sceneryControl = {
    season: spring_str,
    renderType: tree_str
};


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

function initCamera() {
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.set(0, 200, 250);
    camera.lookAt(scene.position);
}

function initScene() {
    // Create the scene.
    scene = new THREE.Scene();
    // Add FOV Fog effect to the scene. Same colour as the BG int he stylesheet.
    scene.fog = new THREE.Fog(Colors.flog, 100, 950);
}

function initLight() {
    // Gradient coloured light - Sky, Ground, Intensity
    hemisphereLight = new THREE.HemisphereLight(0xf7d9aa, 0x000000, .9)
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

//initiate ground
function initGround() {
    //create geomety
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-length / 2, 0, 0));
    geometry.vertices.push(new THREE.Vector3(length / 2, 0, 0));

    //create plane geometry and material
    var geometry = new THREE.PlaneGeometry(length, 10);
    planeMaterial = new THREE.MeshBasicMaterial({
        color: Colors.green,
        side: THREE.DoubleSide
    });

    var plane = new THREE.Mesh(geometry, planeMaterial);
    plane.position.set(0, 0, length / 2);
    scene.add(plane);
    var plane = new THREE.Mesh(geometry, planeMaterial);
    plane.rotation.y = 90 * Math.PI / 180;
    plane.position.set(length / 2, 0, 0);
    scene.add(plane);
    var plane = new THREE.Mesh(geometry, planeMaterial);
    plane.position.set(0, 0, -length / 2);
    scene.add(plane);
    var plane = new THREE.Mesh(geometry, planeMaterial);
    plane.rotation.y = 90 * Math.PI / 180;
    plane.position.set(-length / 2, 0, 0);
    scene.add(plane);
}

function initFloor() {
    material_floor = new THREE.MeshPhongMaterial();
    material_floor.shininess = 25;
    material_floor.color = new THREE.Color(0x6423);
    var normal_map = new THREE.TextureLoader().load(grass_pic);
    normal_map.wrapS = normal_map.wrapT = THREE.RepeatWrapping;
    normal_map.repeat = new THREE.Vector2(4, 4);

    material_floor.normalMap = normal_map;

    var geometry_floor = new THREE.BoxGeometry(40, -1, 40);
    var meshFloor = new THREE.Mesh(geometry_floor, material_floor);
    meshFloor.position.y = -meshFloor.position.y;
    meshFloor.scale.set(5, 1, 5);
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);
}

function initUnderground() {
    var material_under = new THREE.MeshPhongMaterial();
    material_under.color = new THREE.Color(Colors.brownDark);
    var normal_map = new THREE.TextureLoader().load(soil_pic);
    normal_map.wrapS = normal_map.wrapT = THREE.RepeatWrapping;
    normal_map.repeat = new THREE.Vector2(4, 4);

    material_under.normalMap = normal_map;

    var geometry_under = new THREE.BoxGeometry(40, -10, 40);
    var meshUnder = new THREE.Mesh(geometry_under, material_under);
    meshUnder.scale.set(5, 2.5, 5);
    meshUnder.position.y = -17.5;
    meshUnder.DoubleSide = true;
    meshUnder.receiveShadow = false;
    scene.add(meshUnder);
}

//draw lines
function initLine() {
    geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-length / 2, 0, 0));
    geometry.vertices.push(new THREE.Vector3(length / 2, 0, 0));

    line.length = length / 5;

    for (var i = 0; i <= length / 10; i++) {
        if (visible == true) {
            //draw raws 
            line[i] = new THREE.Line(geometry, new THREE.LineBasicMaterial({
                color: Colors.grey,
                opacity: 1
            }));
            line[i].position.z = (i * 10) - length / 2;
            scene.add(line[i]);

            //draw columns
            line[i + length / 10] = new THREE.Line(geometry, new THREE.LineBasicMaterial({
                color: Colors.grey,
                opacity: 1
            }));
            line[i + length / 10].position.x = (i * 10) - length / 2;
            line[i + length / 10].rotation.y = 90 * Math.PI / 180;
            scene.add(line[i + length / 10]);
        } else {
            scene.remove(line[i]);
            scene.remove(line[i + length / 10]);
        }
    }
 
    animate();
}

function initControl() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
}

//initiate objects on the floor
function initGrid(bool) {
    if (bool === false) {
        //Delete Flowers if any
        for(let i = 0; i < Flowers.length; i++) {
            scene.remove(Flowers[i].mesh)
        }

        //plant all the trees
        for (var i = 0; i < length / 10; i++) {
            var nodeRow = [];
            graph.push(nodeRow);
            for (var j = 0; j < length / 10; j++) {
                var salt = randomNum(1, 10);
                if (salt > flex) {
                    nodeRow.push(1);
                } else {
                    nodeRow.push(0);
                }
                if (salt <= flex) { 
                    var tree = new Tree();
                    tree.mesh.position.set(10 * j - length / 2 + 5, 5, 10 * i - length / 2 + 5);
                    scene.add(tree.mesh);
                    Trees.push(tree);
                }

            }
        }
    } else {
        for(let i = 0; i < Trees.length; i++) {
            //delete trees if any
            scene.remove(Trees[i].mesh)
        }

        //plant all the flowers
        for (var i = 0; i < length / 10; i++) {
            var nodeRow = [];
            graph.push(nodeRow);
            for (var j = 0; j < length / 10; j++) {
                var salt = randomNum(1, 10);
                if (salt > flex) {
                    nodeRow.push(1);
                } else {
                    nodeRow.push(0);
                }
                if (salt <= flex) { 
                    var flower = new Flower();
                    flower.mesh.position.set(10 * j - length / 2 + 5, 5, 10 * i - length / 2 + 5);
                    scene.add(flower.mesh)
                    Flowers.push(flower)
                }

            }
        }
    }
}


function pickupObjects(e) {
    var raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();
    var fxl = new THREE.Vector3(0, 1, 0);
    var groundplane = new THREE.Plane(fxl, 0);
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var ray = raycaster.ray;
    let intersects = ray.intersectPlane(groundplane);
    let x = intersects.x;
    let z = intersects.z;

    if (Math.abs(x) > length / 2 || Math.abs(z) > (length / 2)) {
        return;
    }

    var k, m;
    for (var i = -length / 2; i < length / 2; i += 10) {
        if (x >= i && x < i + 10) {
            k = i + 5;
        }
    }
    for (var j = -length / 2; j < length / 2; j += 10) {
        if (z >= j && z < j + 10) {
            m = j + 5;
        }
    }

    initCharacter(k, m);
}

document.addEventListener(click_str, pickupObjects, false);
var isCaculate = false;


function cleanCharacter() {
    let child = scene.children;
    for (var i = 0; i < child.length; i++) {
        if (child[i] instanceof THREE.Group) {
            scene.remove(child[i]);
            i--;
        }
    }
    isCaculate = false;
}

function initCharacter(x, z) {
    if (isCaculate) {
        cleanCharacter();
    }
    var loader = new THREE.GLTFLoader();
    var object = new THREE.Group();
    loader.load(character_model, function (gltf) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        if (resultArray.length == 0) {
            object = gltf.scene;
            object.scale.set(4, 4, 4);
            object.position.x = x;
            object.position.y = 5;
            object.position.z = z;
            resultArray.push(object);

            action = mixer.clipAction(gltf.animations[1]);
            action.play();

            scene.add(object);
        } else if (resultArray[0].position.x != x && resultArray[0].position.z != z) {
            object = gltf.scene;
            object.scale.set(3, 3, 3);
            object.position.x = x;
            object.position.y = 5;
            object.position.z = z;
            resultArray.push(object);

            // scene.add(object);
            caculatePath(resultArray);
            isCaculate = true;
            resultArray = new Array();
        }
    });
    animate();
}

function caculatePath(resultArray) {
    var maps = new Graph(graph);
    var startX = (resultArray[0].position.z - 5 + length / 2) / 10;
    var startY = (resultArray[0].position.x - 5 + length / 2) / 10;
    var endX = (resultArray[1].position.z - 5 + length / 2) / 10;
    var endY = (resultArray[1].position.x - 5 + length / 2) / 10;
    var start = maps.grid[startX][startY];
    var end = maps.grid[endX][endY];
    result = astar.search(maps, start, end);
    if (result.length == 0) {
        alert(alert_info);
        cleanCharacter();
        return;
    }
    timesRun = 0;
    tempSphere = resultArray[0];
    pathAnimate();
}

function pathAnimate() {
    if (!isAdded) {
        scene.add(tempSphere);
        isAdded = true;
    }
    if (timesRun == result.length) {
        return;
    }
    var next = {
        x: result[timesRun].y * 10 - length / 2 + 5,
        z: result[timesRun].x * 10 - length / 2 + 5
    }
    if (tempSphere.position.x == next.x && tempSphere.position.z == next.z) {
        timesRun++;
        requestAnimationFrame(pathAnimate);
        return;
    }
    if (tempSphere.position.x > next.x) tempSphere.position.x -= 1;
    if (tempSphere.position.x < next.x) tempSphere.position.x += 1;
    if (tempSphere.position.z > next.z) tempSphere.position.z -= 1;
    if (tempSphere.position.z < next.z) tempSphere.position.z += 1;
    requestAnimationFrame(pathAnimate);

}

function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
}

function initStatus() {
    stats = new Stats();
    stats.domElement.style.position = absolute_str;
    stats.domElement.style.bottom = bottom_px_str;
    stats.domElement.style.zIndex = 100;
    container.appendChild(stats.domElement);
}

function updateSize() {
    if (windowWidth != window.innerWidth || windowHeight != window.innerHeight) {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
        renderer.setSize(windowWidth, windowHeight);
    }
}

function animate() {
    rotateCloud();
    requestAnimationFrame(animate);
    var delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    render();
    controls.update();
    stats.update();
}

function render() {
    updateSize();
    renderer.render(scene, camera);
}

function buildGui() {
    gui = new dat.GUI();
    params = {
        color: Colors.white,
        show: visible,
        rotateSpeedX: 0.01,
        rotateSpeedY: 0.01,
        rotateSpeedZ: 0.01
    }
    var f1 = gui.addFolder(cloud_str);
    f1.addColor(params, color_str, 0, 0.1).onChange(function (val) {
        for (let i = 0; i < Clouds.length; i++) {
            let c = Clouds[i]
            c.mat1.color.setHex(val)
        }
    });
    f1.add(params,rotate_speed_x_str, -0.1, 0.1);
    f1.add(params,rotate_speed_y_str, -0.1, 0.1);
    f1.add(params,rotate_speed_z_str, -0.1, 0.1);
    var scenery = gui.addFolder(scenery_str);
    scenery.add(sceneryControl, season_str, [spring_str, summer_str, autumn_str, winter_str]).onChange(GenerateScenery);
    scenery.add(sceneryControl, render_str, [tree_str, flower_Str]).onChange(onRenderOptionChange);
 
    var showLine = gui.addFolder(line_str);
    showLine.add(params, show_str).onChange(function () {
        visible = !visible;
        initLine();
    });

    gui.open();
    f1.open();
    scenery.open();
    showLine.open();
} 

function onRenderOptionChange() {
    switch(sceneryControl.renderType) {
        case tree_str: {
            initGrid(false)
            if (sceneryControl.season == spring_str) {
                material_floor.color.set(Colors.green);
                //tree autumn
                for (let i = 0; i < Trees.length; i++) {
                    let t = Trees[i]
                    t.mat1.color.set(Colors.green);
                    t.mat2.color.set(Colors.green);
                    t.mat3.color.set(Colors.green);
                }
            } else if (sceneryControl.season == summer_str) {
                material_floor.color.set(Colors.lightgreen);
                //tree autumn
                for(let i = 0; i < Trees.length; i++) {
                    let t = Trees[i]
                    t.mat1.color.set(Colors.lightgreen);
                    t.mat2.color.set(Colors.lightgreen);
                    t.mat3.color.set(Colors.lightgreen);
                }
            } else if (sceneryControl.season == autumn_str) {
                material_floor.color.set(Colors.brown);
                //tree autumn
                for (let i = 0; i < Trees.length; i++) {
                    let t = Trees[i]
                    t.mat1.color.set(Colors.aut);
                    t.mat2.color.set(Colors.aut);
                    t.mat3.color.set(Colors.aut);
                }
            } else if (sceneryControl.season == winter_str) {
                material_floor.color.set(Colors.white);
                for (let i = 0; i < Trees.length; i++) {
                    let t = Trees[i]
                    t.mat1.color.set(Colors.white);
                    t.mat2.color.set(Colors.white);
                    t.mat3.color.set(Colors.white);
                }
            }
            break;
        }
        case flower_Str: {
            initGrid(true)
            if (sceneryControl.season == spring_str){
                //flower autumn
                for (let i = 0; i < Flowers.length; i++) {
                    let f = Flowers[i]
                    f.mat1.color.set(Colors.green);
                    f.mat2.color.set(Colors.yellow);
                    f.mat3.color.set(Colors.petalColor);
                }
            }else if (sceneryControl.season == summer_str) {
                material_floor.color.set(Colors.lightgreen);
                //flower autumn
                for (let i = 0; i < Flowers.length; i++) {
                    let f = Flowers[i]
                    f.mat1.color.set(Colors.brown);
                    f.mat2.color.set(Colors.yellow);
                    f.mat3.color.set(Colors.blue);
                }
            } else if (sceneryControl.season == summer_str) {
                material_floor.color.set(Colors.brown);
                //flower autumn
                for (let i = 0; i < Flowers.length; i++) {
                    let f = Flowers[i]
                    f.mat1.color.set(Colors.brown);
                    f.mat2.color.set(Colors.blue);
                    f.mat3.color.set(Colors.pink);
                }
            } else if (sceneryControl.season == winter_str) {
                material_floor.color.set(Colors.white);
                //flower autumn
                for (let i = 0; i < Flowers.length; i++) {
                    let f = Flowers[i]
                    f.mat1.color.set(Colors.brown);
                    f.mat2.color.set(Colors.yellow);
                    f.mat3.color.set(Colors.white);
                }
            }
            break;
        }
    }
}

function GenerateScenery() {
    if (sceneryControl.season == spring_str) {
        material_floor.color.set(Colors.green);
        planeMaterial.color.set(Colors.green);
            for(let i = 0; i < Trees.length; i++) {
            let t = Trees[i]
            t.mat1.color.set(Colors.green);
            t.mat2.color.set(Colors.green);
            t.mat3.color.set(Colors.green);
        }
        //flower spring
        for (let i = 0; i < Flowers.length; i++) {
            let f = Flowers[i]
            f.mat1.color.set(Colors.green);
            f.mat2.color.set(Colors.yellow);
            f.mat3.color.set(Colors.petalColor);
        }

    }
    else if (sceneryControl.season == summer_str) {
        material_floor.color.set(Colors.lightgreen);
        planeMaterial.color.set(Colors.lightgreen);
        for(let i = 0; i < Trees.length; i++) {
            let t = Trees[i]
            t.mat1.color.set(Colors.lightgreen);
            t.mat2.color.set(Colors.lightgreen);
            t.mat3.color.set(Colors.lightgreen);
        }
        for (let i = 0; i < Flowers.length; i++) {
            let f = Flowers[i]
            f.mat1.color.set(Colors.brown);
            f.mat2.color.set(Colors.yellow);
            f.mat3.color.set(Colors.blue);
        }
    }
    else if (sceneryControl.season == autumn_str) {
        material_floor.color.set(Colors.brown);
        planeMaterial.color.set(Colors.brown);
        //tree autumn
        for(let i = 0; i < Trees.length; i++) {
            let t = Trees[i]
            t.mat1.color.set(Colors.aut);
            t.mat2.color.set(Colors.aut);
            t.mat3.color.set(Colors.aut);
        }

        //flower autumn
        for (let i = 0; i < Flowers.length; i++) {
            let f = Flowers[i]
            f.mat1.color.set(Colors.brown);
            f.mat2.color.set(Colors.blue);
            f.mat3.color.set(Colors.pink);
        }
    }
    else if (sceneryControl.season == winter_str) {
        material_floor.color.set(Colors.white);
        planeMaterial.color.set(Colors.white);
        for(let i = 0; i < Trees.length; i++) {
            let t = Trees[i]
            t.mat1.color.set(Colors.white);
            t.mat2.color.set(Colors.white);
            t.mat3.color.set(Colors.white);
        }

        //flower autumn
        for (let i = 0; i < Flowers.length; i++) {
            let f = Flowers[i]
            f.mat1.color.set(Colors.brown);
            f.mat2.color.set(Colors.yellow);
            f.mat3.color.set(Colors.white);
        }
    }
};

function rotateCloud() {
    for (let i = 0; i < Clouds.length; i++) {
        let c = Clouds[i];
        c.mesh.rotation.x+=params.rotateSpeedX;
        c.mesh.rotation.y+=params.rotateSpeedY;
        c.mesh.rotation.z+=params.rotateSpeedZ;
    }
}


function createObjects() {
    //create tree object
    Tree = function () {
        // Create an empty container for the tree
        this.mesh = new THREE.Object3D();

        //three tree levels of materials
        this.mat1 = new THREE.MeshPhongMaterial({ color: Colors.green, flatShading: true });
        this.mat2 = new THREE.MeshPhongMaterial({ color: Colors.green, flatShading: true });
        this.mat3 = new THREE.MeshPhongMaterial({ color: Colors.green, flatShading: true });

        // tree base: box geometry and material
        var geonTreeBase = new THREE.BoxGeometry(2, 4, 3);
        var matTreeBase = new THREE.MeshBasicMaterial({ color: Colors.brown });
        var treeBase = new THREE.Mesh(geonTreeBase, matTreeBase);
        treeBase.castShadow = true;
        treeBase.receiveShadow = true;
        this.mesh.add(treeBase);

        // tree bottom level: cylinder geometry andd material
        var geomTreeLeaves1 = new THREE.CylinderGeometry(1, 2 * 3, 2 * 3, 4);
        var treeLeaves1 = new THREE.Mesh(geomTreeLeaves1, this.mat1);
        treeLeaves1.castShadow = true;
        treeLeaves1.receiveShadow = true;
        treeLeaves1.position.y = 3
        this.mesh.add(treeLeaves1);

        // tree middle level: cylinder geometry andd material
        var geomTreeLeaves2 = new THREE.CylinderGeometry(1, 1.5 * 3, 1.5 * 3, 4);
        var treeLeaves2 = new THREE.Mesh(geomTreeLeaves2, this.mat2);
        treeLeaves2.castShadow = true;
        treeLeaves2.position.y = 7;
        treeLeaves2.receiveShadow = true;
        this.mesh.add(treeLeaves2);

        //tree top level: cylinder geometry andd material
        var geomTreeLeaves3 = new THREE.CylinderGeometry(1, 1.2 * 3, 1.2 * 3, 4);
        var treeLeaves3 = new THREE.Mesh(geomTreeLeaves3, this.mat3);
        treeLeaves3.castShadow = true;
        treeLeaves3.position.y = 11;
        treeLeaves3.receiveShadow = true;
        this.mesh.add(treeLeaves3);
    }

    //create flower object
    Flower = function () {
        // Create an empty container for the flowers
        this.mesh = new THREE.Object3D();

        //flower stem box geometry and materials
        var geomStem = new THREE.BoxGeometry(1, 10, 1, 1, 1, 1);
        this.mat1 = new THREE.MeshPhongMaterial({ color: Colors.green, flatShading: true });
        var stem = new THREE.Mesh(geomStem, this.mat1);
        stem.castShadow = false;
        stem.receiveShadow = true;
        this.mesh.add(stem);

        //flower petal core box geometry and material
        var geomPetalCore = new THREE.BoxGeometry(5, 5, 5, 1, 1, 1);
        this.mat2 = new THREE.MeshPhongMaterial({ color: Colors.yellow, flatShading: true });
        petalCore = new THREE.Mesh(geomPetalCore, this.mat2);
        petalCore.castShadow = false;
        petalCore.receiveShadow = true;
        //flower petal color: randomly choose three colors
        var petalColor = petalColors[Math.floor(Math.random() * 3)];

        //flower petal box geometry and material 
        var geomPetal = new THREE.BoxGeometry(5, 7.5, 1, 1, 1, 1);
        this.mat3 = new THREE.MeshBasicMaterial({ color: petalColor });
        geomPetal.vertices[5].y -= 2;
        geomPetal.vertices[4].y -= 2;
        geomPetal.vertices[7].y += 2;
        geomPetal.vertices[6].y += 2;
        geomPetal.translate(5, 0, 3);

        //4 petals make one flower
        var petals = [];
        for (var i = 0; i < 4; i++) {

            petals[i] = new THREE.Mesh(geomPetal, this.mat3);
            petals[i].rotation.z = i * Math.PI / 2;
            petals[i].castShadow = true;
            petals[i].receiveShadow = true;
        }

        //add petals to its core
        petalCore.add(petals[0], petals[1], petals[2], petals[3]);
        petalCore.position.y = 5;
        petalCore.position.z = 3;

        //add flowers to the current mesh
        this.mesh.add(petalCore);
    }

    //create cloud object
    Cloud = function () {
        // Create an empty container for the cloud
        this.mesh = new THREE.Object3D();
        // Cube geometry and material
        var geom = new THREE.DodecahedronGeometry(20, 0);
        this.mat1 = new THREE.MeshPhongMaterial({
            color: Colors.white,
            flatShading: true
        });

        //each cloud combined with 3+random number of cubes
        var nBlocs = 3 + Math.floor(Math.random() * 3);

        for (var i = 0; i < nBlocs; i++) {
            //Clone mesh geometry
            var m = new THREE.Mesh(geom, this.mat1);
            //Randomly position each cube
            m.position.x = i * 7.5;
            m.position.y = Math.random() * 5;
            m.position.z = Math.random() * 5;
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

        // Number of cloud groups
        this.nClouds = 25;

        // Space the consistenly
        var stepAngle = Math.PI * 2 / this.nClouds;

        // Create the Clouds
        for (var i = 0; i < this.nClouds; i++) {

            var c = new Cloud();

            //set rotation and position using trigonometry
            var a = stepAngle * i;
            // this is the distance between the center of the axis and the cloud itself
            var h = 300 + Math.random() * 200;
            c.mesh.position.z = Math.sin(a) * h;
            c.mesh.position.x = Math.cos(a) * h;

            // rotate the cloud according to its position
            c.mesh.rotation.y = a + Math.PI / 2;
            // random depth for the clouds on the z-axis
            c.mesh.position.y = 200 + Math.random() * 800;

            // random scale for each cloud
            var s = 1 + Math.random() * 2;
            c.mesh.scale.set(s, s, s);

            this.mesh.add(c.mesh);
            Clouds.push(c)
        }
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
        sun.castShadow = false;
        sun.receiveShadow = false;
        this.mesh.add(sun);
    }
}

function createSky() {
    var sky = new Sky();
    sky.mesh.position.y = offSet;
    scene.add(sky.mesh);
}

function createSun() {
    sun = new Sun();
    sun.mesh.scale.set(1, 1, .3);
    sun.mesh.position.set(0, 30, 850);
    scene.add(sun.mesh);
}


function init(event){
    initThree();
    initScene();
    initCamera();
    initLight();
    initGround();
    initFloor();
    initUnderground();
    createObjects()
    createSky()
    createSun()
    initGrid(false);
    initControl();
    initStatus();
    buildGui();
    animate();
    renderer.clear();
}

window.addEventListener(load_str, init, false);