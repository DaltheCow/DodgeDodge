

class Game {
  constructor() {
    
    this.renderer = createRenderer();
    this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 700);
    this.scene = new THREE.Scene();
    this.light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);
    this.light1 = new THREE.PointLight(0xffffff, 0.5);
    scene.add(light1);
    
    this.cubeSize = 10;
    this.cubeGeometry = new THREE.CubeGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
    this.cubeMaterial = new THREE.MeshLambertMaterial({color: 0xF3FFE2});
    
    this.playerSize = 7;
    this.player = createPlayer(this.playerSize);
    this.field = new Field(this.cubeGeometry, this.cubeMaterial, this.scene);
    
  }
  
  newGame() {
    this.player.position.z = -50;
    this.player.rotation.x = -0.4;
    this.player.rotation.z = -2.355;
    this.gameOn = true;
    this.gameSpeed = 6;
    scene.add(this.player);
    
    this.camera.position.y = 15;
    this.camera.rotation.x = -0.1;
    this.keyState = { keydown: false, right: false, left: false };
    
    this.turnState = { xAccel: 0, xSpeed: 0, maxXSpeed: 2.5 };
    this.startListeners();
    this.render();
  }
  
  createRenderer() {
    const canvas = document.getElementById("myCanvas");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true
    });
    renderer.setClearColor(0xCCCCCC);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.width, canvas.height);
    return renderer;
  }
  
  
  render() {
    if (this.gameOn) {
      cubeArray = update(cubeArray, camera, scene, keyState, playerMesh);
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
  }
  
  update(cubeArray, camera, scene, keyState, playerMesh) {
    const cubeSize = 10;
    updateCameraPos(camera, keyState, playerMesh);

    if (-camera.position.z % (gameSpeed * 50) === 0) {
      cubeArray = cubeArray.concat(addCubes(scene, camera, cubeSize));
    }
    cubeArray = removeCubes(cubeArray, scene);
    if (doSomethingIfGameIsOver(cubeArray, camera, cubeSize)) {
      gameOn = false;
    }

    return cubeArray;
  }
  
  onKeydown(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
    }
    switch(e.key) {
      case 'ArrowLeft': {
        this.keyState.keydown = true;
        this.keyState.left = true;
        break;
      }
      case 'ArrowRight': {
        this.keyState.keydown = true;
        this.keyState.right = true;
        break;
      }
    }
  }
  
  onKeyup(e) {
    switch(e.key) {
      case 'ArrowLeft': {
        this.keyState.left = false;
        break;
      }
      case 'ArrowRight': {
        this.keyState.right = false;
        break;
      }
    }
    if (!this.keyState.right && !this.keyState.left) {
      this.keyState.keydown = false;
    }
  }
  
  startListeners() {
    this.onKeyup = this.onKeyup.bind(this);
    this.onKeydown = this.onKeydown.bind(this);
    document.addEventListener('keyup', this.onKeyup);
    document.addEventListener('keydown', this.onKeydown);
  }
  
  removeListeners() {
    document.removeEventListener('keyup', this.onKeyup);
    document.removeEventListener('keydown', this.onKeydown);
    
  }
  
}