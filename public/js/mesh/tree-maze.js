import Colors from '../../assets/colors.js'
export default function () {
    // Create an empty container for the tree
    this.mesh = new THREE.Object3D();

    //three tree levels of materials
    this.mat1 = new THREE.MeshPhongMaterial({ color: Colors.green, flatShading: true });
    this.mat2 = new THREE.MeshPhongMaterial({ color: Colors.green, flatShading: true });
    this.mat3 = new THREE.MeshPhongMaterial({ color: Colors.green, flatShading: true });

    // tree base: box geometry and material
    var geonTreeBase = new THREE.BoxGeometry(2, 4, 3);
    var matTreeBase = new THREE.MeshBasicMaterial({ color: Colors.brown });
    var treeBase = new THREE.Mesh(geonTreeBase, matTreeBase);
    treeBase.castShadow = true;
    treeBase.receiveShadow = true;
    this.mesh.add(treeBase);

    // tree bottom level: cylinder geometry andd material
    var geomTreeLeaves1 = new THREE.CylinderGeometry(1, 2 * 3, 2 * 3, 4);
    var treeLeaves1 = new THREE.Mesh(geomTreeLeaves1, this.mat1);
    treeLeaves1.castShadow = true;
    treeLeaves1.receiveShadow = true;
    treeLeaves1.position.y = 3
    this.mesh.add(treeLeaves1);

    // tree middle level: cylinder geometry andd material
    var geomTreeLeaves2 = new THREE.CylinderGeometry(1, 1.5 * 3, 1.5 * 3, 4);
    var treeLeaves2 = new THREE.Mesh(geomTreeLeaves2, this.mat2);
    treeLeaves2.castShadow = true;
    treeLeaves2.position.y = 7;
    treeLeaves2.receiveShadow = true;
    this.mesh.add(treeLeaves2);

    //tree top level: cylinder geometry andd material
    var geomTreeLeaves3 = new THREE.CylinderGeometry(1, 1.2 * 3, 1.2 * 3, 4);
    var treeLeaves3 = new THREE.Mesh(geomTreeLeaves3, this.mat3);
    treeLeaves3.castShadow = true;
    treeLeaves3.position.y = 11;
    treeLeaves3.receiveShadow = true;
    this.mesh.add(treeLeaves3);
}