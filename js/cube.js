// ---
// LED Cube JS
//
// @author Nat Zimmermann <hi@natzim.xyz>
// ---

var settings = {
    cube: {
        size: 8,
        leds: {
            defaultColor: 0xffffff,
            size: 0.2,
            opacity: 0.5
        },
        highlight: {
            size: 0.4
        }
    },
    canvas: {
        width: 500,
        height: 500,
        parentElement: document.getElementById('3d-cube')
    }
};

// ---
// Classes
// ---

var Led = function(object) {
    this.object = object;
};

Led.prototype.getColor = function() {
    return this.object.material.color.getHex();
}

Led.prototype.setColor = function(hex) {
    this.object.material.color.setHex(hex);
};

// ---
// Functions
// ---

function generateCube(size) {
    for (var i = 0; i < Math.pow(size, 3); i++) {
        // Construct LED geometry
        var geometry = new THREE.BoxGeometry(
            settings.cube.leds.size,
            settings.cube.leds.size,
            settings.cube.leds.size
        );

        // Construct LED material
        var material = new THREE.MeshBasicMaterial({
            color: settings.cube.leds.defaultColor,
            transparent: true,
            opacity: settings.cube.leds.opacity
        });

        // Construct LED mesh
        var led = new THREE.Mesh(geometry, material);

        // Calculate co-ordinates
        var x = Math.floor(i / size) % size;
        var y = Math.floor(i / Math.pow(size, 2));
        var z = i % size;

        led.position.set(x, y, z);

        // Generate 3D array on the fly
        if (!leds[x]) {
            leds[x] = [];
        }
        if (!leds[x][y]) {
            leds[x][y] = [];
        }

        // Store new LED in array
        leds[x][y][z] = new Led(led);

        // Add LED to the scene
        scene.add(led);
    }
}

function generateHighlight() {
    var geometry = new THREE.BoxGeometry(
        settings.cube.highlight.size,
        settings.cube.highlight.size,
        settings.cube.highlight.size
    );

    var material = new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0xff0000,
        opacity: 0.5
    });

    return new THREE.Mesh(geometry, material);
}

function setLedOptions() {
    var x = $('#x').val();
    var y = $('#y').val();
    var z = $('#z').val();

    var color = parseInt($('#color').val(), 16);

    leds[x][y][z].setColor(color);
}

function showLedOptions() {
    var x = $('#x').val();
    var y = $('#y').val();
    var z = $('#z').val();

    var hex = leds[x][y][z].getColor().toString(16).toUpperCase();
    hex = "000000".substr(0, 6 - hex.length) + hex;

    $('#color').val(hex);

    selectLed(x, y, z);
}

function selectLed(x, y, z) {
    highlight.position.set(x, y, z);

    $('#x').val(x);
    $('#y').val(y);
    $('#z').val(z);
}

// ---
// Event listeners
// ---

$('#color').change(setLedOptions);
$('#x, #y, #z').change(showLedOptions);
$(document).on('mousedown', function(e) {
    var mouse = new THREE.Vector2(
        ((e.clientX - renderer.domElement.offsetLeft) / renderer.domElement.width) * 2 - 1,
        -((e.clientY - renderer.domElement.offsetTop) / renderer.domElement.height) * 2 + 1
    );

    var raycaster = new THREE.Raycaster();

    raycaster.setFromCamera(mouse, camera);

    var selected = raycaster.intersectObjects(scene.children)[0];

    if (!selected) {
        return;
    }

    selectLed(
        selected.object.position.x,
        selected.object.position.y,
        selected.object.position.z
    );
});

// ---
// Main
// ---

// Calculate center co-ordinates
// This is used for the center of focus for the camera
var center = settings.cube.size / 2 - 0.5;
var centerVector = new THREE.Vector3(center, center, center);

// Generate scene
var scene = new THREE.Scene();

// Generate camera and set position
var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.copy(centerVector);
camera.position.z *= 4;

// Generate renderer and set canvas size
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(settings.canvas.width, settings.canvas.height);

// Add canvas to DOM
settings.canvas.parentElement.appendChild(renderer.domElement);

// Enable camera controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enableKeys = false;
controls.target.copy(centerVector);
controls.update();

// 3D array to store LEDs in their [x][y][z] co-ordinates
var leds = [];

generateCube(settings.cube.size);
var highlight = generateHighlight();
scene.add(highlight);
showLedOptions();

// ---
// Render loop
// ---

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();

