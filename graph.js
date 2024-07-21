var renderer, scene, camera, container;
var arSource,
  arContext,
  arMarker = [];

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

  // Create X axis
  var xAxisGeometry = new THREE.Geometry();
  xAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
  xAxisGeometry.vertices.push(
    new THREE.Vector3(data.length * barSpacing, 0, 0)
  );
  var xAxisMaterial = new THREE.LineBasicMaterial({
    color: 0xff0000,
    linewidth: 10,
  }); // Thicker line
  var xAxis = new THREE.Line(xAxisGeometry, xAxisMaterial);
  scene.add(xAxis);

  // Create Y axis
  var yAxisGeometry = new THREE.Geometry();
  yAxisGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
  yAxisGeometry.vertices.push(new THREE.Vector3(0, Math.max(...data) / 2, 0));
  var yAxisMaterial = new THREE.LineBasicMaterial({
    color: 0x00ff00,
    linewidth: 10,
  }); // Thicker line
  var yAxis = new THREE.Line(yAxisGeometry, yAxisMaterial);
  scene.add(yAxis);

  // Load font and create title
  var loader = new THREE.FontLoader();
  loader.load(
    "./assets/fonts/helvetiker_regular.typeface.json",
    function (font) {
      var textGeometry = new THREE.TextGeometry("Sample Graph", {
        font: font,
        size: 0.5,
        height: 0.1,
      });
      var textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      var title = new THREE.Mesh(textGeometry, textMaterial);
      title.position.set(0, Math.max(...data) / 2 + 1, 0);
      scene.add(title);

      // Create X and Y axis labels
      var xLabelGeometry = new THREE.TextGeometry("Time", {
        font: font,
        size: 0.2,
        height: 0.05,
      });
      var xLabelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      var xLabel = new THREE.Mesh(xLabelGeometry, xLabelMaterial);
      xLabel.position.set((data.length * barSpacing) / 2, -0.5, 0);
      scene.add(xLabel);

      var yLabelGeometry = new THREE.TextGeometry("Sales", {
        font: font,
        size: 0.2,
        height: 0.05,
      });
      var yLabelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      var yLabel = new THREE.Mesh(yLabelGeometry, yLabelMaterial);
      yLabel.position.set(-1, Math.max(...data) / 4, 0);
      scene.add(yLabel);
    }
  );

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

// Initialize the scene
init();
