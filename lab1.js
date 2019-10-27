let singleMode = false;
let doubleMode = false;
let gameOver = false;
// (confirm('Welcome to silly game .. Do you want to play in DoubleMode?')) ?
//   doubleMode = true : singleMode = true;

// initilaize WebGLRenderer
"use strict";
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas});
renderer.setClearColor('white');   // set background color

const scene = new THREE.Scene();
// scene.add(new THREE.AxesHelper());
const camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 1000 );
camera.position.set(0,0,15);
camera.lookAt(scene.position);   // camera looks at origin
const ambientLight = new THREE.AmbientLight("white");
scene.add(ambientLight);

// useful variables and constants
var collidableMeshListP1 = [];
var collidableMeshListP2 = [];

const playGroundWidth = 8;
const playGroundHeight = 16;
// the distance between the ball radious and the cushion, which is basically the ball radious
const ballRadious = 0.3;
const cushionWidth = 0.2;


// 1- playgorund
const playgorund = new THREE.Object3D();
const planeMat = new THREE.MeshBasicMaterial( {color: "green", side: THREE.DoubleSide} );
const planeGeo = new THREE.PlaneGeometry( playGroundWidth, playGroundHeight);
const plane = new THREE.Mesh( planeGeo, planeMat );
// plane.position.set(0,8,0);

// 2- line in the middle
const lineMat = new THREE.LineBasicMaterial( { color: "white" } );
const lineGeo = new THREE.Geometry();
lineGeo.vertices.push(new THREE.Vector3(-playGroundWidth/2,0,0));
lineGeo.vertices.push(new THREE.Vector3(0,0,0));
lineGeo.vertices.push(new THREE.Vector3(playGroundWidth/2,0,0));
const line = new THREE.Line(lineGeo, lineMat);
playgorund.add(line);

// 3- add the cushions
// first cushion
const cushion1Geo = new THREE.BoxGeometry( cushionWidth , playGroundHeight, 1 );
const cushion1Mat = new THREE.MeshBasicMaterial( {color: "#006400"} );
const cushion1 = new THREE.Mesh( cushion1Geo, cushion1Mat );
cushion1.position.set(-(playGroundWidth/2 - cushionWidth/2), 0, 0.5);
playgorund.add(cushion1);

// second cushion
const cushion2Geo = new THREE.BoxGeometry( cushionWidth, playGroundHeight, 1 );
const cushion2Mat = new THREE.MeshBasicMaterial( {color: "#006400"} );
const cushion2 = new THREE.Mesh( cushion2Geo, cushion2Mat );
cushion2.position.set(playGroundWidth/2 - cushionWidth/2, 0, 0.5);
playgorund.add(cushion2);

// 4- cushion for singleMode
const cushionSMGeo = new THREE.BoxGeometry( cushionWidth, playGroundWidth - cushionWidth, 1 );
const cushionSMMat = new THREE.MeshBasicMaterial( {color: "#006400"} );
const cushionSM = new THREE.Mesh( cushionSMGeo, cushionSMMat );
cushionSM.rotation.z = -Math.PI/2;
cushionSM.position.set(0, playGroundHeight/2 - cushionWidth/2, 0.5);
playgorund.add(cushionSM);


const cushionDMGeo = new THREE.BoxGeometry( cushionWidth, playGroundWidth - cushionWidth, 1 );
const cushionDMMat = new THREE.MeshBasicMaterial( {color: "#006400"} );
const cushionDM = new THREE.Mesh( cushionDMGeo, cushionDMMat );
cushionDM.rotation.z = -Math.PI/2;
cushionDM.position.set(0,-(playGroundHeight/2 - cushionWidth/2),0.5);
// playgorund.add(cushionDM);

