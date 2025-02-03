import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.139.2/build/three.module.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.139.2/examples/jsm/loaders/FBXLoader.js';

// Ensure Canvas Exists
const canvas = document.getElementById('characterCanvas');
if (!canvas) {
    console.error("Canvas element with ID 'characterCanvas' not found.");
    alert("Canvas not found! Check your HTML.");
}

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x333333, 0); // Add background color

// Lighting Fix
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

// Loading Elements
const loadingScreen = document.getElementById('loading-screen');
const loadingBar = document.getElementById('loading-bar');
const loadingText = document.getElementById('loading-text');

// Load Character (FBX)
const loader = new FBXLoader();
let character;

const modelPath = 'https://github.com/mrdoob/three.js/blob/dev/examples/models/fbx/Samba%20Dancing.fbx';
console.log("Loading model from:", modelPath);

// Model Loading with Debugging
loader.load(
    modelPath,
    (obj) => {
        console.log("✅ Character loaded successfully:", obj);
        character = obj;

        // Model Fixes
        character.scale.set(0.1, 0.1, 0.1);
        character.position.set(0, -1, 0);
        character.rotation.y = Math.PI; // Rotate to face camera
        scene.add(character);

        // Hide loading screen after model is loaded
        if (loadingScreen) {
            console.log("✅ Hiding loading screen");
            loadingScreen.style.display = 'none';
        }
    },
    (xhr) => {
        if (xhr.total > 0) {  // Ensure xhr.total is valid
            let progress = ((xhr.loaded / xhr.total) * 100).toFixed(2);
            console.log(`📶 Loading progress: ${progress}%`);
            if (loadingBar) loadingBar.style.width = `${progress}%`;
            if (loadingText) loadingText.textContent = `${progress}%`;
        } else {
            console.warn("⚠️ Progress unknown - server may not provide Content-Length");
        }
    },
    (error) => {
        console.error('❌ Error loading character:', error);
        alert("Failed to load character. Check console for details.");
    }
);

// Camera Fix
camera.position.set(0, 2, 5);
camera.lookAt(0, 1, 0);

// Animation Loop Fix
function animate() {
    requestAnimationFrame(animate);
    if (character) {
        character.rotation.y += 0.005;
    }
    renderer.render(scene, camera);
    console.log("🎥 Rendering frame...");
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Debugging: Log scene contents
console.log("📜 Scene children:", scene.children);

// Force hide the loading screen after 10 seconds if stuck
setTimeout(() => {
    console.warn("⏳ Forcing loading screen hide after 10s...");
    if (loadingScreen) loadingScreen.style.display = 'none';
}, 10000);

// Debugging: Add a Red Cube to confirm scene rendering
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const debugCube = new THREE.Mesh(geometry, material);
debugCube.position.set(0, 0, 0);
scene.add(debugCube);

// Debugging: Ensure the camera can view the scene properly
camera.position.set(0, 2, 3);
camera.lookAt(0, 1, 0);

// Additional Log to verify progress
console.log("📋 Checking if model is loaded and renderer is working...");
