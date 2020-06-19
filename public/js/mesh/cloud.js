import Colors from '../../assets/colors.js'
//create cloud object
export default function () {
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