// 5- box for player 1
const playerHeight = 1.5;
const player1Geo = new THREE.BoxGeometry( cushionWidth, playerHeight, 1 );
const player1Mat = new THREE.MeshBasicMaterial( {color: "red"} );
const player1 = new THREE.Mesh( player1Geo, player1Mat );
player1.rotation.z = -Math.PI/2;
player1.position.set(0,-(playGroundHeight/2 - cushionWidth/2),0.5);
playgorund.add(player1);

// 6- add player 2
const player2Geo = new THREE.BoxGeometry( cushionWidth, playerHeight, 1 );
const player2Mat = new THREE.MeshBasicMaterial( {color: "blue"} );
const player2 = new THREE.Mesh( player2Geo, player2Mat );
player2.rotation.z = -Math.PI/2;
player2.position.set(0,(playGroundHeight/2 - cushionWidth/2),0.5);

// if double mode activate

// add the ball
const ballGeo = new THREE.SphereGeometry(ballRadious, 16,16);
const ballMat = new THREE.MeshBasicMaterial({color: "yellow",
                                         wireframe:false} );
const ball = new THREE.Mesh(ballGeo, ballMat);
ball.position.z = ballRadious;
scene.add(ball);
let speed = 0.06;



// functions
// movement part
const movePlayerOne = function(event) {
  event.preventDefault();
  const leftKeystroke = 37;
  const rightKeystroke = 39;
  const aKeyStroke = 65;
  const dKeyStroke = 68;
  const editedPlayGroundWitdth = playGroundWidth/2 -1;

  (event.keyCode === rightKeystroke) ?
    (player1.position.x < editedPlayGroundWitdth)  ? player1.position.x += 0.5 : null : null;

  (event.keyCode === leftKeystroke) ?
    (player1.position.x > -editedPlayGroundWitdth) ? player1.position.x -= 0.5 : null : null;

  (event.keyCode === dKeyStroke) ?
    (player2.position.x < editedPlayGroundWitdth)  ? player2.position.x += 0.5 : null : null;

  (event.keyCode === aKeyStroke) ?
    (player2.position.x > -editedPlayGroundWitdth) ? player2.position.x -= 0.5 : null : null;

};



let num = Math.floor(Math.random() * 3) + 1;
const x_component = num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
const y_component = num *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
let direction = {x: x_component, y: y_component, z: 0};
const detectCollision  = function() {
  if ((playGroundHeight/2 - ball.position.y ) < ballRadious) {
      (doubleMode) ?  refelctPlayer(player2) : reflect('y');
  } else if((playGroundHeight/2 + ball.position.y ) < ballRadious  ) {
      refelctPlayer(player1)
  } else if((playGroundWidth/2 - Math.abs(ball.position.x)) < ballRadious) {
      direction = reflect('x');
  }
}


collidableMeshListP2.push(player2);
collidableMeshListP2.push(ball)
collidableMeshListP1.push(player1);
collidableMeshListP1.push(ball);


const refelctPlayer = function(player) {
  const hittingThreshold = playerHeight/2 + ballRadious;
  if(Math.abs(ball.position.x - player.position.x) < hittingThreshold ) {
    reflect('y');
  }
}

const moveBall = function() {
    ball.position.x += speed * direction.x;
    ball.position.y += speed * direction.y;
}

const reflect = function(side) {
  (side === 'x') ? direction.x = -1 * direction.x :
                   direction.y = -1 * direction.y;
  return direction;

}
const reload = function(){
  location.reload();
}
const singleModeActiviate = function() {
    singleMode = true;
    doubleMode = false;
    playgorund.add(cushionSM);
    playgorund.remove(player2);
}

const doubleModeActiviate = function() {
    doubleMode = true;
    singleMode = false;
    playgorund.add(player2);
    playgorund.remove(cushionSM);
}

playgorund.add(plane);
scene.add(playgorund);
document.addEventListener('keydown', movePlayerOne);
const controls = new THREE.TrackballControls( camera, canvas );
const clock = new THREE.Clock();
function render() {
  requestAnimationFrame(render);
  detectCollision();
  moveBall();
  controls.update();
  renderer.render(scene, camera);
}
render();
