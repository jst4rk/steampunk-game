window.addEventListener('load', function () {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1500;
    canvas.height = 500;
    class InputHandler {

    }

    class Projectile {

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
        }

        update() {
            this.yPosition += this.ySpeed;
        }

        draw(ctx) {
            ctx.fillRect(this.xPosition, this.yPosition, this.width, this.height);
        }

    }

    class Enemy {

    }

    class Layer {

    }

    class Background {

    }

    class UI {

    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;

            this.player = new Player(this);
        }

        update() {
            this.player.update();
        }

        draw(ctx) {
            this.player.draw(ctx);
        }
    }

    const game = new Game(canvas.width, canvas.height);
});