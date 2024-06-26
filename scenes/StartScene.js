// StartScene.js

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("startScene");
  }

  preload() {
    this.load.image("sky", "./public/assets/images/fondopanda.png");
    this.load.image("start", "./public/assets/images/start.webp");
  }

  create() {
    // Agregar el fondo
    this.addBackground();

    // Agregar el botón de inicio
    const playButton = this.add.image(this.game.config.width / 2, this.game.config.height / 1.5, 'start').setOrigin(0.5);
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
      // Iniciar la escena del juego
      this.scene.start('game');
    });

    // Texto de bienvenida
    this.add.text(this.game.config.width / 2, this.game.config.height / 2 - 50, "FUGA MAGICA", {
      fontSize: "32px",
      fill: "#fff",
    }).setOrigin(0.5);
  }

  addBackground() {
    this.centerX = this.game.config.width / 2;
    this.centerY = this.game.config.height / 2; 
    this.background = this.add.image(this.centerX, this.centerY, "sky").setScale(2.9);
  }
}

