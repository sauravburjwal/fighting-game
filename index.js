const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
let timer = 60;
let timerId;
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});
const player = new Fighter({
  name: "Mack",
  position: {
    x: 124,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
  color: "red",
});
const enemy = new Fighter({
  name: "Kenji",
  position: {
    x: 850,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take Hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -175,
      y: 50,
    },
    width: 175,
    height: 50,
  },
  color: "blue",
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

decreaseTimer();
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(255,255,255,0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height - 96);
  player.update();
  enemy.update();

  player.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a" && player.position.x > 30) {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (
    keys.d.pressed &&
    player.lastKey === "d" &&
    player.position.x < 954
  ) {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  enemy.velocity.x = 0;
  if (
    keys.ArrowLeft.pressed &&
    enemy.lastKey === "ArrowLeft" &&
    enemy.position.x > 30
  ) {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (
    keys.ArrowRight.pressed &&
    enemy.lastKey === "ArrowRight" &&
    enemy.position.x < 954
  ) {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }
  //jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //detect for collision
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    player.isAttacking = false;
    if (!player.dead) {
      enemy.takeHit();
    }
  }
  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    enemy.isAttacking = false;
    if (!enemy.dead) {
      player.takeHit();
    }
  }

  //if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }
  if (player.health <= 0) {
    determineWinner({ player, enemy, timerId });
    player.switchSprite("death");
  }
  if (enemy.health <= 0) {
    determineWinner({ player, enemy, timerId });
    enemy.switchSprite("death");
  }
}
animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead && timer >= 0) {
    switch (event.key) {
      case "a":
        player.lastKey = "a";
        keys.a.pressed = true;
        break;
      case "d":
        player.lastKey = "d";
        keys.d.pressed = true;
        break;
      case "w":
        if (player.position.y > canvas.height - player.height + gravity - 108) {
          player.velocity.y = -20;
        }
        break;
      case " ":
        player.attack();
        break;
    }
  }
  if (!enemy.dead && timer >= 0) {
    switch (event.key) {
      case "ArrowLeft":
        enemy.lastKey = "ArrowLeft";
        keys.ArrowLeft.pressed = true;
        break;
      case "ArrowRight":
        enemy.lastKey = "ArrowRight";
        keys.ArrowRight.pressed = true;
        break;
      case "ArrowUp":
        if (enemy.position.y > canvas.height - enemy.height + gravity - 108)
          enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
  }
});
