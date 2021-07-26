

const Diagnostics = require('Diagnostics');
//const Scene = require('Scene');
const Patches = require('Patches');
const FaceTracking = require('FaceTracking');
const Reactive = require('Reactive');

(async function () {

  // Get the user face
  const face = FaceTracking.face(0);

  /*
   Mouth Center
   We calculate the position of the mouth on the horizontal axis (x) based on the midpoint of the mouth.
   To calculate the midpoint we use each mouth corner.
  */
  Patches.inputs.setScalar('mouthCenter', face.mouth.rightCorner.x.add(face.mouth.leftCorner.x).mul(0.5).mul(100)) ;

  /*
   Mouth Wide
   We calculate the wideness of the mouth based on the distance between the mouth's corners.
   We also cap values bellow zero to use the value just for wideness.
  */
  Patches.inputs.setScalar('mouthWide', Reactive.max(0, face.mouth.rightCorner.x.sub( face.mouth.leftCorner.x ).mul( 100 ).sub( 5 ) ) );

  /*
   Kiss
   We calculate the kiss value based on the distance between the mouth corners.
   In this case we use the negative values and cap values going beyond 0.
   We also multiply it by -1 to have positive numbers, easy to understand.
  */
  Patches.inputs.setScalar('mouthKiss', Reactive.min(0,face.mouth.rightCorner.x.sub(face.mouth.leftCorner.x).mul(100).sub(5)).mul(-1));

  /*
   Mouth Openness
   We calculate the mouth openness based on the distance between the upperlip and the lowerlip.
  */
  Patches.inputs.setScalar('mouthOpen', face.mouth.lowerLipCenter.y.sub(face.mouth.upperLipCenter.y).abs().mul(100).mul(0.2));

  /***********************************************************************
  [ Why Calculate openness ourselves? ]
   Regular mouth openness in spark has jumps in values leaving out some subtle mouth movements.
   Example: Patches.inputs.setScalar('mouthOpen', face.mouth.openness.mul(2));
   ***********************************************************************/

  /*
   Mouth Smile
   We calculate the smile value by using the upperlip curvature.
   As it's expressed in angles we need to do some math to normalize the value.
   We cap values to keep the range in the smile gesture,
  */
  Patches.inputs.setScalar('mouthSmile', Reactive.max(0,face.mouth.upperLipCurvature.abs().mul(-10).sum(1)));

  /*
   Mouth Sad
   We calculate the mouth sadness using the curvature of the lower lip. We cap  la tristeza como el valor de curvatura del labio inferior.
  */
  Patches.inputs.setScalar('mouthSad', Reactive.max(0,face.mouth.lowerLipCurvature.abs().mul(10).sub(1).mul(2)));

})();
