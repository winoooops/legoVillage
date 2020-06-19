import Colors from '../../assets/colors.js'
const petalColors = [Colors.red, Colors.yellow, Colors.blue];

//create flower object
export default function () {
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
    var petalCore = new THREE.Mesh(geomPetalCore, matPetalCore);
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