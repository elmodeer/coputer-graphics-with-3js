let singleMode = false;
let doubleMode = false;

(confirm('Welcome to silly game .. Do you want to play in DoubleMode?')) ?
  doubleMode = true : singleMode = true;


// initilaize WebGLRenderer
"use strict";
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas});
renderer.setClearColor('white');   // set background color

const scene = new THREE.Scene();
// scene.add(new THREE.AxesHelper());
const camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 1000 );
camera.position.set(0,0,5);
camera.lookAt(scene.position);   // camera looks at origin
const ambientLight = new THREE.AmbientLight("white");
scene.add(ambientLight);

// 1- playgorund
const playgorund = new THREE.Object3D();
const planeMat = new THREE.MeshBasicMaterial( {color: "green", side: THREE.DoubleSide} );
const planeGeo = new THREE.PlaneGeometry( 8, 16 );
const plane = new THREE.Mesh( planeGeo, planeMat );
// plane.position.set(0,8,0);

// 2- line in the middle
const lineMat = new THREE.LineBasicMaterial( { color: "white" } );
const lineGeo = new THREE.Geometry();
lineGeo.vertices.push(new THREE.Vector3(-4,0,0));
lineGeo.vertices.push(new THREE.Vector3(0,0,0));
lineGeo.vertices.push(new THREE.Vector3(4,0,0));
const line = new THREE.Line(lineGeo, lineMat);
playgorund.add(line);

// 3- add the cushions
// first cushion
var collidableMeshList = [];
const playGroundWidth = 3.8;
const playGroundHeight = 7.8;
// the distance between the ball radious and the cushion, which is basically the ball radious
const ballRadious = 0.3;
const cushionWidth = 0.2;
const cushion1Geo = new THREE.BoxGeometry( cushionWidth, 16, 1 );
const cushion1Mat = new THREE.MeshBasicMaterial( {color: "#006400"} );
const cushion1 = new THREE.Mesh( cushion1Geo, cushion1Mat );
cushion1.position.set(-3.9,0,0.5);
playgorund.add(cushion1);

// second cushion
const cushion2Geo = new THREE.BoxGeometry( cushionWidth, 16, 1 );
const cushion2Mat = new THREE.MeshBasicMaterial( {color: "#006400"} );
const cushion2 = new THREE.Mesh( cushion2Geo, cushion2Mat );
cushion2.position.set(3.9,0,0.5);
playgorund.add(cushion2);

// 4- cushion for singleMode
const cushionSMGeo = new THREE.BoxGeometry( cushionWidth, 7.8, 1 );
const cushionSMMat = new THREE.MeshBasicMaterial( {color: "#006400"} );
const cushionSM = new THREE.Mesh( cushionSMGeo, cushionSMMat );
cushionSM.rotation.z = -Math.PI/2;
cushionSM.position.set(0,7.9,0.5);


const cushionDMGeo = new THREE.BoxGeometry( cushionWidth, 7.8, 1 );
const cushionDMMat = new THREE.MeshBasicMaterial( {color: "#006400"} );
const cushionDM = new THREE.Mesh( cushionDMGeo, cushionDMMat );
cushionDM.rotation.z = -Math.PI/2;
cushionDM.position.set(0,-7.9,0.5);
// playgorund.add(cushionDM);

// 5- box for player 1
const playerHeight = 1.5;
const player1Geo = new THREE.BoxGeometry( cushionWidth, playerHeight, 1 );
const player1Mat = new THREE.MeshBasicMaterial( {color: "red"} );
const player1 = new THREE.Mesh( player1Geo, player1Mat );
player1.rotation.z = -Math.PI/2;
player1.position.set(0,-7.9,0.5);
playgorund.add(player1);

// 6- add player 2
const player2Geo = new THREE.BoxGeometry( cushionWidth, playerHeight, 1 );
const player2Mat = new THREE.MeshBasicMaterial( {color: "blue"} );
const player2 = new THREE.Mesh( player2Geo, player2Mat );
player2.rotation.z = -Math.PI/2;
player2.position.set(0,7.9,0.5);

// if double mode activate
(doubleMode) ? playgorund.add(player2): playgorund.add(cushionSM);

