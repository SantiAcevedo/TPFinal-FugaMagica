export default class StartScene extends Phaser.Scene {
  constructor() {
    super("startScene");
  }

  preload() {
    this.load.image("menu", "./public/assets/images/fuga.png");
    this.load.image("start", "./public/assets/images/play.png");
    this.load.audio("startsong", "./public/assets/sounds/startmusic.mp3");
  }

  create() {
    // Agregar el fondo
    this.addBackground();

    // Agregar música de fondo
    this.addBackgroundMusic();

    // Agregar el botón de inicio
    const playButton = this.add.image(this.game.config.width / 2, this.game.config.height / 1.3, 'start').setOrigin(0.5);
    playButton.setInteractive({ cursor: 'pointer' });
    playButton.setScale(0.4);

    // Escalar el botón cuando el cursor esté sobre él
    playButton.on('pointerover', () => {
      playButton.setScale(0.35);
    });

    // Restaurar la escala original cuando el cursor salga del botón
    playButton.on('pointerout', () => {
      playButton.setScale(0.4);
    });

    // Evento de clic en el botón de inicio
    playButton.on('pointerdown', () => {
      // Detener la música de fondo
      this.backgroundMusic.stop();
      // Iniciar la escena del juego
      this.scene.start('game');
    });
  }

  addBackground() {
    this.centerX = this.game.config.width / 2;
    this.centerY = this.game.config.height / 2; 
    this.background = this.add.image(this.centerX, this.centerY, "menu").setScale(1);
  }

  addBackgroundMusic() {
    this.backgroundMusic = this.sound.add('startsong', { loop: true, volume: 1 });
    this.backgroundMusic.play();
  }
}


