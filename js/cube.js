var settings = {
    cube: {
        size: 8,
        leds: {
            defaultColor: 0x969696,
            size: 0.2,
            opacity: 0.1
        }
    },
    canvas: {
        width: 500,
        height: 500,
        parentElement: document.getElementById('3d-cube')
    }
};

var Led = function(object) {
    this.object = object;
};

Led.prototype.setColor = function(hex) {
    this.object.material.color.setHex(hex);
};

var center = settings.cube.size / 2 - 0.5;
var centerVector = new THREE.Vector3(center, center, center);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.copy(centerVector);
camera.position.z *= 4;

var renderer = new THREE.WebGLRenderer({alpha: false});
renderer.setSize(settings.canvas.width, settings.canvas.height);
settings.canvas.parentElement.appendChild(renderer.domElement);

// Enable camera controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.target.copy(centerVector);

controls.update();

var leds = [];

// Generate leds
for (var i = 0; i < Math.pow(settings.cube.size, 3); i++) {
    var geometry = new THREE.BoxGeometry(settings.cube.leds.size, settings.cube.leds.size, settings.cube.leds.size);
    var material = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: settings.cube.leds.defaultColor,
        opacity: settings.cube.leds.opacity
    });
    var led = new THREE.Mesh(geometry, material);

    var x = Math.floor(i / settings.cube.size) % settings.cube.size;
    var y = Math.floor(i / Math.pow(settings.cube.size, 2));
    var z = i % settings.cube.size;

    led.position.set(x, y, z);

    // Generate 3D array on the fly
    if (!leds[x]) {
        leds[x] = [];
    }

    if (!leds[x][y]) {
        leds[x][y] = [];
    }

    leds[x][y][z] = new Led(led);

    scene.add(led);
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();