// add the ball
const ballGeo = new THREE.SphereGeometry(ballRadious, 16,16);
const ballMat = new THREE.MeshBasicMaterial({color: "yellow",
                                         wireframe:false} );
const ball = new THREE.Mesh(ballGeo, ballMat);
ball.position.z = ballRadious;
scene.add(ball);
let speed = 0.06;
// let speed = 1;



// functions
// movement part
const movePlayerOne = function(event) {
  event.preventDefault();
  const leftKeystroke = 37;
  const rightKeystroke = 39;
  const aKeyStroke = 65;
  const dKeyStroke = 68;
  const editedPlayGroundWitdth = playGroundWidth -1;

  (event.keyCode === rightKeystroke) ?
    (player1.position.x < editedPlayGroundWitdth)  ? player1.position.x += 0.5 : null : null;

  (event.keyCode === leftKeystroke) ?
    (player1.position.x > -editedPlayGroundWitdth) ? player1.position.x -= 0.5 : null : null;

  (event.keyCode === dKeyStroke) ?
    (player2.position.x < editedPlayGroundWitdth)  ? player2.position.x += 0.5 : null : null;

  (event.keyCode === aKeyStroke) ?
    (player2.position.x > -editedPlayGroundWitdth) ? player2.position.x -= 0.5 : null : null;

};

let direction = {x: 2, y: 2, z: 0};
const detectCollision  = function() {
  // console.log("player: " + player1.position);
  // console.log("ball: " + ball.position);
  let d = player1.position.distanceToSquared(ball.position);
  if((playGroundHeight - ball.position.y ) < ballRadious  ) {
      direction = reflect('y');
  } else if((playGroundHeight + ball.position.y ) < ballRadious  ) {
      reflectCorrespondingly();
        // if ((Math.abs(ball.position.x) - (Math.abs(player1.position.x)+ 0.3) ) < collisonThreshold )
        //     direction = reflect('y');
  } else if((playGroundWidth - Math.abs(ball.position.x)) < ballRadious) {
      direction = reflect('x');
  }
}

// the goal is to detect the position of the player1 to the right or the left of the ball
collidableMeshList.push(player1);
collidableMeshList.push(ball);
const reflectCorrespondingly = function() {
    // to the left of the ball
    for (var vertexIndex = 0; vertexIndex < ball.geometry.vertices.length; vertexIndex++)
    {
        var localVertex = ball.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(ball.matrix);
        var directionVector = globalVertex.sub( ball.position );

        var ray = new THREE.Raycaster( player1.position, directionVector.clone().normalize() );
        var collisionResults = ray.intersectObjects( collidableMeshList );
        if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
        {
          console.log("hit");
          reflect('y');
          break;
        }
    }
    // const ball_x = ball.position.x;
    // const player1_x = player1.position.x;
    // if ( ball_x > player1_x ) {
    //   if (Math.abs((ball_x - ballRadious) - (player1_x + playerHeight/2)) < 0.3 )
    //     reflect('y');
    // }
    // // to the right of the ball
    // else {
    //   if (Math.abs((ball_x + ballRadious) - (player1_x - playerHeight/2)) < 0.3 )
    //     reflect('y');
    // }
}

const moveBall = function(h) {
    ball.position.x += speed * direction.x;
    ball.position.y += speed * direction.y;
}

// const reflect = function(vin, n) {
//   const n2 = n.clone();
//   n2.normalize();
//   let ret = vin.clone();
//   const f = 2 * n2.dot(vin);
//   ret.sub(n2.multiplyScalar(f));
//   return ret;
// }

const reflect = function(side) {
  (side === 'x') ? direction.x = -1 * direction.x :
                   direction.y = -1 * direction.y;
  return direction;

}


playgorund.add(plane);
scene.add(playgorund);
document.addEventListener('keydown', movePlayerOne);
const controls = new THREE.TrackballControls( camera, canvas );
const clock = new THREE.Clock();
function render() {
  requestAnimationFrame(render);
  const h = clock.getDelta();
  detectCollision();
  moveBall(h);
  controls.update();
  renderer.render(scene, camera);
}
render();
