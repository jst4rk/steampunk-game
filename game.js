window.addEventListener('load', function () {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1500;
    canvas.height = 500;

    class InputHandler {
        constructor(game) {
            this.game = game;

            window.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowUp':
                        this.game.player.moveUp();
                        break;

                    case 'ArrowDown':
                        this.game.player.moveDown();
                        break;

                    // Spacebar key value
                    case ' ':
                        this.game.player.shootFromTop();
                        break;

                    default:
                        break;
                }
            });

            window.addEventListener('keyup', (e) => {
                switch (e.key) {
                    case 'ArrowUp':
                    case 'ArrowDown':
                        this.game.player.stop();
                        break;

                    default:
                        break;
                }
            });
        }
    }

    class Projectile {
        constructor(game, pXPosition, pYPosition) {
            this.game = game;

            this.xPosition = pXPosition;
            this.yPosition = pYPosition;

            this.width = 10;
            this.height = 3;
            this.speed = 3;

            this.markForDeletion = false;
        }

        update() {
            this.xPosition += this.speed;
            if (this.xPosition > this.game.width * 0.8) {
                this.markForDeletion = true;
            }
        }

        draw(ctx) {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(this.xPosition, this.yPosition, this.width, this.height);
        }
    }

    class Particle {

    }

    class Player {
        constructor(game) {
            this.game = game;

            this.width = 120;
            this.height = 190;

            this.xPosition = 20;
            this.yPosition = 100;

            this.ySpeed = 0;
            this.maxSpeed = 3;

            this.projectiles = [];
        }

        moveUp() {
            this.ySpeed = -this.maxSpeed;
        }

        moveDown() {
            this.ySpeed = this.maxSpeed;
        }

        stop() {
            this.ySpeed = 0;
        }

        shootFromTop() {
            if (this.game.ammo) {
                this.projectiles.push(new Projectile(this.game, this.xPosition + 80, this.yPosition + 40));
                this.game.ammo--;
            }
        }

        update(deltaTime) {
            this.yPosition += this.ySpeed;
            this.projectiles.forEach(projectile => {
                projectile.update();
            });

            this.projectiles = this.projectiles.filter(projectile => !projectile.markForDeletion);
        }

        draw(ctx) {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.xPosition, this.yPosition, this.width, this.height);
            this.projectiles.forEach(projectile => {
                projectile.draw(ctx);
            });
        }

    }

    class Enemy {
        constructor(game) {
            this.game = game;

            this.xPosition = this.game.width;
            this.speed = Math.random() * -1.5 - 0.5;

            this.markForDeletion = false;
        }

        update() {
            this.xPosition += this.speed;

            if (this.xPosition + this.width < 0) 
            {
                this.markForDeletion = true;
            }
        }

        draw(ctx) {
            ctx.fillStyle = 'red';
            ctx.fillRect(this.xPosition, this.yPosition, this.width, this.height);
        }
    }

    class Angler1 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 228 * 0.2;
            this.height = 160 * 0.2;
            this.yPosition = Math.random() * ((this.game.height * 0.9) - this.height);
        }
    }

    class Layer {

    }

    class Background {

    }

    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Helvetica';
            this.fontColor = 'yellow';
        }

        draw(ctx) {
            ctx.fillStyle = this.fontColor;

            for (let index = 0; index < this.game.ammo; index++) {
                ctx.fillRect(20 + 6 * index, 50, 3, 20);                
            }
        }
    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.ammo = 30;
            this.ammoTimer = 0;
            this.maxAmmo = 50;
            this.ammoInterval = 500;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.enemies = [];
            this.maxEnemies = 25;
            this.gameOver = false;

            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
        }

        update(deltaTime) {
            this.player.update(deltaTime);
            if (this.ammoTimer > this.ammoInterval) {
                if (this.ammo < this.maxAmmo) {
                    this.ammo++;
                }

                this.ammoTimer = 0;
            } else {
                this.ammoTimer += deltaTime;
            }

            this.enemies.forEach(enemy => {
                enemy.update();
            });

            this.enemies = this.enemies.filter(enemy => !enemy.markForDeletion);

            if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
                if (this.enemies.length < this.maxEnemies) {
                    this.addEnemy();
                }
                this.enemyTimer = 0
            } else {
                this.enemyTimer += deltaTime;
            }
        }

        draw(ctx) {
            this.player.draw(ctx);
            this.ui.draw(ctx);

            this.enemies.forEach(enemy => {
                enemy.draw(ctx);
            });
        }

        addEnemy() {
            this.enemies.push(new Angler1(this));
        }
    }

    const game = new Game(canvas.width, canvas.height);

    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);

        requestAnimationFrame(animate);
    }

    animate(0);
});