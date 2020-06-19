import Colors from '../../assets/colors.js'

//create land object
export default function () {
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