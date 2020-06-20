import Colors from '../assets/colors.js'
import Tree from './mesh/tree-maze.js'
import Flower from './mesh/flower-maze.js'
import Sun from './mesh/sun.js'
import Sky from './mesh/sky-maze.js'
// import Forest from './mesh/forest.js'


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
    
var container, scene, camera, renderer, controls, stats;
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
var isClicked = false


var resultArray = new Array();
var borders = []

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
    // HEIGHT = window.innerHeight;
    // WIDTH = window.innerWidth;
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
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
    scene.fog = new THREE.Fog(Colors.fog, 100, 950);
}

function initLight() {
    // Gradient coloured light - Sky, Ground, Intensity
    var hemisphereLight = new THREE.HemisphereLight(0xf7d9aa, 0x000000, .9)
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
    borders.push(plane)
    scene.add(plane);

    var plane = new THREE.Mesh(geometry, planeMaterial);
    plane.rotation.y = 90 * Math.PI / 180;
    plane.position.set(length / 2, 0, 0);
    borders.push(plane)
    scene.add(plane);

    var plane = new THREE.Mesh(geometry, planeMaterial);
    plane.position.set(0, 0, -length / 2);
    borders.push(plane)
    scene.add(plane);

    var plane = new THREE.Mesh(geometry, planeMaterial);
    plane.rotation.y = 90 * Math.PI / 180;
    plane.position.set(-length / 2, 0, 0);
    borders.push(plane)
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
    var geometry = new THREE.Geometry();
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
                    // tree.
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

function onKeyDownHandler(e) {
    // console.log(borders) 
    
    var char = scene.getObjectByName("character") 
    // console.log(isValidate(char))
    switch(e.keyCode) {
        case 87:
            console.log("w")
            moveUp(char)
            break
        case 83: 
            console.log("s")
            moveDown(char)
            break
        case 65: 
            console.log("a")
            moveLeft(char)
            break
        case 68:
            console.log("d")
            moveRight(char)
            break
    }
}

function moveUp(char) {
    char.rotation.y = 180
    // var currentPosition = char.position.z
    if ( isValidate(char.position.x,char.position.z-1 ) ) {
        char.position.z -= 1
    } else{
        // char.position.z += 0.5
    }
    
}

function moveDown(char) {
    char.rotation.y = 0
    // var currentPosition = char.position.z
    if( isValidate(char.position.x, char.position.z+1) ) {
        char.position.z += 1
    } else {
        // char.position.z -= 0.5
    }
   
}

function moveLeft(char) {
    char.rotation.y = -90
    // var currentPosition = char.position.x
    if( isValidate(char.position.x-1, char.position.z) ) {
        char.position.x -= 1
    } else {
        // char.position.x += 0.5
    }
}

function moveRight(char) {
    char.rotation.y = 90
    // var currentPosition = char.position.x
    if( isValidate(char.position.x+1, char.position.z) ) {
        char.position.x += 1
    } else{
        // char.position.x -= 0.5
    }
            
}


function isValidate(x1,z1) {
    // basically a strip-down collision detection using simple math
    // 1. tell if the character collides with the trees or flowers 
    var isBool = true
    Trees.forEach((tree) => {
        // console.log(tree.mesh.position) 
        var x2 = tree.mesh.position.x
        var z2 = tree.mesh.position.z 
        // console.log( getDistance(x1,y1,z1,x2,y2,z2) ) 
        if ( getDistance(x1,z1,x2,z2) < 10) { 
            isBool = false  
        }
    })

    Flowers.forEach( (flower) => {
        var x2 = flower.mesh.position.x
        var z2 = flower.mesh.position.z 
        // console.log( getDistance(x1,y1,z1,x2,y2,z2) ) 
        if ( getDistance(x1,z1,x2,z2) < 10) { 
            isBool = false  
        }
    })
    


    // 2. tell if the character collides with the border
    if(x1 > 92 || x1 <-92 || z1 >95 || z1 <-90) {
        isBool = false
    }

    
    console.log(isBool)
    return isBool
    // return true 
}

function getDistance(x1, z1, x2, z2) {
    let xDistance = x2 - x1 
    let zDistance = z2 - z1 

    return Math.sqrt( Math.pow(xDistance,2) + Math.pow(zDistance, 2) )
}


function clickHandler(e) {
    if(!isClicked) {
        pickupObjects(e)
    } else {
        return
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
    isClicked = true
}

document.addEventListener(click_str, clickHandler, false);
document.addEventListener("keydown", onKeyDownHandler, false)
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
            object.name  = "character" 
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
    if (tempSphere.position.x > next.x)
    {
        tempSphere.position.x -= 1;
        tempSphere.rotation.y = -90;
    }


    if (tempSphere.position.x < next.x)
    {
        tempSphere.position.x += 1;
        tempSphere.rotation.y = 90;
    }

    if (tempSphere.position.z > next.z)
    {
        tempSphere.position.z -= 1;
        tempSphere.rotation.y = Math.PI / 2;
    }

    if (tempSphere.position.z < next.z)
    {
        tempSphere.position.z += 1;
        tempSphere.rotation.y = 0;
    }
    tempSphere.updateMatrix();
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




function createSky() {
    var sky = new Sky(Clouds);
    sky.mesh.position.y = offSet;
    scene.add(sky.mesh);
}

function createSun() {
    var sun = new Sun();
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