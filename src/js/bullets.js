class bullet {
    constructor(scene, ship, target) {
        this.scene = scene;
        const loader = new THREE.GLTFLoader();
        loader.load("/models/bullet.glb", (gltf) => {
            this.obj = gltf.scene;
            this.obj.scale.set(0.5, 0.5, 0.5);
            this.obj.position.set(ship.x, 0, ship.z);
            this.obj.rotation.y -= Math.PI;
            this.obj.rotation.x += 2 * Math.PI;
            this.obj.position.set(ship.x, 0, ship.z);
            this.obj.lookAt(target);
            scene.add(this.obj);
        });
    }
};