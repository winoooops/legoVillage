import Tree from './tree.js'
import Flower from './flower.js'
//create forest object
export default function () {
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