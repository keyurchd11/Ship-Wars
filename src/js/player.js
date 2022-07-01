class playerShip {
    constructor(scene) {
        this.scene = scene;
        const loader = new THREE.GLTFLoader();
        loader.load("/models/scene.gltf", (gltf) => {
            this.health = 100;
            this.score = 0;
            this.time = 30;
            this.player = gltf.scene;
            this.player.scale.set(0.03, 0.03, 0.03);
            this.player.position.set(0, -4.2, 0);
            scene.add(this.player);
        });
    }

    moveLeft(camera) {
        let oldYCord = camera.position.y;
        camera.position.y = (this.player.position.y);
        // console.log(camera.position);
        let dist = this.player.position.distanceTo(camera.position);
        camera.translateZ(-dist);
        this.player.rotation.y += 0.1;
        camera.rotation.y += 0.1;
        camera.translateZ(dist);
        camera.position.y = (oldYCord);
        // console.log(camera.position);

    }
    moveRight(camera) {
        let oldYCord = camera.position.y;
        camera.position.y = (this.player.position.y);
        // console.log(camera.position);
        let dist = this.player.position.distanceTo(camera.position);
        camera.translateZ(-dist);
        this.player.rotation.y -= 0.1;
        camera.rotation.y -= 0.1;
        camera.translateZ(dist);
        camera.position.y = (oldYCord);
        // console.log(camera.position);

    }
    moveUp(camera) {

        this.player.translateZ(-1.5);
        if (this.player.position.x == 0) {
            "FUCKED";
        }
        camera.translateZ(-1.5);
    }
    moveDown(camera) {
        this.player.translateZ(1.5);
        camera.translateZ(1.5);

    }
};