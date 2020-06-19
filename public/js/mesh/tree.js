import Colors from '../../assets/colors.js'
//create tree object
export default function () {
    // Create an empty container for the tree
    this.mesh = new THREE.Object3D();

    // tree leaves material
    var matTreeLeaves = new THREE.MeshPhongMaterial({
        color: Colors.green, 
        flatShading: true 
    });

    // tree base: box geometry and material
    var geonTreeBase = new THREE.BoxGeometry(10, 20, 10);
    var matTreeBase = new THREE.MeshBasicMaterial({ color: Colors.brown });
    var treeBase = new THREE.Mesh(geonTreeBase, matTreeBase);
    treeBase.castShadow = true;
    treeBase.receiveShadow = true;
    this.mesh.add(treeBase);

    // tree bottom level: cylinder geometry andd material
    var geomTreeLeaves1 = new THREE.CylinderGeometry(1, 12 * 3, 12 * 3, 4);
    var treeLeaves1 = new THREE.Mesh(geomTreeLeaves1, matTreeLeaves);
    treeLeaves1.castShadow = true;
    treeLeaves1.receiveShadow = true;
    treeLeaves1.position.y = 20
    this.mesh.add(treeLeaves1);

    // tree middle level: cylinder geometry andd material
    var geomTreeLeaves2 = new THREE.CylinderGeometry(1, 9 * 3, 9 * 3, 4);
    var treeLeaves2 = new THREE.Mesh(geomTreeLeaves2, matTreeLeaves);
    treeLeaves2.castShadow = true;
    treeLeaves2.position.y = 40;
    treeLeaves2.receiveShadow = true;
    this.mesh.add(treeLeaves2);

    //tree top level: cylinder geometry andd material
    var geomTreeLeaves3 = new THREE.CylinderGeometry(1, 6 * 3, 6 * 3, 4);
    var treeLeaves3 = new THREE.Mesh(geomTreeLeaves3, matTreeLeaves);
    treeLeaves3.castShadow = true;
    treeLeaves3.position.y = 55;
    treeLeaves3.receiveShadow = true;
    this.mesh.add(treeLeaves3);
}