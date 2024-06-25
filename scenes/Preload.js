export default class Preload extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    // Cargar imágenes y spritesheets necesarios para el juego
    this.load.image("sky", "./public/fondopanda.png");
    this.load.image("platform", "./public/platform.png");
    this.load.image("powerup", "./public/power up.png");
    this.load.image("enemy", "./public/duendesss.png");
    this.load.spritesheet("player", "./public/Panda animado0000.png", {
      frameWidth: 184,
      frameHeight: 325
    });
    this.load.spritesheet('player_jump', './public/spritesheet pandaL.png', {
      frameWidth: 75,
      frameHeight: 81
    });
    this.load.spritesheet('player_jump_right', './public/spritesheet pandaR.png', {
      frameWidth: 75,
      frameHeight: 81
    });

    // Aquí puedes cargar otros recursos como sonidos, música, etc.
  }

  create() {
    // Aquí podrías inicializar cualquier cosa adicional antes de iniciar la escena principal
    this.scene.start("game");
    
  }
}

