let singleMode = false;
let doubleMode = false;
let gameOver = false;


// initilaize WebGLRenderer
"use strict";
const firstcanvas = document.getElementById("firstcanvas");
const secondCanvas = document.getElementById("secondCanvas");
secondCanvas.style.display = "none";
const firstRenderer = new THREE.WebGLRenderer({canvas:firstcanvas});
const secondRenderer = new THREE.WebGLRenderer({canvas:secondCanvas});

firstRenderer.setClearColor('white');   // set background color
secondRenderer.setClearColor('white');   // set background color

const scene = new THREE.Scene();
const firstCamera = new THREE.PerspectiveCamera( 75, firstcanvas.width / firstcanvas.height, 0.1, 1000 );
const secondCamera = new THREE.PerspectiveCamera( 75, secondCanvas.width / secondCanvas.height, 0.1, 1000 );

firstCamera.position.set(0,-12,10);
secondCamera.position.set(0,12,10);
secondCamera.up = new THREE.Vector3(0, 0, 1);

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
// line width doen not work in chrome !!!
const lineMat = new THREE.LineBasicMaterial( { color: "white", linewidth: 5} );
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

const editedPlayGroundWitdth = playGroundWidth/2 -1;
const Player = {
    construct: function(color, side) {
      const player1Geo = new THREE.BoxGeometry( cushionWidth, playerHeight, 1 );
      const player1Mat = new THREE.MeshBasicMaterial( {color: color} );
      const player = new THREE.Mesh( player1Geo, player1Mat );
      player.rotation.z = -Math.PI/2;
      player.position.set(0, side * (playGroundHeight/2 - cushionWidth/2), cushionDepth);
      return player;
    },
    speed:0.5,
    movementStep: 0.5,
    move: function() {
      const leftKeystroke = 37;
      const rightKeystroke = 39;
      const aKeyStroke = 65;
      const dKeyStroke = 68;
      if (!gameOver) {
        if (keyPressed=== rightKeystroke)
          if (player1.position.x < editedPlayGroundWitdth)
            player1.position.x += Player.speed * Player.movementStep;

        if (keyPressed=== leftKeystroke)
          if (player1.position.x > -editedPlayGroundWitdth)
            player1.position.x -= Player.speed * Player.movementStep;

        if (keyPressed=== aKeyStroke)
          if (player2.position.x < editedPlayGroundWitdth)
            player2.position.x += Player.speed * Player.movementStep;

        if (keyPressed === dKeyStroke)
          if (player2.position.x > -editedPlayGroundWitdth)
            player2.position.x -= Player.speed * Player.movementStep;
      }
    }
}

// add the ball

const Ball = {
    speed: 0.06,
    construct : function(r) {
      const ballGeo = new THREE.SphereGeometry(r, 16,16);
      const ballMat = new THREE.MeshBasicMaterial({color: "yellow",
                                                   wireframe:false} );
      const ballObj = new THREE.Mesh(ballGeo, ballMat);
      ballObj.position.z = ballRadious;
      return ballObj;
    },
    move: function() {
      ball.position.x += Ball.speed * direction.x;
      ball.position.y += Ball.speed * direction.y;
    }
}
const ball = Ball.construct(ballRadious);
const player1 = Player.construct("red", Side.DOWN);
const player2 = Player.construct("blue",Side.UP);
const cushion1 = Cushion.construct(cushionWidth, playGroundHeight, playGroundDepth);
const cushion2 = Cushion.construct(cushionWidth, playGroundHeight, playGroundDepth);
const cushionSM = Cushion.construct( cushionWidth, playGroundWidth - cushionWidth, playGroundDepth);

cushion1.position.set(Side.LEFT * widthAlignment, 0, cushionDepth);
cushion2.position.set(Side.RIGHT * widthAlignment, 0, cushionDepth);
cushionSM.position.set(0, Side.UP * heightAlignment, cushionDepth);
cushionSM.rotation.z = -Math.PI/2;


// playgorund components
playgorund.add(cushion1);
playgorund.add(cushion2);
playgorund.add(cushionSM);
playgorund.add(player1)
// scene components
scene.add(playgorund);
scene.add(ball);



// functions
// movement part
let keyPressed = 0;
const movePlayer = function(event) {
  Player.speed = 0.5;
  keyPressed = event.keyCode;
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
  if (!gameOver) {
    singleMode = true;
    doubleMode = false;
    secondCanvas.style.display = "none";
    playgorund.add(cushionSM);
    playgorund.remove(player2);
  }
}

const doubleModeActiviate = function() {
  if (!gameOver) {
    doubleMode = true;
    singleMode = false;
    secondCanvas.style.display = "block";
    playgorund.add(player2);
    playgorund.remove(cushionSM);
  }
}

document.addEventListener('keydown', movePlayer);
document.addEventListener("keyup", (event) => {
    Player.speed = 0;
});
const fcontrols = new THREE.TrackballControls( firstCamera, firstcanvas );
const scontrols = new THREE.TrackballControls( secondCamera, secondCanvas );

function render() {
  requestAnimationFrame(render);
  detectCollision();
  Player.move(keyPressed);
  if (!gameOver)
     Ball.move();
  fcontrols.update();
  scontrols.update();
  firstRenderer.render(scene, firstCamera);
  secondRenderer.render(scene, secondCamera);

}
render();
