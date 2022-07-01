// setting up the canvas object
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x005262);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 65;
camera.position.y = 13;

const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

const scenery = new landscape(scene, renderer);
scenery.updateSun(scene);
const player = new playerShip(scene, renderer);
var startTime = Date.now();

window.addEventListener("keydown", handlingInput);
var enemies = []
var bullets = []
var treasures = []
var myBullets = []

function moveEnemy() {
    var temp = []
    for (var i in enemies) {
        if (enemies[i].obj != undefined && player.player != undefined) {
            enemies[i].obj.lookAt(player.player.position)
            enemies[i].obj.translateZ(0.5)
            temp.push(enemies[i]);
        }
        else {
            temp.push(enemies[i]);
        }
    }
    enemies = temp;
}

function moveEnemyBullet() {
    var temp = []
    for (var i in bullets) {
        if (bullets[i].obj != undefined && player.player != undefined) {
            bullets[i].obj.lookAt(player.player.position)
            bullets[i].obj.translateZ(0.8)
            temp.push(bullets[i]);
        }
        else {
            temp.push(bullets[i]);
        }
    }
    bullets = temp;
}

function update() {
    scenery.waterObj.material.uniforms['time'].value += 1.0 / 60.0;
    moveEnemy();
    moveEnemyBullet();
    handleCollisions();

    for (var i in myBullets) {
        if (myBullets[i].obj != undefined)
            myBullets[i].obj.translateZ(-0.7);
    }

    if (Date.now() - startTime >= 1000) {
        // console.log(Date.now);
        // console.log(startTime);
        player.time = player.time - 1;
        startTime = Date.now();
    }
    document.getElementById("score").innerHTML = "Score: " + player.score;
    document.getElementById("health").innerHTML = "Health: " + Math.max(player.health, 0);
    document.getElementById("time").innerHTML = "Time Left: " + player.time;
    renderer.render(scene, camera);

    if (player.health <= 0) {
        player.health = 0;
        document.getElementById("over").innerHTML = "Game Over!";
        return;
    }
    if (player.time <= 0) {
        player.time = 0;
        document.getElementById("over").innerHTML = "Time up!";
        return;
    }
}

function spawnEnemy() {
    if (player.position == undefined) {
        var cordsOfShip = new THREE.Vector3(0, -4.2, 0);
        const enemy = new enemyShip(scene, cordsOfShip, Math.random() * 10 - 5, Math.random() * 10 - 5);
        enemies.push(enemy);
    }
    else {
        const enemy = new enemyShip(scene, player.position, Math.random() * 10 - 5, Math.random() * 10 - 5);
        enemies.push(enemy);
    }
    if (enemies.length < 4)
        setTimeout(spawnEnemy, 500);
}

function handleCollisions() {
    for (var i in enemies) {
        if (enemies[i].obj != undefined && player.player != undefined) {
            if (enemies[i].obj.position.distanceTo(player.player.position) < 2.5) {
                player.health -= 25;
                scene.remove(enemies[i].obj);
                enemies[i].obj = undefined;
            }
        }
    }

    for (var i in bullets) {
        if (bullets[i].obj != undefined && player.player != undefined) {
            if (bullets[i].obj.position.distanceTo(player.player.position) < 6) {
                player.health -= 5;
                scene.remove(bullets[i].obj);
                bullets[i].obj = undefined;
            }
        }
    }
    for (var i in treasures) {
        if (treasures[i].obj != undefined && player.player != undefined) {
            // console.log("YES");
            if (treasures[i].obj.position.distanceTo(player.player.position) < 6) {
                player.score += 1;
                scene.remove(treasures[i].obj);
                treasures[i].obj = undefined;
            }
        }
    }
    for (var i in myBullets) {
        for (var j in enemies) {
            if (myBullets[i].obj != undefined && enemies[j].obj != undefined) {
                if (myBullets[i].obj.position.distanceTo(enemies[j].obj.position) < 5) {
                    scene.remove(myBullets[i].obj);
                    scene.remove(enemies[j].obj);
                    myBullets[i].obj = undefined;
                    enemies[j].obj = undefined;
                    player.score = player.score + 10;
                }
            }
        }
    }
}

// handle collisions
function checkCollisions(obj1, obj2) {
    // check distance between obj1 and obj2
    if (obj1.position != undefined && obj2.position != undefined) {
        var distance = obj1.position.distanceTo(obj2.position);
        if (distance < 0.5) {
            // console.log("collision");
            return true;
        }
    }
    return false;
}

function shootStraight() {
    if (player.player != undefined) {
        var newBullet = new myBullet(scene, player.player, player.player.position);
        myBullets.push(newBullet);
    }
}


function spawnBullets() {
    for (let i in bullets) {
        scene.remove(bullets[i].obj);
    }
    bullets = [];
    for (let i in enemies) {
        if (enemies[i].obj != undefined && player.player != undefined) {
            var newBullet = new bullet(scene, enemies[i].obj.position, player.player.position);
            bullets.push(newBullet);
        }
    }
    console.log(bullets);
    if (enemies.length > 0)
        setTimeout(spawnBullets, 5000);
}

function spawnTreasues() {
    for (let i in treasures) {
        scene.remove(treasures[i].obj);
    }
    treasures = [];
    let times = 6;
    while (times--) {
        if (player.position == undefined) {
            var cordsOfShip = new THREE.Vector3(0, -4.2, 0);
            const chest = new treasure(scene, cordsOfShip, Math.random() * 10 - 5, Math.random() * 10 - 5);
            treasures.push(chest);
        }
        else {
            const chest = new treasure(scene, player.position, Math.random() * 10 - 5, Math.random() * 10 - 5);
            treasures.push(chest);
        }
    }
    if (1)
        setTimeout(spawnTreasues, 10000);
}


function handlingInput(event) {

    // console.log(event.keyCode);
    // left arrow
    if (event.keyCode === 37) {
        player.moveLeft(camera);
    }
    // right arrow
    if (event.keyCode === 39) {
        player.moveRight(camera);
    }
    // up arrow
    if (event.keyCode === 38) {
        player.moveUp(camera);
    }
    // down arrow
    if (event.keyCode === 40) {
        player.moveDown(camera);
    }
    // space bar
    if (event.keyCode === 32) {
        shootStraight();
    }
    if (event.keyCode == 84) {
        var vec = new THREE.Vector3(camera.position.x, 50, camera.position.z);
        camera.position.set(vec.x, vec.y, vec.z);
    }
    if (event.keyCode == 79) {
        var vec = new THREE.Vector3(camera.position.x, 13, camera.position.z);
        camera.position.set(vec.x, vec.y, vec.z);
    }
}

spawnEnemy();
spawnBullets();
spawnTreasues();

function loop() {
    update();
    // moveEnemy();
    requestAnimationFrame(loop);
}


loop();

