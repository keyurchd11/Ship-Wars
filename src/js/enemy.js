class enemyShip {
    constructor(scene, playerShip, x, z) {
        this.scene = scene;
        // console.log(playerShip);
        const loader = new THREE.GLTFLoader();
        loader.load("/models/scene.gltf", (gltf) => {
            this.obj = gltf.scene;
            this.obj.scale.set(0.03, 0.03, 0.03);
            this.obj.position.set(playerShip.x + x*25, playerShip.y, playerShip.z + z*25);
            this.obj.lookAt(playerShip);
            scene.add(this.obj);
        });
    }
};