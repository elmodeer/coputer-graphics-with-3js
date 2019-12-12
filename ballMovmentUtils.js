
/*
 * generates a random list of speed vectors in (x,y).
 * @param {*} balls list of balls for which the random speeds will be created.
 */
radius = 0.1
function randomSpeeds(balls) {
  const randomSpeeds = {};
  balls.forEach(ball => {
    randomSpeeds[ball.name] = new THREE.Vector3(2*Math.random() - 1, 0, 2*Math.random() - 1);
  });
  return randomSpeeds;
}


function checkCusionReflection(balls, speeds, tableLength, tableWidth) {
  balls.forEach( b => {
    const tolerance = 0.3;
    if(b.position.x > (tableWidth/2 - tolerance))
      speeds[b.name].x = - Math.abs(speeds[b.name].x);
    if(b.position.x < -(tableWidth/2 - tolerance))
      speeds[b.name].x = Math.abs(speeds[b.name].x);

    if(b.position.z > (tableLength/2 - tolerance))
      speeds[b.name].z = - Math.abs(speeds[b.name].z);
    if(b.position.z < -(tableLength/2 - tolerance))
      speeds[b.name].z = Math.abs(speeds[b.name].z);

    // speeds[b.name].multiplyScalar(0.2);

  });
}

function move(spheres, dt, speeds, tableLength, tableWidth){
  checkCusionReflection(spheres, speeds, tableLength, tableWidth)

// let them roll
  spheres.forEach((ball) => {
    updateSpeed(ball, spheres, speeds, dt);

    let ax = new THREE.Vector3(0,1,0).cross(speeds[ball.name]).normalize();
    const speed = speeds[ball.name];
    const omega = speed.length() / radius;
    // dR: incremental rotation matrix that performs the rotation of the current time step.
    const dR = new THREE.Matrix4();
    dR.makeRotationAxis(ax, omega*dt);
     // multiply with dR form the left (matrix.multiply multiplies from the right!)
    ball.matrix.premultiply(dR);
     // set translational part of matrix to current position:
    const currentPosition = ball.position;
    currentPosition.add(speed.clone().multiplyScalar(dt));
    ball.matrix.setPosition(currentPosition);
  });
}


function updateSpeed(currentBall, balls, speeds, dt){
  const dist = currentBall.position.clone();
  const distancesSqDict = {};
  // remove the current ball as not to compare it with itself
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
