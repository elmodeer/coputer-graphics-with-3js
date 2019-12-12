function createBalls(scene, radius){
  const balls = [];
  const ballFiles = ['Ball8.jpg', 'Ball9.jpg', 'Ball10.jpg', 'Ball11.jpg', 'Ball12.jpg', 'Ball13.jpg', 'Ball14.jpg', 'Ball15.jpg'];
  // const ballFiles = ['Ball8.jpg', 'Ball9.jpg', 'Ball10.jpg'];

  const randomInitialPositionsList = randomPositions(radius);
  const filePath = "http://localhost:8000/balls/";

  ballFiles.forEach((fileName, index) => {
    const positionObj = randomInitialPositionsList[index];
    const ballGeo = new THREE.SphereGeometry(radius, 16, 16);
    const texture = new THREE.TextureLoader().load(filePath + fileName);
    // add textures
    const ballMat = new THREE.MeshPhongMaterial({map: texture});
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.castShadow = true;
    ball.name = fileName;
    ball.matrixAutoUpdate = false;
    ball.position.x = positionObj.x;
    ball.position.z = positionObj.z;
    ball.position.y = 1.1;
    scene.add(ball);
    balls.push(ball);
  });

  return balls;
}

// get random number between 3 and 1


function randomPositions(radius){
  const randomPositions = [];

  while(randomPositions.length < 8){
    // x range is form 1.2 to -1.2
    let numX = Math.random() * 1.3;
    const x_component = numX *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
    // y range is form 2.7 to -2.7
    let numZ = Math.random() * 2.8;
    const z_component = numZ *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
    randomPositions.push({x:x_component, z:z_component});
  }

  return randomPositions;
}
