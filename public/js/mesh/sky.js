import Cloud from './cloud.js'
//create sky object
export default function () {
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