// variable declaration
const swimmer = document.getElementById("swimmer");
const ocean = document.getElementById("game-container");
const staticElements = document.querySelectorAll(".npc");
const welcomeDialog = document.getElementById("welcome-dialog");
const statusDialog = document.getElementById("status-dialog");
const statusContainer = document.getElementById("status-container");
const startBtn = document.getElementById("start-btn");
const pixels = 5;
const morePixels = 60;
let stopSwimming = false;
let swimmingRight = false;
let swimmingLeft = false;
let swimmingUp = false;
let swimmingDown = false;
let swimmerX = 0;
let swimmerY = 0;

// eventlistener on window load
window.addEventListener("load", () => {
  welcomeDialog.showModal();
  startBtn.addEventListener("click", () => {
    if (ocean) {
      ocean.focus();
      window.addEventListener("resize", nearBorder);
      ocean.addEventListener("click", swim);
      ocean.addEventListener("keydown", swim);
      ocean.addEventListener("keyup", swim);
      speedBoost();
    }
  });
});

//collision handling per .10 seconds
setInterval(() => {
  // console.log(`log this every .10 second`);
  collisionHandler(swimmer, staticElements);
  nearBorder();
}, 100);

// show collision with npcs status msg function
const showStatus = (player, npc) => {
  if (npc.classList.contains("npc-box")) {
    const statusMessage = document.createElement("p");
    statusMessage.textContent = `${player.id} Chad hits the ${npc.id}`;
    statusDialog.append(statusMessage);
  }
  statusDialog.scrollTo({
    top: statusDialog.scrollHeight,
    behavior: "smooth",
  });
};

// MOVEMENT FUNCTION per click/keypress
function swim(event) {
  // nearBorder();
  // showStatus(swimmer, staticElements);

  if (event.type === "click") {
    whenClicking(event);
  }
  if (event.type === "keydown") {
    whenKeyPressing(event);
  }
  if (event.type === "keyup") {
    noKeyPress(event);
  }
  // collisionHandler(swimmer, staticElements);

  // prevents default browser scrolling
  event.preventDefault();
  // console.log(`Swimmer x: ${swimmerX}, y:${swimmerY}`);
}

// onClick event function
function whenClicking(event) {
  const xPosition = event.clientX;
  const yPosition = event.clientY;

  // to target and move elememt from its center
  const imgWidth = swimmer.offsetWidth;
  const imgHeight = swimmer.offsetHeight;

  swimmerX = xPosition - imgWidth / 2;
  swimmerY = yPosition - imgHeight / 2;

  if (event.target === ocean) {
    swimmer.style.transform = `translate(${swimmerX}px,${swimmerY}px)`;
  }
}

// onKeyPress event function
function whenKeyPressing(event) {
  // console.log(event.key);

  switch (event.key) {
    case "ArrowUp":
      swimmingUp = true;
      break;
    case "ArrowDown":
      swimmingDown = true;
      break;
    case "ArrowLeft":
      swimmingLeft = true;
      break;
    case "ArrowRight":
      swimmingRight = true;
    default:
      break;
  }
}

// when no key is pressed function
function noKeyPress(event) {
  switch (event.key) {
    case "ArrowUp":
      swimmingUp = false;
      break;
    case "ArrowDown":
      swimmingDown = false;
      break;
    case "ArrowLeft":
      swimmingLeft = false;
      break;
    case "ArrowRight":
      swimmingRight = false;
      break;
    default:
      break;
  }
}

// adds speed on keypress event function
function speedBoost() {
  if (swimmingUp) {
    // swimmerY -= pixels;
    swimmer.style.transformOrigin = "center center";
    swimmer.style.transform = `translate(${swimmerX}px,${(swimmerY -=
      pixels)}px) rotate(270deg)`;
  }
  if (swimmingDown) {
    // swimmerY += pixels;
    swimmer.style.transformOrigin = "center center";
    swimmer.style.transform = `translate(${swimmerX}px,${(swimmerY +=
      pixels)}px) rotate(90deg)`;
  }
  if (swimmingLeft) {
    // swimmerX -= pixels;
    swimmer.style.transformOrigin = "center center";
    swimmer.style.transform = `translate(${(swimmerX -=
      pixels)}px,${swimmerY}px) scaleX(-1)`;
  }
  if (swimmingRight) {
    // swimmerX += pixels;
    // swimmer.style.transformOrigin = "center center";
    swimmer.style.transform = `translate(${(swimmerX +=
      pixels)}px,${swimmerY}px)`;
  }
  // smooth animation on keypress
  requestAnimationFrame(speedBoost);
}

