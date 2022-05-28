function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}
function displayResult(winner) {
  document.querySelector("#display-result").style.display = "flex";
  document.querySelector("#display-result").innerHTML = winner;
}
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  if (player.health === enemy.health) {
    displayResult("Draw");
  } else if (player.health > enemy.health) {
    displayResult("Player 1 WINS");
  } else if (player.health < enemy.health) {
    displayResult("Player 2 WINS");
  }
}
function decreaseTimer() {
  if (timer >= 0) {
    document.querySelector("#timer").innerHTML = timer;
    timer--;
    timerId = setTimeout(decreaseTimer, 1000);
  } else determineWinner({ player, enemy, timerId });
}
