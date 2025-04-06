import * as THREE from "three";
import { getWeather } from "./main"; // Import the getWeather function

export function initEarth(containerSelector, citiesWithCoords) {
    const container = document.querySelector(containerSelector);
    const width = 1200; // Increased width
    const height = 800; // Increased height
  
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 5000); // Increased FOV for wider view
    camera.position.z = 6; // Move camera farther out for better view
  
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
  
    const geometry = new THREE.SphereGeometry(1.5, 128, 128); // Higher segment count
    const textureLoader = new THREE.TextureLoader();
  
    // Correct path to texture
    const earthTexture = textureLoader.load("/Images/earthmap.jpg");
    const material = new THREE.MeshStandardMaterial({ map: earthTexture });
  
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);
  
    const light = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(light);
  
    // Add markers for each city
    const markerGeometry = new THREE.SphereGeometry(0.02, 32, 32);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  
    // Function to create text sprites
    const createTextSprite = (name) => { // Removed temperature parameter
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const fontSize = 50;
      
        // Dynamically adjust canvas size
        canvas.width = 1024; // Large width for long text
        canvas.height = 512; // Large height for better spacing
      
        // Set font and text properties
        context.font = `${fontSize}px "Inknut Antiqua", serif`; // Use the specified font family
        context.fillStyle = "#851961"; // Text color
        context.textAlign = "center";
        context.textBaseline = "middle"; // Center text vertically
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      
        // Draw the city name
        context.fillText(name, canvas.width / 2, canvas.height / 2); // Centered vertically
      
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true; // Ensure the texture updates
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
      
        // Adjust the sprite scale to fit the text properly
        sprite.scale.set(4, 2, 1); // Adjust size of the label
        return sprite;
      };
  
    citiesWithCoords.forEach(async (city) => {
        const { lat, lon, name } = city; // Extract latitude, longitude, and country name
      
        // Convert latitude and longitude to radians
        const phi = (90 - lat) * (Math.PI / 180); // Latitude: 90 -> 0 -> -90
        const theta = (lon + 180) * (Math.PI / 180); // Longitude: -180 -> 0 -> 180
      
        // Convert spherical coordinates to 3D Cartesian coordinates
        const x = -Math.sin(phi) * Math.cos(theta);
        const y = Math.cos(phi);
        const z = Math.sin(phi) * Math.sin(theta);
      
        console.log(`City: ${name}, Position: x = ${x}, y = ${y}, z = ${z}`); // Debugging marker positions
      
        // Create the marker
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(x * 1.6, y * 1.6, z * 1.6); // Adjust marker position for larger Earth
        earth.add(marker); // Add the marker to the Earth object directly
      
        // Create the text sprite with the country name
        const textSprite = createTextSprite(name); // Use the country name as the text
        textSprite.position.set(x * 2.2, y * 2.2, z * 2.2); // Position text slightly away from the marker
        earth.add(textSprite); // Add the text sprite to the Earth object

        // Fetch the weather for the city
        const temperature = await getWeather({ name, country: "" }); // Pass city name, country is optional

        // Create a text sprite for the temperature
        const createTemperatureSprite = (temp) => {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            const fontSize = 40;
    
            // Dynamically adjust canvas size
            canvas.width = 512;
            canvas.height = 256;
    
            // Clear the canvas before setting properties
            context.clearRect(0, 0, canvas.width, canvas.height);
    
            // Set font and text properties
            context.font = `${fontSize}px Arial`;
            context.textAlign = "center";
            context.textBaseline = "middle";
    
            // Explicitly set the text color
            context.fillStyle = "#851961"; // Match text color to #851961
    
            // Draw the temperature text
            context.fillText(`${temp}°C`, canvas.width / 2, canvas.height / 2);
    
            // Create texture from canvas
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(spriteMaterial);
    
            // Adjust the sprite scale to fit the text properly
            sprite.scale.set(2, 1, 1); // Adjust size of the label
            return sprite;
        };
    
        const temperatureSprite = createTemperatureSprite(temperature);
        temperatureSprite.position.set(x * 2.2, y * 2.2 - 0.3, z * 2.2); // Slightly below the city name
        earth.add(temperatureSprite);
      
        // Create a line connecting the marker to the text sprite
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x851961 }); // Line color
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x * 1.6, y * 1.6, z * 1.6), // Marker position
          new THREE.Vector3(x * 2, y * 2, z * 2), // Text sprite position
        ]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        earth.add(line); // Add the line to the Earth object
      
        console.log(`Text Position: x = ${x * 2.2}, y = ${y * 2.2}, z = ${z * 2.2}`); // Debugging text positions
      });

    // Animate Earth and markers together
    function animate() {
      requestAnimationFrame(animate);
  
      // Rotate Earth and markers together
      earth.rotation.y += 0.0015;
  
      // Render the scene from the perspective of the camera
      renderer.render(scene, camera);
    }
  
    animate();
  }