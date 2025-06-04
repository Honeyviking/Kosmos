const app = new PIXI.Application();
const ufoList = [];
let rocket; // <-- Rocket hier deklarieren!
let score = 0;
const scoreText = new PIXI.Text("Score: 0", { fontSize: 24, fill: 0xffffff });
scoreText.x = 10;
scoreText.y = 10;
app.stage.addChild(scoreText);

document.body.appendChild(app.view);

// Startscreen als Container
const startScreen = new PIXI.Container();
app.stage.addChild(startScreen);

// Hintergrund für Startscreen (optional)
const bg = new PIXI.Graphics();
bg.beginFill(0x222244);
bg.drawRect(0, 0, app.screen.width, app.screen.height);
bg.endFill();
startScreen.addChild(bg);

// Titel
const title = new PIXI.Text("KosmosRaider", { fontSize: 48, fill: 0xffffff });
title.anchor.set(0.5);
title.x = app.screen.width / 2;
title.y = 150;
startScreen.addChild(title);

// Start-Button
const startButton = new PIXI.Text("START", {
  fontSize: 36,
  fill: 0x00ff00,
  fontWeight: "bold",
});
startButton.anchor.set(0.5);
startButton.x = app.screen.width / 2;
startButton.y = 300;
startButton.interactive = true;
startButton.buttonMode = true;
startScreen.addChild(startButton);

// Klick-Handler für Start
startButton.on("pointerdown", startGame);

// Spiel-Elemente zunächst verstecken
app.stage.removeChild(scoreText);

// Game Over Screen als Container
const gameOverScreen = new PIXI.Container();
gameOverScreen.visible = false;
app.stage.addChild(gameOverScreen);

// Hintergrund für Game Over (optional)
const gameOverBg = new PIXI.Graphics();
gameOverBg.beginFill(0x222244, 0.9);
gameOverBg.drawRect(0, 0, app.screen.width, app.screen.height);
gameOverBg.endFill();
gameOverScreen.addChild(gameOverBg);

// Game Over Text
const gameOverText = new PIXI.Text("GAME OVER", {
  fontSize: 48,
  fill: 0xff3333,
  fontWeight: "bold",
});
gameOverText.anchor.set(0.5);
gameOverText.x = app.screen.width / 2;
gameOverText.y = 200;
gameOverScreen.addChild(gameOverText);

// Neustart Hinweis
const restartText = new PIXI.Text("Zum Neustart klicken!", {
  fontSize: 28,
  fill: 0xffffff,
});
restartText.anchor.set(0.5);
restartText.x = app.screen.width / 2;
restartText.y = 300;
gameOverScreen.addChild(restartText);

// Klick-Handler für Neustart
gameOverScreen.interactive = true;
gameOverScreen.buttonMode = true;
gameOverScreen.on("pointerdown", restartGame);

// Spielstart-Funktion
function startGame() {
  // Reset
  stopGame(); // <--- ALLE alten Intervalle stoppen!
  score = 0;
  scoreText.text = "Score: 0";
  ufoList.forEach((ufo) => app.stage.removeChild(ufo));
  ufoList.length = 0;
  if (rocket) app.stage.removeChild(rocket);
  gameOverScreen.visible = false;

  startScreen.visible = false;
  app.stage.addChild(scoreText);

  // Rocket initialisieren
  rocket = PIXI.Sprite.from("assets/rocket1.png");
  rocket.x = 350;
  rocket.y = 525;
  rocket.scale.x = 0.3;
  rocket.scale.y = 0.3;
  app.stage.addChild(rocket);

  GAMELOOPJS_START();//Startet den GameLoop

  // UFO-Spawn starten
  gameInterval(function () {
    const ufo = PIXI.Sprite.from("assets/ufo" + random(1, 2) + ".png");
    ufo.x = random(0, 700);
    ufo.y = 25;
    ufo.scale.x = 0.1;
    ufo.scale.y = 0.1;
    app.stage.addChild(ufo);
    ufoList.push(ufo);
    flyDown(ufo, 1);

    waitForCollision(ufo, rocket).then(function () {
      const explo = PIXI.Sprite.from("assets/bang.jpg");
      explo.x = rocket.x;
      explo.y = rocket.y;
      explo.scale.x = 0.1;
      explo.scale.y = 0.1;
      app.stage.addChild(explo);
      app.stage.removeChild(rocket);

      stopGame();
      showGameOver();
    });
  }, 1000);

  // Game Over Screen immer nach vorne holen!
  app.stage.setChildIndex(gameOverScreen, app.stage.children.length - 1);
}

/*
function leftKeyPressed() {
    if (rocket) rocket.x -= 5;
}
function rightKeyPressed() {
    if (rocket) rocket.x += 5;
}
function upKeyPressed() {
    if (rocket) rocket.y -= 5;
}
function downKeyPressed() {
    if (rocket) rocket.y += 5;
}
function spaceKeyPressed() {
    if (!rocket) return;
    const bullet = PIXI.Sprite.from("assets/bullet.png");
    bullet.x = rocket.x + 30;
    bullet.y = rocket.y - 20;
    bullet.scale.x = 0.05;
    bullet.scale.y = 0.05;
    flyUp(bullet);
    app.stage.addChild(bullet);

    waitForCollision(bullet, ufoList).then(function ([bullet, ufo]) {
        const exploUfo = PIXI.Sprite.from("assets/explosion.png");
        exploUfo.x = ufo.x;
        exploUfo.y = ufo.y;
        exploUfo.scale.x = 0.1;
        exploUfo.scale.y = 0.1;
        app.stage.addChild(exploUfo);
        app.stage.removeChild(bullet);
        app.stage.removeChild(ufo);

        score++;
        scoreText.text = "Score: " + score;

        setTimeout(function () {
            app.stage.removeChild(exploUfo);
        }, 1000);
    });
} */

function showGameOver() {
  gameOverScreen.visible = true;
  // Game Over Screen immer nach vorne holen!
  app.stage.setChildIndex(gameOverScreen, app.stage.children.length - 1);
}

// Neustart-Funktion
function restartGame() {
  gameOverScreen.visible = false;
  startGame();
}
