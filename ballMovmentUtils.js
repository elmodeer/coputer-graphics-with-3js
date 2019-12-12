
/*
 * generates a random list of speed vectors in (x,y).
 * @param {*} balls list of balls for which the random speeds will be created.
 */
function randomSpeeds(balls) {
  let randomSpeeds = {};
  balls.forEach(ball => {
    randomSpeeds[ball.name] = new THREE.Vector3(2*Math.random() - 1, 0, 2 * Math.random() - 1);
  });
  return randomSpeeds;
}


function checkCusionReflection(balls, speeds) {
  balls.forEach( b => {
    if(b.position.x > 1.2)
      speeds[b.name].x = - Math.abs(speeds[b.name].x);
    if(b.position.x < -1.2)
      speeds[b.name].x = Math.abs(speeds[b.name].x);

    if(b.position.z > 2.7)
      speeds[b.name].z = - Math.abs(speeds[b.name].z);
    if(b.position.z < -2.7)
      speeds[b.name].z = Math.abs(speeds[b.name].z);


  });
}

function move(spheres, deltaTime, t, speeds, radius, tableEdges){

// let them roll
  spheres.forEach((ball) => {
    getBallSpeed(ball, spheres, radius, speeds, deltaTime);
    checkCusionReflection(spheres, speeds)

    const speed = speeds[ball.name];
    const omega = speed.length() / radius;
    let rotationAxis = speed.clone().cross(new THREE.Vector3(0,1,0));
    rotationAxis.multiplyScalar(-1);
    rotationAxis.normalize();
    ball.matrix.makeRotationAxis( rotationAxis, omega*t);
    const currentPosition = ball.position;
    currentPosition.add(speed.clone().multiplyScalar(deltaTime));
    ball.matrix.setPosition(currentPosition);
  });
}


function getBallSpeed(currentBall, balls, radius, speeds, dt){
  const dist = currentBall.position.clone();
  const distancesSqDict = {};
  // remove the current ball as not to compare with itself
  ballsCopy = [...balls];
  ballsCopy.splice(balls.indexOf(currentBall), 1);
  ballsCopy.forEach( ball => {
    let distSq = currentBall.position.clone().sub(ball.position).lengthSq();
    distancesSqDict[ball.name] = distSq;
  });

  for (const [key, value] of Object.entries(distancesSqDict)) {
    let otherBallIndex;
    let u1 = speeds[currentBall.name];
    let u2 = speeds[key];
    let diffU = u1.clone().sub(u2);
    balls.forEach(b => {
      if(b.name == key)
        otherBallIndex = balls.indexOf(b);
    })
    let otherBall = balls[otherBallIndex];

    if(value < 4*radius*radius) {
      const d = currentBall.position.clone().sub(otherBall.position);
      const factor = d.dot(diffU) / d.lengthSq();
      speeds[currentBall.name].sub(d.clone().multiplyScalar(factor));
      speeds[key].add(d.clone().multiplyScalar(factor));
    }
  }
}

// function updateBallPostions(balls, speeds, dt) {
//     balls.forEach(b => {
//       b.position.add(speeds[b.name].clone().multiplyScalar(dt));
//     });
// }
