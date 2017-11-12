

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
  
  newGame() {
    this.player.position.z = -50;
    this.player.rotation.x = -0.4;
    this.player.rotation.z = -2.355;
    scene.add(this.player);

    this.camera.position.y = 15;
    this.camera.rotation.x = -0.1;
    this.keyState = { keydown: false, right: false, left: false };
    
    this.turnState = { xAccel: 0, xSpeed: 0, maxXSpeed: 2.5 };
    this.startListeners();
    //call render and make sure it can end
  }
  
  update() {
    
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