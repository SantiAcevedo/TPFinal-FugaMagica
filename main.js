import Game from "./scenes/Game.js";
import Preload from "./scenes/Preload.js";


const config = {
  type: Phaser.AUTO,
  width: 750,
  height: 1334,
  backgroundColor: 0x444444,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [Preload, Game],
};

window.game = new Phaser.Game(config);
