class cubeStore {
  constructor(scene, geometry, material, initialSize) {
    this.scene = scene;
    this.geometry = geometry;
    this.material = material;
    this.storage = [];
    this.cubesInScene = [];
    this.addCubes(raiseToLimit(initialize, 1));
  }

  raiseToLimit(num, limit) {
    return num < limit ? limit : num;
  }

  addCubes(num) {
    const { storage, geometry, material } = this;
    for (let i = 0; i < num; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      storage.push(mesh);
    }
  }

  addCube(x, y, z) {
    const { storage, cubesInScene, addCubes } = this;
    if (storage.length === 0) {
      addCubes(cubesInScene.length);
    }
    const mesh = storage.pop();
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
  }

}