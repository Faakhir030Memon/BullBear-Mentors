import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Scene3D = () => {
    const canvasRef = useRef();

    useEffect(() => {
        let mouseX = 0;
        let mouseY = 0;
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Particles
        const particlesCount = 1500;
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 15;
            positions[i + 1] = (Math.random() - 0.5) * 15;
            positions[i + 2] = (Math.random() - 0.5) * 15;

            // Mix of green and red particles
            if (Math.random() > 0.5) {
                colors[i] = 0.15; // R
                colors[i + 1] = 0.8; // G
                colors[i + 2] = 0.3; // B
            } else {
                colors[i] = 0.8; // R
                colors[i + 1] = 0.15; // G
                colors[i + 2] = 0.2; // B
            }
        }

        const particlesGeometry = new THREE.BufferGeometry();
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        // Grid
        const gridHelper = new THREE.GridHelper(20, 20, 0x333333, 0x1a1a1a);
        gridHelper.position.y = -2;
        gridHelper.rotation.x = Math.PI / 8;
        scene.add(gridHelper);

        // Abstract Bull & Bear Shapes (Using Geometries as placeholders for models)
        const bullGeo = new THREE.IcosahedronGeometry(0.8, 0);
        const bullMat = new THREE.MeshPhongMaterial({ color: 0x00c805, wireframe: true });
        const bull = new THREE.Mesh(bullGeo, bullMat);
        bull.position.set(-3, 0, -2);
        scene.add(bull);

        const bearGeo = new THREE.OctahedronGeometry(0.8, 0);
        const bearMat = new THREE.MeshPhongMaterial({ color: 0xff4d4d, wireframe: true });
        const bear = new THREE.Mesh(bearGeo, bearMat);
        bear.position.set(3, 0, -2);
        scene.add(bear);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const handleResize = () => {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const handleMouseMove = (event) => {
            mouseX = (event.clientX - windowHalfX) / 100;
            mouseY = (event.clientY - windowHalfY) / 100;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            requestAnimationFrame(animate);

            particles.rotation.y += 0.001;
            particles.rotation.x += 0.0005;

            // React to mouse
            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            bull.rotation.y += 0.01;
            bear.rotation.y -= 0.01;

            // Interaction based on scroll could be added here via props or global state
            
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            renderer.dispose();
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -1,
                pointerEvents: 'none',
                background: '#0a0a0a'
            }} 
        />
    );
};

export default Scene3D;
