"use strict";
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 1000 );
camera.position.set(0,8, 1);
// camera.lookAt(scene.position);   // camera looks at origin


const ambientLight = new THREE.AmbientLight("white");
scene.add(ambientLight);

// add clock body
const clockRadius = 5;
const clockDepth = 1;
const elementPlacement = 0.51;

const clock = new THREE.Object3D();
const clockBodyGeometry = new THREE.CylinderGeometry(clockRadius, clockRadius, clockDepth, 64);
const clockBodyMaterial = new THREE.MeshBasicMaterial({color: 'white'});
const clockBody = new THREE.Mesh(clockBodyGeometry, clockBodyMaterial);
clock.rotation.y = Math.PI;
clock.add(clockBody);
// scene.add(clockBody);

var points = [];
for ( let i = 0; i < 20; i ++ ) {
  points.push( new THREE.Vector2( Math.sin( i * 0.16 ) + 4.8, ( i - 10 ) * 0.05) );
}
const geometry = new THREE.LatheGeometry(points);
const material = new THREE.MeshBasicMaterial({color: 'lightblue'});
const lathe = new THREE.Mesh(geometry, material);
clock.add(lathe);

// scene.add(lathe);

// seconds
const secondsHandGeo = new THREE.PlaneGeometry(0.03, 6, 10);
const secondsHandMat = new THREE.MeshBasicMaterial({color: 0x000fff,  side: THREE.DoubleSide});
const secondsHand = new THREE.Mesh(secondsHandGeo, secondsHandMat);

secondsHand.position.y = elementPlacement;
secondsHand.position.x = 0;
secondsHand.position.z = 0;

secondsHand.rotation.x = Math.PI / 2;

const secondsHand2 = secondsHand.clone();
secondsHand2.position.y = -1 * elementPlacement;

clock.add(secondsHand);
clock.add(secondsHand2);

// scene.add(secondsHand);
// scene.add(secondsHand2);

const Hand = {
  construct: function(width, height, depth) {
    const handGeo = new THREE.SphereGeometry(width, height, depth);
    const handMat = new THREE.MeshBasicMaterial({color: 'blue',  side: THREE.DoubleSide});
    const hand = new THREE.Mesh(handGeo, handMat);
    hand.scale.x = 0.03;
    hand.scale.z = 0.01;
    hand.rotation.x = Math.PI / 2;
    return hand;
  }
};

const Blob = {
  construct: function(width, height, depth) {
    const blobGeo = new THREE.SphereGeometry(width, height, depth);
    const blobMat = new THREE.MeshBasicMaterial({color: 'red'});
    const blob = new THREE.Mesh(blobGeo, blobMat);
    return blob;
  }
};

//hour
const hoursHand = Hand.construct(1.5, 32, 32)
hoursHand.position.y = elementPlacement;
hoursHand.position.z =  -1;


//minute
const minutesHand = Hand.construct(2, 32, 32)
minutesHand.position.y = elementPlacement;
minutesHand.position.z = 2;

// minutesHand.rotation.x = Math.PI / 2;

const hoursHand2 = hoursHand.clone();
hoursHand2.position.y = -1 * elementPlacement;

const minutesHand2 = minutesHand.clone();
minutesHand2.position.y = -1 * elementPlacement;

const frontBlob = Blob.construct(0.15, 16, 16);
frontBlob.position.y = elementPlacement;
const backBlob = frontBlob.clone();
backBlob.position.y = - 1 * elementPlacement;


clock.add(hoursHand);
clock.add(hoursHand2);
clock.add(minutesHand);
clock.add(minutesHand2);

clock.add(frontBlob);
clock.add(backBlob);

// scene.add(hoursHand);
// scene.add(hoursHand2);
// scene.add(minutesHand);
// scene.add(minutesHand2);
//
// scene.add(frontBlob);
// scene.add(backBlob);

drawTicks();
// setInitialPosition();

// function setInitialPosition() {
//   const now = new Date();
//   const hrs = now.getHours();
//   const min = now.getMinutes();
//   const sec = now.getSeconds();
//   // console.log(sec);
//
//   const handHourR = (30 * (hrs > 12 ? hrs - 12 : hrs) * Math.PI) / 180;
//   const relativeHourR = ((30 * min / 60) * Math.PI) / 180;
//   const handMinuteR = (6 * min * Math.PI) / 180;
//   const handSecondR = (6 * sec * Math.PI) / 180;
//   moveHand(secondsHand, handSecondR);
//   moveHand(minutesHand, handMinuteR);
//   moveHand(hoursHand, (handHourR + relativeHourR));
//
// };
function moveHand(secondsHand, handSecondR) {
  secondsHand.rotation.z = handSecondR;
  secondsHand.position.z = Math.cos(-handSecondR);
  secondsHand.position.x = Math.sin(-handSecondR);
};
function drawTicks() {
  const width = 0.05;
  const widthTens = 0.11;
  const heightTens = 0.7;
  let height = 0.5;
  for (let i=0; i<60; i++) {
    let rotationAngle =  2 * i * Math.PI / 60;
    if(i == 30 || i == 0 || i == 15 || i == 45 || (i%5 == 0)){
      drawTick(rotationAngle, 'black', heightTens, widthTens);
    } else {
      drawTick(rotationAngle, 'red', height, width);
    }
  }
};

function drawTick(rotationAngle, color, height, width) {
  const tickGeometry = new THREE.PlaneGeometry( width , height, 32 );
  const tickMaterial = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide} );
  const tickPlaneFront = new THREE.Mesh( tickGeometry, tickMaterial );
  const elementPlacement = 0.51;
  tickPlaneFront.position.y = elementPlacement;
  tickPlaneFront.position.z = (clockRadius - (height/ 2)) * Math.cos(rotationAngle);
  tickPlaneFront.position.x = (clockRadius - (height/ 2)) * Math.sin(rotationAngle);
  // rotate the tick
  tickPlaneFront.rotation.x = Math.PI / 2;
  // rotate left and right
  tickPlaneFront.rotation.z = -rotationAngle;

  const tickPlaneBack = tickPlaneFront.clone();
  tickPlaneBack.position.y = - 1 * elementPlacement;
  clock.add(tickPlaneFront);
  clock.add(tickPlaneBack);
};

const controls = new THREE.TrackballControls( camera, canvas );
scene.add(clock);
function render() {
  requestAnimationFrame(render);
  var date = new Date();
  var hrs = date.getHours();
	var min = date.getMinutes();
	var sec = date.getSeconds();
  // console.log(sec);
	var handHourR = (30 * (hrs > 12 ? hrs - 12 : hrs) * Math.PI) / 180;
  const relativeHourR = ((30 * min / 60) * Math.PI) / 180;

	var handMinuteR = (6 * min * Math.PI) / 180;
	var handSecondR = (6 * sec * Math.PI) / 180;

	// hoursHand.rotation.z = -handHourR;
	// minutesHand.rotation.z = -handMinuteR;
  // why
	moveHand(secondsHand, handSecondR);
  // moveHand(secondsHand2, - handSecondR);
  moveHand(minutesHand, handMinuteR);
  moveHand(hoursHand, handHourR + relativeHourR);

  // secondsHand.position.z = -handSecondR;

  // secondsHand.rotation.z = (Date.now()/60000)%60 * 6;
  // secondsHand.position.z = 2 * Math.cos(-(Date.now()/60000)%60 * 6);
  // secondsHand.position.x = 2 * Math.sin(-(Date.now()/60000)%60 * 6);

  controls.update();
  renderer.render(scene, camera);
}
render();
