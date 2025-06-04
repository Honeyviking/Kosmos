function leftKeyPressed() {
    if (typeof rocket !== "undefined" && rocket) rocket.x -= 5;
}
function rightKeyPressed() {
    if (typeof rocket !== "undefined" && rocket) rocket.x += 5;
}
function upKeyPressed() {
    if (typeof rocket !== "undefined" && rocket) rocket.y -= 5;
}
function downKeyPressed() {
    if (typeof rocket !== "undefined" && rocket) rocket.y += 5;
}
function spaceKeyPressed() {
    if (typeof rocket === "undefined" || !rocket) return;
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
}