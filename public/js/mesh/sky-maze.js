import Cloud from './cloud-maze.js'
//create sky object
export default function (Clouds) {

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