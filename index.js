var renderer, scene, camera, container;

var arSource,
  arContext,
  arMarker = [];

init();

function init() {
  container = document.getElementById("container");

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  scene = new THREE.Scene();
  camera = new THREE.Camera();

  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);
  scene.add(camera);
  scene.visible = false;

  // Sample data for the bar chart
  var data = [5, 10, 7, 3, 8];
  var barWidth = 0.2;
  var barSpacing = 0.3;

  // Create bar chart
  for (var i = 0; i < data.length; i++) {
    var barHeight = data[i] / 2;
    var bar = new THREE.Mesh(
      new THREE.BoxGeometry(barWidth, barHeight, barWidth),
      new THREE.MeshBasicMaterial({
        color: 0x01ffbb,
        transparent: true,
        opacity: 1,
      })
    );
    bar.position.set(i * barSpacing, barHeight / 2, 0);
    scene.add(bar);
  }

  arSource = new THREEx.ArToolkitSource({
    sourceType: "webcam",
  });

  arContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: "./assets/data/camera_para.dat",
    detectionMode: "mono",
  });

  arMarker[0] = new THREEx.ArMarkerControls(arContext, camera, {
    type: "pattern",
    patternUrl: "./assets/data/patt.hiro",
    changeMatrixMode: "cameraTransformMatrix",
  });

  arMarker[1] = new THREEx.ArMarkerControls(arContext, camera, {
    type: "pattern",
    patternUrl: "./assets/data/u4bi.patt",
    changeMatrixMode: "cameraTransformMatrix",
  });

  /* handle */
  arSource.init(function () {
    arSource.onResize();
    arSource.copySizeTo(renderer.domElement);

    if (arContext.arController !== null)
      arSource.copySizeTo(arContext.arController.canvas);
  });

  arContext.init(function onCompleted() {
    camera.projectionMatrix.copy(arContext.getProjectionMatrix());
  });

  render();
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);

  if (arSource.ready === false) return;

  arContext.update(arSource.domElement);
  scene.visible = camera.visible;
}
