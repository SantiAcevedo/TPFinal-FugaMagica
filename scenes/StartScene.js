export default class StartScene extends Phaser.Scene {
    constructor() {
      super("startScene");
    }
    Preload() {

        this.load.image("sky", "path/to/sky.png");
    }
  
    create() {
      this.centerX = this.game.config.width / 2;
      this.centerY = this.game.config.height / 2;
  
      // Agregar fondo
      this.add.image(this.centerX, this.centerY, "sky").setScale(2.9);
  
      // Título del juego
      this.add.text(this.centerX, this.centerY - 100, "Mi Juego", {
        fontSize: "64px",
        fill: "#fff",
      }).setOrigin(0.5, 0.5);
  
      // Texto para empezar
      this.add.text(this.centerX, this.centerY + 100, "Haz clic para empezar", {
        fontSize: "32px",
        fill: "#fff",
      }).setOrigin(0.5, 0.5);
  
      // Iniciar el juego al hacer clic
      this.input.on("pointerdown", () => {
        this.scene.start("game");
      });
    }
  }
  