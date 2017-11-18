document.addEventListener('DOMContentLoaded', () => {
    
  let gameOn = true;
  const startGameSpeed = 7.5;
  let gameSpeed = startGameSpeed;
  let lastAddedCubesPos = gameSpeed * 50;
  let paused = false;
  
  let cubeArray = [];
  const renderer = new THREE.WebGLRenderer({canvas: document.getElementById("myCanvas"), antialias: true});
  renderer.setClearColor(0x282c2f);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(400, 300);

  const camera = new THREE.PerspectiveCamera(35, 4/3, 0.1, 700);
  const scene = new THREE.Scene();

  const light = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(light);
  const light1 = new THREE.PointLight(0xffffff, 0.5);
  scene.add(light1);

  const geometry = new THREE.CubeGeometry(10, 10, 10);
  const material = new THREE.MeshLambertMaterial({color: 0xF3FFE2});
  
  
  var planeGeometry = new THREE.PlaneGeometry( 1000, 4000);
  var planeMaterial = new THREE.MeshBasicMaterial( {color: 0xBBBBBB, side: THREE.DoubleSide} );
  var plane = new THREE.Mesh( planeGeometry, planeMaterial );
  plane.position.z = -10;
  plane.position.y = -3;
  plane.rotation.x = -Math.PI/2;
  
  scene.add( plane );

  THREE.TetrahedronGeometry = function ( radius, detail ) {

      var vertices = [ 0,  0,  0,   0, 1,  0,   1,  0, 0,    0, 0, 1];
      var indices = [ 2,  1,  0,    0,  3,  2,    1,  3,  0,    2,  3,  1];

      THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );
  };

  THREE.TetrahedronGeometry.prototype = Object.create( THREE.Geometry.prototype );

  const playerSize = 7;

  const playerGeometry = new THREE.TetrahedronGeometry(playerSize, 0);


  playerGeometry.vertices[0].y = playerSize / 2;
  playerGeometry.vertices[2].x = playerSize / 2;


  const playerMaterial = new THREE.MeshStandardMaterial({color: 0xF3FFE2});
  const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
  playerMesh.position.z = -50;
  playerMesh.rotation.x = -0.4;
  playerMesh.rotation.z = -2.355;
  scene.add(playerMesh);

  camera.position.y = 15;
  camera.rotation.x = -0.1;
  
  const keyState = { keydown: false, right: false, left: false, xAccel: 0, xSpeed: 0, maxXSpeed: 2.5, up: false };

  function newGame() {
    keyState.keydown = false;
    keyState.right = false;
    keyState.left = false;
    keyState.xAccel = 0;
    keyState.xSpeed = 0;
    keyState.maxXSpeed = 2.5;
    camera.position.z = 0;
    camera.position.x = 0;
    playerMesh.position.z = -50;
    plane.position.z = -10;
    plane.position.y = -3;
    gameOn = true;
    gameSpeed = 6;
    paused = false;
    lastAddedCubesPos = gameSpeed * 50;
    scene.children.slice(4).forEach(child => scene.remove(child));
    cubeArray = [];
  }

  requestAnimationFrame(render);

  function render() {
    if (gameOn && !paused) {
      cubeArray = update(cubeArray, camera, scene, keyState, playerMesh);
    }
      renderer.render(scene, camera);
      requestAnimationFrame(render);
  }
  
  function addCube(x, y, z, scene, size = 10) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
  }

  function canPlaceCube(pos1, pos2, size = 10) {
    return !(Math.abs(pos1.x - pos2.x) < size && Math.abs(pos1.z - pos2.z) < size);
  }

  function addCubes(scene, camera, size = 10) {
    const numCubes = Math.floor(Math.random() * 10) + 75;
    const newPoses = [];
    for (let i = 0; i < numCubes; i++) {
      let valid = false,
          newPos = {};
      while (!valid) {
        const x = Math.floor(Math.random() * 2000) - 1000 + camera.position.x;
        const z = Math.floor(Math.random() * 480) - 1490 + camera.position.z;
        newPos = { x, z };
        valid = !newPoses.some(pos => !canPlaceCube(pos, newPos, 10));
      }
      newPoses.push(newPos);
    }
    return newPoses.map(pos => addCube(pos.x, 3, pos.z, scene, size));
  }

  function removeCubes(cubeArray, scene) {
    if (cubeArray.length > 1000) {
      for (let i = 0; i < cubeArray.length - 800; i++) {
        scene.remove(cubeArray[i]);
        cubeArray[i] = undefined;
      }
      return cubeArray.slice(cubeArray.length - 400);
    }
    return cubeArray;
  }

  function reduceToLimit(num, limit) {
    if (Math.abs(num) > limit) {
      return num < 0 ? -limit : limit;
    } else {
      return num;
    }
  }
  
  function handleGameSpeed(camera) {
    const lvlDistanceConst = 15000;
    [1,2,3,4,5].forEach(num => {
      if (camera.position.z < num * -lvlDistanceConst) {
        gameSpeed = startGameSpeed + 1 * num;
      }
    });
  }

  function updateCameraPos(camera, keyState, playerMesh) {
    const turnSpd = 0.25;
    if (keyState.up) {
      camera.position.z -= gameSpeed + 3;
    }
    if (keyState.keydown && !(keyState.left && keyState.right)) {
      if (keyState.right) {
        keyState.xAccel = turnSpd;
      } else {
        keyState.xAccel = -turnSpd;
      }
    } else {
      if (keyState.xSpeed !== 0) {
        if (Math.abs(keyState.xSpeed) < 0.1) {
          keyState.xSpeed = 0;
          keyState.xAccel = 0;
        } else if (Math.abs(keyState.xSpeed) < 1) {
          keyState.xAccel = keyState.xSpeed < 0 ? 0.01 : -0.01;
        } else {
          keyState.xAccel = keyState.xSpeed < 0 ? 0.2 : -0.2;
        }
      }
    }
    keyState.xSpeed = reduceToLimit(keyState.xSpeed + keyState.xAccel, keyState.maxXSpeed);
    camera.position.x += keyState.xSpeed;
    camera.rotation.z = -0.2 * ( keyState.xSpeed / keyState.maxXSpeed );
    camera.position.z -= gameSpeed;
    playerMesh.position.x = camera.position.x;
    playerMesh.rotation.z = camera.rotation.z - 2.35;
    playerMesh.position.z = camera.position.z - 50;
    plane.position.z = camera.position.z -2000;
    plane.position.x = camera.position.x;
    

  }

  function doSomethingIfGameIsOver(cubeArray, playerMesh, size) {
    const gameOver = cubeArray.some(cube => (
      //i am missing to the left and hitting wrong to the right
      cube.position.x - size/2 < playerMesh.position.x &&
      cube.position.x + size/2 > playerMesh.position.x &&
      cube.position.z - size/2 < playerMesh.position.z + 7 &&
      cube.position.z + size/2 > playerMesh.position.z - 7
    ));
    return gameOver;
  }
  
  function updateScore(camera) {
    const roundedScore = -10 * Math.floor(camera.position.z / 10);
    document.getElementById("score").innerHTML = roundedScore;
  }

  function update(cubeArray, camera, scene, keyState, playerMesh) {
    const cubeSize = 10;
    updateCameraPos(camera, keyState, playerMesh);
    handleGameSpeed(camera);
    updateScore(camera);
    if ((lastAddedCubesPos - camera.position.z) >= 6 * 50) {
      cubeArray = cubeArray.concat(addCubes(scene, camera, cubeSize));
      lastAddedCubesPos = camera.position.z;
    }
    cubeArray = removeCubes(cubeArray, scene);
    if (doSomethingIfGameIsOver(cubeArray, playerMesh, cubeSize)) {
      gameOn = false;
    }

    return cubeArray;
  }


  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
    }
    switch(e.key) {
      case 'ArrowLeft': {
        keyState.keydown = true;
        keyState.left = true;
        break;
      }
      case 'ArrowRight': {
        keyState.keydown = true;
        keyState.right = true;
        break;
      }
      case 'ArrowUp': {
        // keyState.keydown = true;
        keyState.up = true;
        break;
      }
      case 'r': {
        newGame();
        break;
      }
      case 'p': {
        paused = !paused;
        break;
      }
    }

  });

  document.addEventListener('keyup', (e) => {
    switch(e.key) {
      case 'ArrowLeft': {
        keyState.left = false;
        break;
      }
      case 'ArrowRight': {
        keyState.right = false;
        break;
      }
      case 'ArrowUp': {
        keyState.up = false;
        break;
      }
    }
    if (!keyState.right && !keyState.left) {
      keyState.keydown = false;
    }

  });
});