/**
 * draws the billiard table.
 * @param {Object} scene THREE.Scene();
 */
 function createTable(scene, tableLength, tableWidth) {
   const Box = {
     construct: function(width, height, depth, color) {
       const boxGeo = new THREE.BoxGeometry(width, height, depth);
       const boxMat = new THREE.MeshPhongMaterial({color: color});
       const box = new THREE.Mesh(boxGeo, boxMat);
       box.receiveShadow = true;
       box.castShadow = true;
       box.position.y = 0.5;
       return box;
     }
   };

   // first leg
   const leg1 = Box.construct(0.2, 1, 0.2, 'red');
   leg1.position.x = 1;
   leg1.position.z = 2;
   scene.add(leg1);

   // 2nd leg
   const leg2 = Box.construct(0.2, 1, 0.2, 'red');
   leg2.position.x = -1;
   leg2.position.z = 2;
   scene.add(leg2);
   // 3rd leg
   const leg3 = Box.construct(0.2, 1, 0.2, 'red');
   leg3.position.x = -1;
   leg3.position.z = -2;
   scene.add(leg3);
   // 4th leg
   const leg4 = Box.construct(0.2, 1, 0.2, 'red');
   leg4.position.x = 1;
   leg4.position.z = -2;
   scene.add(leg4);

   // table bed
   const bed = Box.construct(tableWidth, 0.01, tableLength, 'green');
   bed.position.y = 1;
   scene.add(bed);
   // add cussions
   // 1st cussion parallel to the z axiz
   const cussionX1 = Box.construct(0.2, 0.2, tableLength, 'green');
   cussionX1.position.y = 1.1;
   cussionX1.position.x = -1.4;
   scene.add(cussionX1);

   // 2nd cussion parallel to the z axis
   const cussionX2 = Box.construct(0.2, 0.2, tableLength, 'green');
   cussionX2.position.y = 1.1;
   cussionX2.position.x = 1.4;
   scene.add(cussionX2);
   // 1st cussion parallel to the x axis

   const cussionZ1 = Box.construct(tableWidth, 0.2, 0.2, 'green');
   cussionZ1.position.y = 1.1;
   cussionZ1.position.z = tableWidth - 0.1;
   scene.add(cussionZ1);

   // 2nd cussion parallel to the x axis
   const cussionZ2 =  Box.construct(tableWidth, 0.2, 0.2, 'green');
   cussionZ2.position.y = 1.1;
   cussionZ2.position.z = -(tableWidth - 0.1);
   scene.add(cussionZ2);
 }
