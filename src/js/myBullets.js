class myBullet {
    constructor(scene, ship, target) {
        this.scene = scene;
        const loader = new THREE.GLTFLoader();
        loader.load("/models/bullet.glb", (gltf) => {
            this.obj = gltf.scene;
            this.obj.scale.set(0.5, 0.5, 0.5);
            this.obj.position.set(ship.position.x, 0, ship.position.z);
            this.obj.rotation.y = ship.rotation.y;
            this.obj.position.set(ship.position.x, 0, ship.position.z);
            scene.add(this.obj);
        });
    }
};