import { gameOptions } from "../utils/gameOptions.js";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  init() {
     this.lastDirection = 'right'; // Nueva propiedad para rastrear la última dirección
    this.firstMove = true;
    this.platformTouched = false;
    this.maxHeight = 0; // Variable para almacenar la altura máxima alcanzada
  }

  create() {
    this.addBackground();
    this.platformGroup = this.physics.add.group();
    this.powerUpGroup = this.physics.add.group(); // Grupo de power-ups

    const positionX = this.game.config.width / 2;
    const positionY = this.game.config.height * gameOptions.firstPlatformPosition;

    this.platform = this.platformGroup.create(positionX, positionY, "platform");
    this.platform.setScale(0.3, 1);
    this.platform.setImmovable(true);

    // Crear las plataformas iniciales dentro de la pantalla
    for (let i = 0; i < 15; i++) {
      let platform = this.platformGroup.create(0, 0, "platform");
      platform.setImmovable(true);
      this.positionInitialPlatform(platform, i);

      // Posicionar un power-up aleatoriamente sobre algunas plataformas
      if (Phaser.Math.Between(0, 9) === 0) { // 10% de probabilidad de que aparezca un power-up
        let powerUp = this.powerUpGroup.create(0, 0, "powerup");
        powerUp.setScale(1.5);
        powerUp.setImmovable(true);
        powerUp.y = platform.y - platform.displayHeight / 2 - 20; // Posicionar el power-up sobre la plataforma
        powerUp.x = platform.x;
      }
    }

    // Crear plataforma estática en la parte inferior de la pantalla
    this.staticPlatform = this.physics.add.sprite(positionX, this.game.config.height - 140, "platform");
    this.staticPlatform.setScale(0.4, 0.8);
    this.staticPlatform.setImmovable(true);

    //plataforma estatica
    this.physics.add.collider(this.staticPlatform, this.player)

    // Crear el jugador en la parte inferior de la pantalla, sobre la plataforma estática
    this.player = this.physics.add.sprite(positionX, this.game.config.height - 320, "player");
    this.player.setScale(1.5);
    this.player.setGravityY(gameOptions.gameGravity);

    // Crear enemigo
    //this.enemy = this.physics.add.sprite(positionX, this.game.config.height - 100, "enemy");
    //this.enemy.setScale(2);

    // Colisionador entre jugador y plataformas usando playerCanThrow
    this.physics.add.collider(this.platformGroup, this.player, null, this.playerCanThrow, this);

    // Definir la animación de salto del jugador
    this.anims.create({
      key: 'jumpLeft',
      frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
      frameRate: 8,
      repeat: 0
    });

    this.anims.create({
      key: 'jumpRight',
      frames: this.anims.generateFrameNumbers('player', { start: 2, end: 0 }),
      frameRate: 8,
      repeat: 0
    });

    // Configurar evento para la barra espaciadora
    this.input.keyboard.on('keydown-SPACE', function () {
      if (this.firstMove) {
        this.firstMove = false;
        this.addTimer();
        this.textFirstMove.setText("");
        this.platformGroup.setVelocityY(gameOptions.platformSpeed);
      }
    }, this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Colisionadores
    this.physics.add.overlap(this.player, this.powerUpGroup, this.collectPowerUp, null, this); // Colisionador para recoger power-ups

    // Textos
    this.textTimer = this.add.text(10, 10, "0", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.textDistance = this.add.text(this.game.config.width - 10, 10, "0 m", {
      fontSize: "32px",
      fill: "#fff",
    }).setOrigin(1, 0);

    // this.textScore = this.add.text(this.game.config.width - 10, 50, "Score: 0", {
    //   fontSize: "32px",
    //   fill: "#fff",
    // }).setOrigin(1, 0);

    this.textFirstMove = this.add.text(positionX, 500, "Presiona ESPACIO para JUGAR!", {
      fontSize: "32px",
      fill: "#fff",
    }).setOrigin(0.5, 0);
  }

  update() {
    if (this.spacebar.isDown && this.player.body.touching.down){
      this.player.setVelocityY(-gameOptions.jumpForce);
    }

    if(!this.player.body.touching.down){
      if (this.keyA.isDown){ 
        console.log("prueba")
        this.player.anims.play("jumpLeft")
      }
      else if (this.keyD.isDown){ 
        this.player.anims.play("jumpRight")
      }
    }

    if (this.player.y < this.game.config.height - 130) {
      this.staticPlatform.destroy();
    }
    this.platformGroup.getChildren().forEach(function (platform) {
      if (platform.getBounds().top > this.game.config.height) {
        this.positionPlatform(platform);

        // Reposicionar el power-up si está fuera de la pantalla
        let powerUp = this.powerUpGroup.getFirstDead();
        if (powerUp) {
          powerUp.setActive(true).setVisible(true);
          powerUp.y = platform.y - platform.displayHeight / 2 - 20;
          powerUp.x = platform.x;
        }
      }
    }, this);

    if (this.player.body.touching.none) {
      this.platformTouched = false;
    }

    if (this.player.y > this.game.config.height) {
      this.scene.start("game");
    }

    if (this.keyA.isDown) {
      this.player.setVelocityX(-gameOptions.heroSpeed);
    } else if (this.keyD.isDown) {
      this.player.setVelocityX(gameOptions.heroSpeed);
    } else {
      this.player.setVelocityX(0);
    }

    // Calcular la distancia recorrida basada en la altura máxima alcanzada
    if (!this.firstMove) {
      const currentHeight = this.game.config.height - this.player.y;
      if (currentHeight > this.maxHeight) {
        this.maxHeight = currentHeight;
        this.textDistance.setText((this.maxHeight / 10).toFixed(0) + " m"); // 10 píxeles = 1 metro (ajusta según tu escala)
      }
    }
  }

  playerCanThrow(player, platform) {
    if (player.body.velocity.y >= 0 && player.body.bottom <= platform.body.top + 10) {
      return true;
    } else {
      return false;
    }
  }

  addBackground() {
    this.centerX = this.game.config.width / 2;
    this.centerY = this.game.config.height / 2; 
    this.background = this.add.image(this.centerX, this.centerY, "sky").setScale(2.9);
  }

  movePlayer(e) {
    const isClickedRight = e.x > this.game.config.width / 2;
    const speedX = gameOptions.heroSpeed * (isClickedRight ? 1 : -1);
    this.player.setVelocityX(speedX);

    if (this.firstMove) {
      this.firstMove = false;
      this.addTimer();
      this.textFirstMove.setText("");
      this.platformGroup.setVelocityY(gameOptions.platformSpeed);
    }
  }

  stopPlayer() {
    this.player.setVelocityX(0);
  }

  randomValue(a) {
    return Phaser.Math.Between(a[0], a[1]);
  }

  getHighestPlatform() {
    let highestPlatform = this.game.config.height;
    const hijos = this.platformGroup.getChildren();
    
    hijos.forEach(function (platform) {
      highestPlatform = Math.min(highestPlatform, platform.y);
    });
    return highestPlatform;
  }

  positionPlatform(platform) {
    const marginVertical = 50; // margen mínimo vertical entre plataformas
    const marginHorizontal = 50; // margen mínimo horizontal entre plataformas

    platform.y = this.getHighestPlatform() - marginVertical - this.randomValue(gameOptions.platformVerticalDistanceRange);
    platform.x = Phaser.Math.Clamp(
      this.game.config.width / 2 + this.randomValue(gameOptions.platformHorizontalDistanceRange) * Phaser.Math.RND.sign(),
      marginHorizontal,
      this.game.config.width - marginHorizontal
    );
    platform.displayWidth = gameOptions.platformFixedLength;
  }

  positionInitialPlatform(platform, index) {
    const marginVertical = 50; // margen mínimo vertical entre plataformas
    const marginHorizontal = 50; // margen mínimo horizontal entre plataformas

    platform.y = this.game.config.height - marginVertical - (index * this.randomValue(gameOptions.platformVerticalDistanceRange));
    platform.x = Phaser.Math.Clamp(
      this.game.config.width / 2 + this.randomValue(gameOptions.platformHorizontalDistanceRange) * Phaser.Math.RND.sign(),
      marginHorizontal,
      this.game.config.width - marginHorizontal
    );
    platform.displayWidth = gameOptions.platformFixedLength;
  }

  addTimer() {
    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  updateTimer(){
    this.textTimer.setText(parseInt(this.textTimer.text) + 1);
  }

  // handleCollision(player, platform) {
  //   if (!this.platformTouched) {
  //     this.platformTouched = true;
  //     this.score += 1;
  //     this.textScore.setText("Score: " + this.score);
  //   }
  // }

  collectPowerUp(player, powerUp) {
    powerUp.disableBody(true, true); // Desactivar y ocultar el power-up

    // Aplicar impulso hacia arriba
    this.player.setVelocityY(-gameOptions.jumpForce * 1.5); // Ajusta el valor según la fuerza del impulso deseada
  }
}














