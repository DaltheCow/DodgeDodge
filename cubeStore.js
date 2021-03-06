class CubeStore {
  constructor(scene, geometry, material, initialSize) {
    this.scene = scene;
    this.geometry = geometry;
    this.material = material;
    this.storage = [];
    this.cubesInScene = [];
    this.addCubes(this.raiseToLimit(initialSize, 1));
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

  //public api
  addCube(x, y, z) {
    const { storage, cubesInScene, addCubes, scene } = this;
    if (storage.length === 0) {
      this.addCubes(cubesInScene.length);
    }
    const mesh = storage.pop();
    mesh.position.set(x, y, z);
    scene.add(mesh);
    cubesInScene.push(mesh);
  }

  removeCubes(test) {
    let { scene, cubesInScene, storage } = this;
    const newCubesInScene = [];
    cubesInScene.forEach(mesh => {
      if (test(mesh)) {
        scene.remove(mesh);
        storage.push(mesh);
      } else {
        newCubesInScene.push(mesh);
      }
    });
    this.cubesInScene = newCubesInScene;
  }

  reset() {
    let { storage, cubesInScene, scene } = this;
    cubesInScene.forEach(mesh => {
      scene.remove(mesh);
      storage.push(mesh);
    });
    this.cubesInScene = [];
  }

  length() {
    return this.cubesInScene.length;
  }

  some(test) {
    return this.cubesInScene.some(test);
  }

}

export default CubeStore;
