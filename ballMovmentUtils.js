
/*
 * generates a random list of speed vectors in (x,y).
 * @param {*} balls list of balls for which the random speeds will be created.
 */
function randomSpeeds(balls) {
  const randomSpeeds = {};
  balls.forEach(ball => {
    randomSpeeds[ball.name] = new THREE.Vector3(2*Math.random() - 1, 0, 2*Math.random() - 1);
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

function move(spheres, dt, t, speeds, radius, tableEdges){
  checkCusionReflection(spheres, speeds)

// let them roll
  spheres.forEach((ball) => {
    updateSpeed(ball, spheres, radius, speeds, dt);

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


function updateSpeed(currentBall, balls, radius, speeds, dt){
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
