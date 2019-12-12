"use strict";
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({canvas:canvas});
// enable shadow
renderer.setClearColor('white');    // set background color
renderer.shadowMap.enabled = true;


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 1000 );
// edit values
camera.position.set(-2.5,4, -3);
camera.lookAt(scene.position);   // camera looks at origin

const ambientLight = new THREE.AmbientLight("white");
scene.add(ambientLight);
const controls = new THREE.TrackballControls( camera, canvas );


// add spotLight
const spotLight = new THREE.SpotLight(0xffff00);
spotLight.position.set(0,5,0);
spotLight.castShadow = true;
spotLight.shadow.camera.near = 2;
spotLight.shadow.camera.far = 10;
scene.add(spotLight);


// blub
const bulbGeo = new THREE.SphereGeometry(0.2, 32, 32);
const bulbMat = new THREE.MeshBasicMaterial({color:'yellow'})
const bulb = new THREE.Mesh(bulbGeo, bulbMat);
bulb.castShadow = true;
bulb.position.set(0,5,0);
scene.add(bulb);

//blub Cover
const bulbCoverGeo = new THREE.CylinderGeometry( 0.2, 1, 1, 32, 32, true);
const bulbCoverMat = new THREE.MeshPhongMaterial( {color: "black", side:THREE.DoubleSide} );
const bulbCover = new THREE.Mesh( bulbCoverGeo, bulbCoverMat);
bulbCover.castShadow = true;
bulbCover.receiveShadow = true;
bulbCover.position.y = 5;
scene.add(bulbCover);

// bulb wire
const wireMat = new THREE.LineBasicMaterial( { color: "black" } );
const wireGeo = new THREE.Geometry();
wireGeo.vertices.push(new THREE.Vector3( 0, 8, 0) );
wireGeo.vertices.push(new THREE.Vector3( 0, 5, 0) );
const line = new THREE.Line( wireGeo, wireMat);
scene.add(line);

// Add the ground
const groundMat = new THREE.MeshPhongMaterial({color: 'grey', side:THREE.DoubleSide} );
// groundMat.transparent = true;
// groundMat.opacity = 0.5;
const groundGeo = new THREE.PlaneGeometry(5,10);
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.position.y = -0.01;
ground.rotation.x = -Math.PI/2;
ground.recieveShadow = true;
scene.add(ground);

// add ceiling to the scene
const ceiling = ground.clone();
ceiling.position.y = 8;
scene.add(ceiling);
// draw table
const tableWidth = 3;
const tableLength = 6;
createTable(scene, tableLength, tableWidth);
//ball radius
const radius = 0.1;
const balls = createBalls(scene,radius);
const speeds = randomSpeeds(balls);



const clock = new THREE.Clock();
function render() {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
  const dt = clock.getDelta();
  move(balls, dt, speeds, tableLength, tableWidth);
}
render();
