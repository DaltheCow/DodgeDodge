

class Field {
  constructor(cubeGeo, cubeMat, scene, camera) {
    this.cubeArray = [];
    
  }
  
  createPlayer(size) {
    THREE.TetrahedronGeometry = function ( radius, detail ) {
        var vertices = [ 0,  0,  0,   0, 1,  0,   1,  0, 0,    0, 0, 1];
        var indices = [ 2,  1,  0,    0,  3,  2,    1,  3,  0,    2,  3,  1];
        THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );
    };
    THREE.TetrahedronGeometry.prototype = Object.create( THREE.Geometry.prototype );
    
    const playerGeometry = new THREE.TetrahedronGeometry(size, 0);
    playerGeometry.vertices[0].y = size / 2;
    playerGeometry.vertices[2].x = size / 2;
    
    const playerMaterial = new THREE.MeshStandardMaterial({color: 0xF3FFE2});
    const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
    return playerMesh;
  }
  
}