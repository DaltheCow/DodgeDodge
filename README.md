## Dodge Dodge

Try out the [game](https://dalthecow.github.io/DodgeDodge)!

Sorry! The game is temporarily out of sorts on mobile. The device orientation event listener can only be used on https now and github pages doesn't allow you to use https with a custom domain (working on a work around).


![DodgeDodge demo](/images/DodgeDodge.gif)

### Background

Dodge Dodge is a time-based, 3D obstacle avoidance game

The player moves forward at an increasing rate (speed increments at distance levels). There are cubes that randomly spawn and the player has to use the arrow keys to steer around them. Score is determined by distance. If you are feeling lucky, try the up arrow key every once in a while and enter into boost mode for bonus points!

### Features

- Smooth and responsive controls make for addictive gameplay.
- Difficulty increases with time and personal high scores are tracked via local storage
- Renders 3D objects at 60fps with three.js library
- Reduces memory load by reusing cube geometries and meshes

### Code Snippet

```
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
```

#### This data structure allows me to easily reuse the three.js mesh objects
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The addCube method simply takes a mesh and puts it into the scene at the given position
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The removeCubes method takes a test function and removes every passing mesh from the scene
* Increases performance
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If the game creates too many mesh objects, it begins to slow down. For some reason the three.js library doesn't properly garbage collect these mesh objects.
* Dynamically resizes

### Future Direction

- Complex preset cube paths will appear at a certain frequency between the random cube fields
- Node server with MongoDB database for high score Board
- UI changes
  - Background and cube textures will change appearance on level increases
  - Add clouds for more dramatic 3D feel
- Make playable on mobile via accelerometer

Coded by Benjamin Blue
