import { gameOptions } from "../utils/gameOptions.js";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  init() {
    this.lastDirection = 'right';
    this.firstMove = true;
    this.platformTouched = false;
    this.maxHeight = 0;
    this.gameOver = false;
    this.score = 0; // Inicializar el puntaje
  }

  create() {
    this.addBackground();
    this.addBackgroundMusic();
    this.platformGroup = this.physics.add.group();
    this.powerUpGroup = this.physics.add.group();
    //this.disappearingPlatformGroup = this.physics.add.group(); // Nuevo grupo de plataformas que desaparecen

    const positionX = this.game.config.width / 2;
    const positionY = this.game.config.height;

    this.platform = this.platformGroup.create(positionX, positionY, "platform");
    this.platform.setScale(0.3, 1);
    this.platform.setImmovable(true);

    this.invisiblePlatform = this.physics.add.sprite(positionX, -50, "platform");
    this.invisiblePlatform.setScale(2, 1);
    this.invisiblePlatform.setImmovable(true);
    this.invisiblePlatform.setVisible(false);

    for (let i = 0; i < 10; i++) {
      let platform = this.platformGroup.create(0, 0, "platform");
      platform.setImmovable(true);
      this.positionInitialPlatform(platform, i);

      if (Phaser.Math.Between(0, 9) === 0) {
        let powerUp = this.powerUpGroup.create(0, 0, "powerup");
        powerUp.setScale(1.5);
        powerUp.setImmovable(true);
        powerUp.y = platform.y - platform.displayHeight / 2 - 20;
        powerUp.x = platform.x;
      }
    }

    // // Crear plataformas que desaparecen
    // for (let i = 0; i < 5; i++) {
    //   let disappearingPlatform = this.disappearingPlatformGroup.create(0, 0, "platform");
    //   disappearingPlatform.setImmovable(true);
    //   this.positionInitialPlatform(disappearingPlatform, i);
    //   disappearingPlatform.setTint(0xff0000); // Color distintivo para las plataformas que desaparecen
    // }

    this.staticPlatform = this.physics.add.sprite(positionX, 1200, "platform");
    this.staticPlatform.setScale(0.4, 0.8);
    this.staticPlatform.setImmovable(true);

    //colision plataforma inicial y jugador

    this.physics.add.collider(this.staticPlatform, this.player);

    this.player = this.physics.add.sprite(positionX, this.game.config.height - 320, "player");
    this.player.setScale(1.5);
    this.player.setGravityY(gameOptions.gameGravity);

    this.physics.add.collider(this.platformGroup, this.player, null, this.playerCanThrow, this);
    this.physics.add.collider(this.invisiblePlatform, this.player);

    // Colisionador para plataformas que desaparecen
    //this.physics.add.collider(this.disappearingPlatformGroup, this.player, this.handleDisappearingPlatform, null, this);

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

    this.physics.add.overlap(this.player, this.powerUpGroup, this.collectPowerUp, null, this);

    this.textTimer = this.add.text(10, 10, "0", {
      fontSize: "32px",
      fill: "#fff",
    });

    this.textScore = this.add.text(this.game.config.width / 2, 10, "Metros: 0", {
      fontSize: "32px",
      fill: "#fff",
    }).setOrigin(-0.8, 0);

    this.textFirstMove = this.add.text(positionX, 500, "Presiona ESPACIO para JUGAR!", {
      fontSize: "32px",
      fill: "#fff",
    }).setOrigin(0.5, 0);
  }

  update() {

    this.moveParallax(); // Asegúrate de llamar esta función en tu ciclo de actualización
    
    if (this.spacebar.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-gameOptions.jumpForce);
    }

    if (!this.player.body.touching.down) {
      if (this.keyA.isDown) {
        console.log("prueba")
        this.player.anims.play("jumpLeft")
      } else if (this.keyD.isDown) {
        this.player.anims.play("jumpRight")
      }
    }

    if (this.player.y < this.game.config.height - 130) {
      this.staticPlatform.destroy();
    }
    this.platformGroup.getChildren().forEach(function (platform) {
      if (platform.getBounds().top > this.game.config.height) {
        this.positionPlatform(platform);

        let powerUp = this.powerUpGroup.getFirstDead();
        if (powerUp) {
          powerUp.setActive(true).setVisible(true);
          powerUp.y = platform.y - platform.displayHeight / 2 - 20;
          powerUp.x = platform.x;
        }
      }

      if (platform.y > this.player.y && !platform.passed) {
        platform.passed = true;
        this.increaseScore();
      }
    }, this);

    if (this.player.body.touching.none) {
      this.platformTouched = false;
    }

    if (this.player.y > this.game.config.height) {
      this.backgroundMusic.stop(); // Detener la música de fondo
      this.scene.start("GameOverScene", { score: this.score, time: this.textTimer.text });
      }

    if (this.keyA.isDown) {
      this.player.setVelocityX(-gameOptions.heroSpeed);
    } else if (this.keyD.isDown) {
      this.player.setVelocityX(gameOptions.heroSpeed);
    } else {
      this.player.setVelocityX(0);
    }

  }

  playerCanThrow(player, platform) {
    if (player.body.velocity.y >= 0 && player.body.bottom <= platform.body.top + 10) {
      return true;
    } else {
      return false;
    }
  }

  handleDisappearingPlatform(player, platform) {
    platform.disableBody(true, true); // Desactivar la plataforma cuando el jugador la toque
  }

  addBackground() {
    // Centra el fondo estático
    this.centerX = this.game.config.width / 2;
    this.centerY = this.game.config.height / 2;
  
    // Configura el tileSprite para el efecto de parallax
    this.sky = this.add.tileSprite(this.centerX, this.centerY, this.game.config.width, this.game.config.height, "sky");
    this.sky.setScale(2.9);
    this.sky.setOrigin(0.4 , 0.4); // Asegura que el origen del tileSprite esté centrado
  
    this.parallaxLayers = [
      {
        speed: 0.2,
        sprite: this.sky,
      },
    ];
  }
  
  

  moveParallax() {
    this.parallaxLayers.forEach((layer) => {
      layer.sprite.tilePositionY -= layer.speed;
    });
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

  addBackgroundMusic() {
    this.backgroundMusic = this.sound.add('mainsong', { loop: true, volume: 0.5 });
    this.backgroundMusic.play();
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
    const marginVertical = 80;
    const marginHorizontal = 80;

    platform.y = this.getHighestPlatform() - marginVertical - this.randomValue(gameOptions.platformVerticalDistanceRange);
    platform.x = Phaser.Math.Clamp(
      this.game.config.width / 2 + this.randomValue(gameOptions.platformHorizontalDistanceRange) * Phaser.Math.RND.sign(),
      marginHorizontal,
      this.game.config.width - marginHorizontal
    );
    platform.displayWidth = gameOptions.platformFixedLength;
    platform.passed = false; // Reiniciar la marca de plataforma pasada
  }

  positionInitialPlatform(platform, index) {
    const marginVertical = 80;
    const marginHorizontal = 80;

    platform.y = this.game.config.height - marginVertical - (index * this.randomValue(gameOptions.platformVerticalDistanceRange));
    platform.x = Phaser.Math.Clamp(
      this.game.config.width / 2 + this.randomValue(gameOptions.platformHorizontalDistanceRange) * Phaser.Math.RND.sign(),
      marginHorizontal,
      this.game.config.width - marginHorizontal
    );

    platform.displayWidth = gameOptions.platformFixedLength;
    platform.passed = false; // Inicializar la marca de plataforma pasada
  }

  addTimer() {
    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });
  }

  updateTimer() {
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

  increaseScore() {
    this.score += 10; // Ajusta el valor según la cantidad de puntos deseada
    this.textScore.setText("Metros: " + this.score);
  }
}















