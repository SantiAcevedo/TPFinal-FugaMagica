export default class Preload extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    // Cargar imágenes y spritesheets necesarios para el juego
    this.load.image("sky", "./public/assets/images/fondopandaa.png");
    this.load.image("platform", "./public/assets/images/platform.png");
    this.load.image("powerup", "./public/assets/images/power up.png");
    this.load.image("enemy", "./public/assets/images/duendesss.png");
    this.load.spritesheet("player", "./public/assets/images/spritesheetpandaa.png", {
      frameWidth: 75,
      frameHeight: 87
    });

    // Cargar musica y efectos de sonido
  }

  create() {
    // Inicializacion
    this.scene.start("startScene");
    
  }
}

