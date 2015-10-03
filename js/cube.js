var settings = {
    cube: {
        size: 8,
        leds: {
            defaultColor: 0x0000ff,
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

Led.prototype.getColor = function() {
    return this.object.material.color.getHex();
}

Led.prototype.setColor = function(hex) {
    this.object.material.color.setHex(hex);
};

document.getElementById('led-settings').addEventListener('submit', function(e) {
    e.preventDefault();

    var x = document.getElementById('x').value;
    var y = document.getElementById('y').value;
    var z = document.getElementById('z').value;

    var color = parseInt(document.getElementById('color').value, 16);

    leds[x][y][z].setColor(color);
});

function updateLedSettings() {
    var x = document.getElementById('x').value;
    var y = document.getElementById('y').value;
    var z = document.getElementById('z').value;

    var hex = leds[x][y][z].getColor().toString(16).toUpperCase();
    hex = "000000".substr(0, 6 - hex.length) + hex;

    document.getElementById('color').value = hex;
}

document.getElementById('x').addEventListener('change', updateLedSettings);
document.getElementById('y').addEventListener('change', updateLedSettings);
document.getElementById('z').addEventListener('change', updateLedSettings);

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
controls.enableKeys = false;
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

updateLedSettings();

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();

