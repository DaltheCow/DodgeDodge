document.addEventListener('DOMContentLoaded', () => {
    
  const addCube = (x, y, z, scene, size = 10) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
  }

  const canPlaceCube = (pos1, pos2, size = 10) => {
    return !(Math.abs(pos1.x - pos2.x) < size && Math.abs(pos1.z - pos2.z) < size)
  }

  const addCubes = (scene, camera, size = 10) => {
    const numCubes = Math.floor(Math.random() * 10) + 40
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
      newPoses.push(newPos)
    }
    return newPoses.map(pos => addCube(pos.x, 3, pos.z, scene, size));
  }

  const removeCubes = (cubeArray, scene) => {
    if (cubeArray.length > 500) {
      for (let i = 0; i < cubeArray.length - 400; i++) {
        scene.remove(cubeArray[i])
        // renderer.deallocateObject( cubeArray[i] );
        //geometry.des
        cubeArray[i] = undefined;
        // debugger
      }

      return cubeArray.slice(cubeArray.length - 400);
    }
    return cubeArray;
  }

  const reduceToLimit = (num, limit) => {
    if (Math.abs(num) > limit) {
      return num < 0 ? -limit : limit
    } else {
      return num
    }
  }

  const updateCameraPos = (camera, keyState, playerMesh) => {
    const turnSpd = .25
    if (keyState.keydown && !(keyState.left && keyState.right)) {
      if (keyState.right) {
        keyState.xAccel = turnSpd;
      } else {
        keyState.xAccel = -turnSpd;
      }

    } else {
      if (keyState.xSpeed !== 0) {
        if (Math.abs(keyState.xSpeed) < .1) {
          keyState.xSpeed = 0;
          keyState.xAccel = 0;
        } else if (Math.abs(keyState.xSpeed) < 1) {
          keyState.xAccel = keyState.xSpeed < 0 ? .01 : -.01;
        } else {
          keyState.xAccel = keyState.xSpeed < 0 ? .2 : -.2;
        }
      }
    }
    keyState.xSpeed = reduceToLimit(keyState.xSpeed + keyState.xAccel, keyState.maxXSpeed);
    camera.position.x += keyState.xSpeed;
    camera.rotation.z = -.2 * ( keyState.xSpeed / keyState.maxXSpeed )
    camera.position.z -= gameSpeed;
    playerMesh.position.x = camera.position.x;
    playerMesh.rotation.z = camera.rotation.z - 2.35;
    playerMesh.position.z = camera.position.z - 50;
    plane.position.z = camera.position.z -2000
    

  }

  const doSomethingIfGameIsOver = (cubeArray, camera, size) => {
    const gameOver = cubeArray.some(cube => (
      cube.position.x < camera.position.x && cube.position.x + size > camera.position.x &&
      cube.position.z < camera.position.z && cube.position.z + size > camera.position.z
    ));
    return gameOver
  }

  const update = (cubeArray, camera, scene, keyState, playerMesh) => {
    const cubeSize = 10;
    updateCameraPos(camera, keyState, playerMesh)

    if (-camera.position.z % (gameSpeed * 50) === 0) {
      cubeArray = cubeArray.concat(addCubes(scene, camera, cubeSize));
    }
    cubeArray = removeCubes(cubeArray, scene)
    if (doSomethingIfGameIsOver(cubeArray, camera, cubeSize)) {
      gameOn = false;
    }

    return cubeArray
  }

  let gameOn = true;
  const gameSpeed = 6;
  
  
    let cubeArray = []
    const renderer = new THREE.WebGLRenderer({canvas: document.getElementById("myCanvas"), antialias: true});
    renderer.setClearColor(0xCCCCCC);
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
    
    //var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true } ); //save transparent material for later
    
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
    playerMesh.rotation.x = -.4;
    playerMesh.rotation.z = -2.355;
    scene.add(playerMesh);

    camera.position.y = 15;
    camera.rotation.x = -.1;

    requestAnimationFrame(render);

    const keyState = { keydown: false, right: false, left: false, xAccel: 0, xSpeed: 0, maxXSpeed: 2.5 }


    function render() {
      if (gameOn) {
        cubeArray = update(cubeArray, camera, scene, keyState, playerMesh)
      }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }


    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
      }
      switch(e.key) {
        case 'ArrowLeft': {
          keyState.keydown = true;
          keyState.left = true
          break;
        }
        case 'ArrowRight': {
          keyState.keydown = true;
          keyState.right = true
          break;
        }
      }

    })

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
      }
      if (!keyState.right && !keyState.left) {
        keyState.keydown = false;
      }

    })
});