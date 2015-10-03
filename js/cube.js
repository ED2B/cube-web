var settings = {
    cube: {
        size: 8,
        leds: {
            color: 0x969696,
            size: 0.2,
            opacity: 0.1
        }
    }
};

var center = settings.cube.size / 2 - 0.5;
var centerVector = new THREE.Vector3(center, center, center);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.copy(centerVector);
camera.position.z *= 4;

var renderer = new THREE.WebGLRenderer({alpha: false});
renderer.setSize(500, 500);
document.getElementById('3d-cube').appendChild(renderer.domElement);

// Enable camera controls
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.target.copy(centerVector);

controls.update();

var leds = [];

// Generate leds
for (var i = 0; i < Math.pow(settings.cube.size, 3); i++) {
    var geometry = new THREE.BoxGeometry(settings.cube.leds.size, settings.cube.leds.size, settings.cube.leds.size);
    var material = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: settings.cube.leds.color,
        opacity: settings.cube.leds.opacity
    });
    var cube = new THREE.Mesh(geometry, material);

    var x = Math.floor(i / settings.cube.size) % settings.cube.size;
    var y = Math.floor(i / Math.pow(settings.cube.size, 2));
    var z = i % settings.cube.size;

    // Generate 3D array on the fly
    if (!leds[x]) {
        leds[x] = [];
    }
    if (!leds[x][y]) {
        leds[x][y] = [];
    }

    leds[x][y][z] = cube;

    cube.position.set(x, y, z);

    scene.add(cube);
}

leds[0][0][0].material.color.setHex(0x00ff00);

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();

