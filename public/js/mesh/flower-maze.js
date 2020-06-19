import Color from '../../assets/colors.js'
export default function () {
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