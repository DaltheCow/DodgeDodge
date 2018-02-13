import CubeStore from './cubeStore.js';

document.addEventListener('DOMContentLoaded', () => {

  //initialize global game/view state vars
  let gameOn = false;
  const startGameSpeed = 7.5;
  let gameSpeed = startGameSpeed;
  let lastAddedCubesPos = gameSpeed * 50;
  let paused = false;
  let backgroundColor = [40, 44, 47];
  let speedScore = 0;
  let totalScore = 0;
  let gameStarted = false;
  let isLandscape = /.*landscape.*/.test(screen.orientation.type);
  let lastOrient = undefined;
  let fullScreen = false;

  const newGameDisplay = Array.from(document.querySelectorAll(".not-score"));


  const toggleFullscreen = () => {
    if (fullScreen) {
      exitFS();
    } else {
      reqFS();
    }
  };


  window.onresize = function() {
    if (fullScreen) {
      resizeScreen(fullScreen, true);
    }
  };

  const newGameButton = document.querySelector(".new-game-text");
  const highScoreDisplay = document.getElementById("high-score");
  const canvas = document.getElementById("myCanvas");
  const fullscreenBtn = document.querySelector(".btn.left");
  const body = document.querySelector("body");

  let exitFS = (document.exitFullscreen ||
    document.webkitExitFullscreen ||
    document.mozCancelFullScreen ||
    document.msExitFullscreen).bind(document);

  let reqFS = (body.requestFullscreen ||
    body.webkitRequestFullscreen ||
    body.mozRequestFullScreen ||
    body.msRequestFullscreen).bind(body);

  let isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent));

  let fsBool = false;
  const reqFSMobile = () => {
    if (fsBool) reqFS();
    document.removeEventListener('click', reqFSMobile);
  };

  if (isMobile) {
    document.querySelector(".desktop-instructions").setAttribute("style", "display: none;");
    document.querySelector(".mobile-instructions").setAttribute("style", "display: block;");
    setTimeout(() => {
      fsBool = confirm("Would you like to play in fullscreen? (click anywhere on the screen after)");
      if (fsBool) {

        document.addEventListener('click', reqFSMobile);
      }
    }, 0);
  }


  fullscreenBtn.onclick = toggleFullscreen;


  function resizeScreen(isDefault, wasRotated) {
      if(isDefault) {
        renderer.setSize(window.innerWidth / 1.2, window.innerHeight / 1.2);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      } else {
        renderer.setSize(400, 300);
        camera.aspect = 400 / 300;
        camera.updateProjectionMatrix();
      }
  }

  function fullScreenUpdate(e) {
    fullScreen = !fullScreen;
    setTimeout(() => resizeScreen(fullScreen), 0);
  }

  setHighScore();

  newGameButton.onclick = () => newGame();


  //setup three.js objects/variables

  const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
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

  const store = new CubeStore(scene, geometry, material, 1000);

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

  camera.position.y = 15;
  camera.rotation.x = -0.1;

  const keyState = { keydown: false, right: false, left: false, xAccel: 0, xSpeed: 0, maxXSpeed: 2.5, up: false };

  function newGame() {
    newGameDisplay.forEach(el => el.setAttribute("style", "display: none;"));
    scene.children[3] = playerMesh;
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
    store.reset();
    backgroundColor = [40, 44, 47];
    speedScore = 0;
    totalScore = 0;
    gameStarted = true;
    const currOrientation = screen.orientation.type;
    screen.orientation.lock(currOrientation);
    // const locOrientation = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation || screen.orientation.lock;
    // screen.locOrientation(currOrientation);
  }

  requestAnimationFrame(render);

  function render() {
    if (!gameStarted || (gameOn && !paused)) {
      update(camera, scene, keyState, playerMesh);
    }
      renderer.render(scene, camera);
      requestAnimationFrame(render);
  }

  function canPlaceCube(pos1, pos2, size = 10) {
    return !(Math.abs(pos1.x - pos2.x) < size && Math.abs(pos1.z - pos2.z) < size);
  }

  function addCubes(camera, size = 10) {
    const numCubes = Math.floor(Math.random() * 10) + 75;
    const newPoses = [];
    for (let i = 0; i < numCubes; i++) {
      let valid = false,
          newPos = {};
      while (!valid) {
        const x = Math.floor(Math.random() * 2000) - 1000 + camera.position.x;
        const z = Math.floor(Math.random() * 480) - 1490 + camera.position.z;
        newPos = { x, z };
        valid = !newPoses.some(pos => !canPlaceCube(pos, newPos, size));
      }
      newPoses.push(newPos);
    }
    const pos_y = 3;
    newPoses.forEach(pos => store.addCube(pos.x, pos_y, pos.z));
  }

  function removeCubes(camera) {
    if (store.length > 1000) {
      store.removeCubes(cube => cube.position.z > camera.position.z);
    }
  }

  function reduceToLimit(num, limit, lowerLimit) {
    if (!lowerLimit && Math.abs(num) > limit) {
      return num < 0 ? -limit : limit;
    } else if (lowerLimit && Math.abs(num) < limit) {
      return limit;
    } else {
      return num;
    }
  }

  function handleGameSpeed(camera) {
    const lvlDistanceConst = 15000;
    [1,2,3,4,5].forEach(num => {
      if (totalScore > num * lvlDistanceConst && gameOn) {
        gameSpeed = startGameSpeed + 1 * num;
      }
    });
  }

  function updateCameraPos(camera, keyState, playerMesh) {
    if (keyState.up) {
      camera.position.z -= gameSpeed + 3;
    }
    if (!isMobile) {
      updateSpeed(keyState);
    }
    camera.position.x += keyState.xSpeed;
    camera.rotation.z = -0.2 * ( keyState.xSpeed / keyState.maxXSpeed );
    camera.position.z -= gameSpeed;
    playerMesh.position.x = camera.position.x;
    playerMesh.rotation.z = camera.rotation.z - 2.35;
    playerMesh.position.z = camera.position.z - 50;
    plane.position.z = camera.position.z -2000;
    plane.position.x = camera.position.x;
  }

  function updateSpeed(keyState) {
    const turnSpd = 0.25;
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
          keyState.xAccel = keyState.xSpeed < 0 ? 0.03 : -0.03;
        } else {
          keyState.xAccel = keyState.xSpeed < 0 ? 0.2 : -0.2;
        }
      }
    }
    keyState.xSpeed = reduceToLimit(keyState.xSpeed + keyState.xAccel, keyState.maxXSpeed);
  }


  function doSomethingIfGameIsOver(playerMesh, size) {
    const gameOver = store.some(cube => (
      cube.position.x - size/2 < playerMesh.position.x &&
      cube.position.x + size/2 > playerMesh.position.x &&
      cube.position.z - size/2 < playerMesh.position.z + 7 &&
      cube.position.z + size/2 > playerMesh.position.z - 7
    ));
    return gameOver;
  }

  function updateScore(camera) {
    if (keyState.up && gameOn) {
      let speedBonus = Math.floor((backgroundColor[0] - 40) / 10);
      const hasMaxBonus = backgroundColor[0] === 255;
      speedScore += hasMaxBonus ? 30 : speedBonus;
    }
    const roundedScore = -Math.floor(camera.position.z);
    if (gameOn) {
      totalScore = speedScore + roundedScore;
      document.getElementById("score").innerHTML = totalScore;
      document.getElementById("score2").innerHTML = totalScore;
    }
  }

  function updateScreenColor(keyState) {
    if (keyState.up) {
      backgroundColor[0] = reduceToLimit(backgroundColor[0] + 1, 255);
      backgroundColor[1] = reduceToLimit(backgroundColor[1] + 1, 255);
      backgroundColor[2] = reduceToLimit(backgroundColor[2] + 1, 255);
    } else {
      backgroundColor[0] = reduceToLimit(backgroundColor[0] - 3, 40, 'lowerLimit');
      backgroundColor[1] = reduceToLimit(backgroundColor[1] - 3, 44, 'lowerLimit');
      backgroundColor[2] = reduceToLimit(backgroundColor[2] - 3, 47, 'lowerLimit');
    }
    const [r, g, b] = backgroundColor;
    document.querySelector("body").setAttribute("style", `background: rgb(${r}, ${g}, ${b});`);
  }

  function setHighScore() {
    let oldScore = Number(localStorage.getItem("highscore"));
    let newScore = oldScore && oldScore > totalScore ? oldScore : totalScore;
    localStorage.setItem("highscore", newScore);
    highScoreDisplay.innerHTML = newScore;
  }

  function handleGameOver(scene) {
    gameOn = false;
    gameSpeed = startGameSpeed - 3;
    keyState.up = false;
    keyState.xSpeed = 0;
    setHighScore();
    scene.remove(playerMesh);
    gameStarted = false;
    newGameDisplay.forEach(el => el.setAttribute("style", "display: default;"));
    if (isMobile) {
      document.querySelector(".desktop-instructions").setAttribute("style", "display: none;");
      document.querySelector(".mobile-instructions").setAttribute("style", "display: block;");
    }
  }

  function update(camera, scene, keyState, playerMesh) {
    const cubeSize = 10;
    updateCameraPos(camera, keyState, playerMesh);
    handleGameSpeed(camera);
    updateScreenColor(keyState);
    updateScore(camera);
    if ((lastAddedCubesPos - camera.position.z) >= 6 * 50) {
      addCubes(camera, cubeSize);
      lastAddedCubesPos = camera.position.z;
    }
    removeCubes(camera);
    if (doSomethingIfGameIsOver(playerMesh, cubeSize)) {
      handleGameOver(scene);
    }
  }

  function orientationUpdate(e) {
    if (lastOrient !== undefined && lastOrient !== window.orientation) {
      resizeScreen(fullScreen, true);
      isLandscape = Math.abs(window.orientation) === 90;
      lastOrient = window.orientation;
    } else if (lastOrient === undefined) {
      lastOrient = window.orientation;
    }

    let orient;
    if (isLandscape) {
      orient = e.beta;
    } else {
      orient = e.gamma;
    }
    if (orient > 30)
    orient = 30;
    if (orient < -30)
    orient = -30;
    orient = orient / 10;
    if (gameOn) {
      const landscapePrimary = (/.*primary.*/).test(screen.orientation.type);
      keyState.xSpeed = (isLandscape && !landscapePrimary ? -1 : 1) * orient;
    }
  }


  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
    }
    switch(e.key) {
      case 'ArrowLeft': {
        keyState.keydown = true && gameOn;
        keyState.left = true && gameOn;
        break;
      }
      case 'ArrowRight': {
        keyState.keydown = true && gameOn;
        keyState.right = true && gameOn;
        break;
      }
      case 'ArrowUp': {
        keyState.up = true && gameOn;
        break;
      }
      case 'r': {
        newGame();
        break;
      }
      case 'p': {
        paused = gameOn ? !paused : false;
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

  document.addEventListener('touchstart', (e) => {
    if (gameOn) {
      keyState.up = true;
    }
  });

  document.addEventListener('touchend', (e) => {
    keyState.up = false;
  });

  window.addEventListener("deviceorientation", (e) => isMobile && orientationUpdate(e), false);

  document.addEventListener("fullscreenchange", fullScreenUpdate, false);

  document.addEventListener("mozfullscreenchange", fullScreenUpdate, false);

  document.addEventListener("webkitfullscreenchange", fullScreenUpdate, false);

  document.addEventListener("msfullscreenchange", fullScreenUpdate, false);
});
