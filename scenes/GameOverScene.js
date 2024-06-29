
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  create() {
    const { width, height } = this.game.config;
    
    // Añadir texto de Game Over
    this.add.text(width / 2, height / 2 - 50, "GAME OVER", {
      fontSize: "64px",
      fill: "#fff"
    }).setOrigin(0.5);
    
    // Añadir opción para reiniciar el juego
    this.add.text(width / 2, height / 2 + 50, "Press SPACE to Restart", {
      fontSize: "32px",
      fill: "#fff"
    }).setOrigin(0.5);
    
    // Añadir evento de teclado para reiniciar el juego
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start("game");
    });
  }
}
