// let singleMode = false;
// let doubleMode = false;
//
// if(confirm('Do you want to play in DoubleMode?')){
//   doubleMode = true;
// } else{
//   singleMode = true;
// }
// const geo = new THREE.Geometry();
//
// geo.vertices[0] = new THREE.Vector3(0,0,0);
// geo.vertices[1] = new THREE.Vector3(8,0,0);
// geo.vertices[2] = new THREE.Vector3(8,16,0);
// geo.vertices[3] = new THREE.Vector3(0,16,0);
// geo.faces[0] = new THREE.Face3(0,1,2);
// geo.faces[1] = new THREE.Face3(0,2,3);
// const plane = new THREE.Mesh( geo, planeMat );
// const planeGeo = new THREE.PlaneGeometry( 8, 16 );

// initilaize WebGLRenderer
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
const cushion1Geo = new THREE.BoxGeometry( 0.2, 16, 1 );
const cushion1Mat = new THREE.MeshBasicMaterial( {color: "#006400"} );
const cushion1 = new THREE.Mesh( cushion1Geo, cushion1Mat );
cushion1.position.set(-3.9,0,0.5);
playgorund.add(cushion1);

// second cushion
const cushion2Geo = new THREE.BoxGeometry( 0.2, 16, 1 );
const cushion2Mat = new THREE.MeshBasicMaterial( {color: "#006400"} );
const cushion2 = new THREE.Mesh( cushion2Geo, cushion2Mat );
cushion2.position.set(3.9,0,0.5);
playgorund.add(cushion2);

// 4- cushion for singleMode
const cushionSMGeo = new THREE.BoxGeometry( 0.2, 7.8, 1 );
const cushionSMMat = new THREE.MeshBasicMaterial( {color: "#006400"} );
const cushionSM = new THREE.Mesh( cushionSMGeo, cushionSMMat );
cushionSM.rotation.z = -Math.PI/2;
cushionSM.position.set(0,7.9,0.5);
// playgorund.add(cushionSM);

// 5- box for player 1
const player1Geo = new THREE.BoxGeometry( 0.2, 1.5, 1 );
const player1Mat = new THREE.MeshBasicMaterial( {color: "red"} );
const player1 = new THREE.Mesh( player1Geo, player1Mat );
player1.rotation.z = -Math.PI/2;
player1.position.set(0,-7.9,0.5);
playgorund.add(player1);

// 6- add player 2
const player2Geo = new THREE.BoxGeometry( 0.2, 1.5, 1 );
const player2Mat = new THREE.MeshBasicMaterial( {color: "blue"} );
const player2 = new THREE.Mesh( player2Geo, player2Mat );
player2.rotation.z = -Math.PI/2;
player2.position.set(0,7.9,0.5);
playgorund.add(player2);

// add the ball
const ballGeo = new THREE.SphereGeometry( 0.25, 16,16);
const ballMat = new THREE.MeshBasicMaterial({color: "yellow",
                                         wireframe:false} );
const ball = new THREE.Mesh(ballGeo, ballMat);
ball.position.z = 0.25;
playgorund.add(ball);

playgorund.add(plane);
scene.add(playgorund);








const controls = new THREE.TrackballControls( camera, canvas );
const clock = new THREE.Clock();
function render() {
  requestAnimationFrame(render);
  const h = clock.getDelta();

  // obj.position.x += speed*h;

  controls.update();
  renderer.render(scene, camera);
}
render();
