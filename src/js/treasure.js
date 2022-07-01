class treasure {
    constructor(scene, playerShip, x, z) {
        this.scene = scene;
        const loader = new THREE.GLTFLoader();
        loader.load("/models/star.glb", (gltf) => {
            this.obj = gltf.scene;
            this.obj.scale.set(3, 3, 3);
            this.obj.position.set(playerShip.x + x * 35, 0, playerShip.z + z * 25);
            this.obj.lookAt(playerShip);
            scene.add(this.obj);
        });
    }
};