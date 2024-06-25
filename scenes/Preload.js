export default class Preload extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    // Cargar imágenes y spritesheets necesarios para el juego
    this.load.image("sky", "../public/assets/images/fondopanda.png");
    this.load.image("platform", "../public/assets/images/platform.png");
    this.load.image("powerup", "../public/assets/images/power up.png");
    this.load.image("enemy", "../public/assets/images/duendesss.png");
    this.load.spritesheet("player", "../public/assets/images/Panda animado0000.png", {
      frameWidth: 184,
      frameHeight: 325
    });
    this.load.spritesheet('player_jump', '../public/assets/images/spritesheet pandaL.png', {
      frameWidth: 75,
      frameHeight: 81
    });
    this.load.spritesheet('player_jump_right', '../public/assets/images/spritesheet pandaR.png', {
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

