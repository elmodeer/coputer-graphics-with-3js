let singleMode = false;
let doubleMode = false;
let gameOver = false;


// initilaize WebGLRenderer
"use strict";
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas});
renderer.setClearColor('white');   // set background color

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 1000 );
camera.position.set(0,0,15);
camera.lookAt(scene.position);   // camera looks at origin
const ambientLight = new THREE.AmbientLight("white");
scene.add(ambientLight);

// useful variables and constants
const playGroundWidth = 8;
const playGroundHeight = 16;
const playGroundDepth = 1;
const ballRadious = 0.3;
const cushionWidth = 0.2;
const playerHeight = 1.5;
const cushionDepth = 0.5;
const widthAlignment = playGroundWidth/2 - cushionWidth/2;
const heightAlignment = playGroundHeight/2 - cushionWidth/2;

// 1- playgorund
const playgorund = new THREE.Object3D();
const planeMat = new THREE.MeshBasicMaterial( {color: "green", side: THREE.DoubleSide} );
const planeGeo = new THREE.PlaneGeometry( playGroundWidth, playGroundHeight);
const plane = new THREE.Mesh( planeGeo, planeMat );
playgorund.add(plane);

// 2- line in the middle
const lineMat = new THREE.LineBasicMaterial( { color: "white" } );
const lineGeo = new THREE.Geometry();
lineGeo.vertices.push(new THREE.Vector3(-playGroundWidth/2,0,0));
lineGeo.vertices.push(new THREE.Vector3(0,0,0));
lineGeo.vertices.push(new THREE.Vector3(playGroundWidth/2,0,0));
const line = new THREE.Line(lineGeo, lineMat);
playgorund.add(line);

let Side = {
    UP: 1,
    DOWN: -1,
    LEFT: -1,
    RIGHT: 1
};
const Cushion = {
    construct: function(width, height, depth) {
      const cushionGeo = new THREE.BoxGeometry( width , height, depth);
      const cushionMat = new THREE.MeshBasicMaterial( {color: "#006400"} );
      const cushion = new THREE.Mesh( cushionGeo, cushionMat );
      return cushion;
    }
}

const Player = {
    construct: function(color, side) {
      const player1Geo = new THREE.BoxGeometry( cushionWidth, playerHeight, 1 );
      const player1Mat = new THREE.MeshBasicMaterial( {color: color} );
      const player = new THREE.Mesh( player1Geo, player1Mat );
      player.rotation.z = -Math.PI/2;
      player.position.set(0, side * (playGroundHeight/2 - cushionWidth/2), cushionDepth);
      return player;
    }
}

// add the ball
const Ball = {
    construct : function(r) {
      const ballGeo = new THREE.SphereGeometry(r, 16,16);
      const ballMat = new THREE.MeshBasicMaterial({color: "yellow",
                                                   wireframe:false} );
      const ballObj = new THREE.Mesh(ballGeo, ballMat);
      ballObj.position.z = ballRadious;
      return ballObj;
    },
    move: function() {
      ball.position.x += speed * direction.x;
      ball.position.y += speed * direction.y;
    }
}
const ball = Ball.construct(ballRadious);
const player1 = Player.construct("red", Side.DOWN);
const player2 = Player.construct("blue",Side.UP);
const cushion1 = Cushion.construct(cushionWidth, playGroundHeight, playGroundDepth);
const cushion2 = Cushion.construct(cushionWidth, playGroundHeight, playGroundDepth);
const cushionSM = Cushion.construct( cushionWidth, playGroundWidth - cushionWidth, playGroundDepth);
const cushionDM = Cushion.construct( cushionWidth, playGroundWidth - cushionWidth, playGroundDepth);

cushion1.position.set(Side.LEFT * widthAlignment, 0, cushionDepth);
cushion2.position.set(Side.RIGHT * widthAlignment, 0, cushionDepth);
cushionSM.position.set(0, Side.UP * heightAlignment, cushionDepth);
cushionSM.rotation.z = -Math.PI/2;
// cushionDM.position.set(0,Side.LEFT * heightAlignment, cushionDepth);
// cushionDM.rotation.z = -Math.PI/2;

// playgorund components
playgorund.add(cushion1);
playgorund.add(cushion2);
playgorund.add(cushionSM);
playgorund.add(player1)
// scene components
scene.add(playgorund);
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
  const movementStep = 0.5;
  (event.keyCode === rightKeystroke) ?
    (player1.position.x < editedPlayGroundWitdth)  ?
     player1.position.x += movementStep : null : null;

  (event.keyCode === leftKeystroke) ?
    (player1.position.x > -editedPlayGroundWitdth) ?
     player1.position.x -= movementStep : null : null;

  (event.keyCode === dKeyStroke) ?
    (player2.position.x < editedPlayGroundWitdth)  ?
     player2.position.x += movementStep : null : null;

  (event.keyCode === aKeyStroke) ?
    (player2.position.x > -editedPlayGroundWitdth) ?
     player2.position.x -= movementStep : null : null;

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

const refelctPlayer = function(player) {
  const hittingThreshold = playerHeight/2 + ballRadious;
  if(Math.abs(ball.position.x - player.position.x) < hittingThreshold ) {
    reflect('y');
  } else {
    gameOver = true;
    let textDiv = document.getElementById("winingDiv");
    textDiv.textContent = "GameOver !!! ";
    if(doubleMode) {
      if (ball.position.y > 0) {
        textDiv.textContent += "player One wins";
        textDiv.style.color = 'red';
      } else {
        textDiv.textContent += "player Two wins";
        textDiv.style.color = 'blue';
      }
    }
  }
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

document.addEventListener('keydown', movePlayerOne);
const controls = new THREE.TrackballControls( camera, canvas );
const clock = new THREE.Clock();
function render() {
  requestAnimationFrame(render);
  detectCollision();
  if (!gameOver)
    Ball.move();
  controls.update();
  renderer.render(scene, camera);
}
render();
