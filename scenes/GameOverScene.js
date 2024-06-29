export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  preload() {
    this.load.audio("endsong", "./public/assets/sounds/endsongg.mp3");
  }

  create(data) {
    const { width, height } = this.game.config;

    // Añadir música de fondo
    this.backgroundMusic = this.sound.add('endsong', { loop: false, volume: 1 });

    // Reproducir la música
    this.backgroundMusic.play();

    // Añadir texto de Game Over
    this.add.text(width / 2, height / 2 - 100, "¡TE ATRAPARON!", {
      fontSize: "64px",
      fill: "#fff"
    }).setOrigin(0.5);

    // Mostrar puntuación final
    this.add.text(width / 2, height / 2 - 30, `¡Subiste esta cantidad de metros!: ${data.score}`, {
      fontSize: "32px",
      fill: "#fff",
    }).setOrigin(0.5);

    // Mostrar tiempo sobrevivido
    this.add.text(width / 2, height / 2 + 40, `Tiempo sobrevivido: ${data.time} s`, {
      fontSize: "32px",
      fill: "#fff"
    }).setOrigin(0.5);

    // Añadir opción para reiniciar el juego
    this.add.text(width / 2, height / 2 + 100, "Presiona ESPACIO para reiniciar", {
      fontSize: "32px",
      fill: "#fff"
    }).setOrigin(0.5);

    // Añadir evento de teclado para reiniciar el juego
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start("game");
    });

    // Detener la música después de que termine de reproducirse
    this.backgroundMusic.on('complete', () => {
      this.backgroundMusic.stop();
    });
  }
}