// Collision checking function
function collisionChecker(player, npcs) {
  const playerRect = player.getBoundingClientRect();
  for (const npc of npcs) {
    const npcRect = npc.getBoundingClientRect();
    if (
      playerRect.left < npcRect.right &&
      playerRect.right > npcRect.left &&
      playerRect.top < npcRect.bottom &&
      playerRect.bottom > npcRect.top
    ) {
      // console.log(player.id, `collides with`, npc.id);
      showStatus(player, npc);
      return true;
    }
    continue;
  }
  return false;
}

// Collision handling function
function collisionHandler(player, npcs) {
  if (collisionChecker(player, npcs)) {
    const playerRect = player.getBoundingClientRect();
    for (const npc of npcs) {
      const npcRect = npc.getBoundingClientRect();

      // calculates distance between player and npc centers
      let centerX, centerY;
      centerX =
        (playerRect.left + playerRect.right) / 2 -
        (npcRect.left + npcRect.right) / 2;
      centerY =
        (playerRect.top + playerRect.bottom) / 2 -
        (npcRect.top + npcRect.bottom) / 2;

      // formula works only on perfect square elements comparison
      // checks which direction the player is coming from
      if (centerY * centerY > centerX * centerX) {
        if (centerY > 0) {
          // player is at the BOTTOM
          playerRect.top = npcRect.bottom;
          // console.log(`from BOTTOM`);
          player.style.transformOrigin = "center center";
          // player.style.transform = `translate(${swimmerX}px, ${(swimmerY +=
          //   pixels)}px) rotate(90deg)`;
          player.style.transform = `translate(${swimmerX}px, ${(swimmerY +=
            pixels)}px) rotate(360deg)`;
        } else {
          // player is at the TOP
          playerRect.top = npcRect.top - playerRect.bottom;
          // console.log(`from TOP`);
          player.style.transformOrigin = "center center";
          // player.style.transform = `translate(${swimmerX}px, ${(swimmerY -=
          //   pixels)}px) rotate(90deg)`;
          player.style.transform = `translate(${swimmerX}px, ${(swimmerY -=
            pixels)}px) rotate(360deg)`;
        }
      } else {
        if (centerX > 0) {
          // player is on the RIGHT
          playerRect.left = npcRect.right;
          // console.log(`from RIGHT`);
          player.style.transformOrigin = "center center";
          player.style.transform = `translate(${(swimmerX +=
            pixels)}px, ${swimmerY}px) rotate(270deg)`;
          // ****************DONT CHANGE ROTATION 270deg
        } else {
          // player is on the LEFT
          playerRect.left = npcRect.left - playerRect.right;
          // console.log(`from LEFT`);
          player.style.transformOrigin = "center center";
          // player.style.transform = `translate(${(swimmerX -=
          //   pixels)}px,${swimmerY}px) rotate(90deg)`;
          player.style.transform = `translate(${(swimmerX -=
            pixels)}px,${swimmerY}px) scaleX(-1)`;
        }
      }
    }
  }
}

// container border checker function
function nearBorder() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  if (swimmerX < 0) {
    // console.log(`Swimmer is near Border`);
    swimmer.style.transformOrigin = "center center";
    // swimmer.style.transform = `translate(${(swimmerX +=
    //   morePixels)}px, ${swimmerY}px) scaleX(1)`;
    swimmer.style.transform = `translate(${(swimmerX +=
      morePixels)}px, ${swimmerY}px) rotate(270deg)`;
  } else if (swimmerY < -5) {
    // console.log(`Swimmer is near Border`);
    swimmer.style.transformOrigin = "center center";
    // swimmer.style.transform = `translate(${swimmerX}px, ${(swimmerY +=
    //   morePixels)}px) rotate(90deg)`;
    swimmer.style.transform = `translate(${swimmerX}px, ${(swimmerY +=
      morePixels)}px) rotate(270deg)`;
  } else if (swimmerX > screenWidth - 70) {
    // console.log(`Swimmer is near Border`);
    swimmer.style.transformOrigin = "center center";
    // swimmer.style.transform = `translate(${(swimmerX -=
    //   morePixels)}px,${swimmerY}px) scaleX(-1)`;
    swimmer.style.transform = `translate(${(swimmerX -=
      morePixels)}px,${swimmerY}px) rotate(270deg)`;
  } else if (swimmerY > screenHeight - 70) {
    swimmer.style.transformOrigin = "center center";
    // swimmer.style.transform = `translate(${swimmerX}px, ${(swimmerY -=
    //   morePixels)}px) rotate(270deg)`;
    swimmer.style.transform = `translate(${swimmerX}px, ${(swimmerY -=
      morePixels)}px) rotate(270deg)`;
  } else {
    // console.log(`Just keep swimming`);
    return;
  }
}
