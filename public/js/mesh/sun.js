import Colors from '../../assets/colors.js'
export default function () {
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