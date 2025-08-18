// **********************************************************************
// TO-DO-LIST
// 1. create a boundary border check so swimmer cant go beyond viewport
// 2. check, fix or change computation on BOTTOM in collisionHandling()
// 3. create a window screen how the game works
// 4. make the obstacles move (optional)
// 5. make the obstacles move in random distance (pixels, etc) (optional)
// 6. add if else statement on click to check for existing elements
// **************************************************************************************************************

const swimmer = document.getElementById("swimmer-box");
const ocean = document.getElementById("game-container");
const sharky = document.getElementById("shark-box");
const ship = document.getElementById("ship-box");
const kraken = document.getElementById("kraken-box");
const staticElements = document.querySelectorAll(".npc-box");
const welcomeDialog = document.getElementById("welcome-dialog");
const pixels = 5;
const morePixels = 60;
let swimmingRight = false;
let swimmingLeft = false;
let swimmingUp = false;
let swimmingDown = false;
let swimmerX = 0;
let swimmerY = 0;

// eventlistener on load
window.addEventListener("load", () => {
  welcomeDialog.showModal();
  ocean.focus();
  if (ocean) {
    window.addEventListener("resize", nearBorder);
    ocean.addEventListener("click", swim);
    ocean.addEventListener("keydown", swim);
    ocean.addEventListener("keyup", swim);
    speedBoost();
  }
});

//collision handling per .10 seconds
setInterval(() => {
  // console.log(`log this every .10 second`);
  collisionHandler(swimmer, staticElements);
  nearBorder();
}, 100);

// MOVEMENT FUNCTION per click/keypress
function swim(event) {
  // nearBorder();

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
  switch (event.key) {
    case "ArrowUp":
      swimmingUp = true;
      // swimmer.style.transformOrigin = "center center";
      // swimmer.style.transform = `translate(${swimmerX}px,${(swimmerY -=
      //   pixels)}px) rotate(270deg)`;
      break;
    case "ArrowDown":
      swimmingDown = true;
      // swimmer.style.transformOrigin = "center center";
      // swimmer.style.transform = `translate(${swimmerX}px,${(swimmerY +=
      //   pixels)}px) rotate(90deg)`;
      break;
    case "ArrowLeft":
      swimmingLeft = true;
      // swimmer.style.transformOrigin = "center center";
      // swimmer.style.transform = `translate(${(swimmerX -=
      //   pixels)}px,${swimmerY}px) scaleX(-1)`;
      break;
    case "ArrowRight":
      swimmingRight = true;
      // swimmer.style.transformOrigin = "center center";
      // swimmer.style.transform = `translate(${(swimmerX +=
      //   pixels)}px,${swimmerY}px) rotate(0deg)`;
      break;
    default:
      break;
  }
}

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
      console.log(player.id, `collides with`, npc.id);
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

// *************  CONTAINER BORDER CHECKING FUNCTION  **********************
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
    console.log(`Swimmer is near Border`);
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

// *************  COLLISION CHECKER FUNCTION  **********************
/* function collisionChecker(player, npcs) {
  const playerRect = player.getBoundingClientRect();
  for (const npc of npcs) {
    const npcRect = npc.getBoundingClientRect();
    if (
      playerRect.left < npcRect.right &&
      playerRect.right > npcRect.left &&
      playerRect.top < npcRect.bottom &&
      playerRect.bottom > npcRect.top
    ) {
      console.log(player.id, `hits`, npc.id);
      return true;
    }
    continue;
  }
  return false;
} */

// ***************  COLLISION HANDLER FUNCTION  *********************
/* function collisionHandler(player, npcs) {
  if (collisionChecker(player, npcs)) {
    const playerRect = player.getBoundingClientRect();
    for (const npc of npcs) {
      const npcRect = npc.getBoundingClientRect();

      // finds the smallest overlap on X,Y axis
      // bottom - top, right - left
      // Math.abs()
      const overlapX = Math.min(
        Math.abs(playerRect.right - npcRect.left),
        Math.abs(npcRect.right - playerRect.left)
      );

      // console.log(
      //   `PlayerRIGHT: ${playerRect.right} - NpcLEFT: ${npcRect.left}`
      // );
      // console.log(
      //   `NpcRIGHT: ${npcRect.right} - PlayerLEFT: ${playerRect.left}`
      // );

      const overlapY = Math.min(
        Math.abs(playerRect.top - npcRect.bottom),
        Math.abs(npcRect.top - playerRect.bottom)
      );

      // console.log(
      //   `PlayerTOP: ${playerRect.top} - NpcBOTTOM: ${npcRect.bottom}`
      // );
      // console.log(
      //   `NpcTOP: ${npcRect.top} - PlayerBOTTOM: ${playerRect.bottom}`
      // );

      // console.log(`OverlapX: ${overlapX}, Overlap Y: ${overlapY}`);
      // console.log(overlapY);

      if (overlapX < overlapY) {
        // console.log(`X < Y : HORIZONTAL COLLISION`);
        // it's a horixontal collision
        if (playerRect.left < npcRect.left) {
          console.log(`from the LEFT`);
          // the hit was from the left
          swimmerX -= pixels;
          // player.style.transform = `translate(${(swimmerX -=
          //   pixels)}px,${swimmerY}px)`;
          player.style.transform = `translate(${(swimmerX -=
            pixels)}px,${swimmerY}px) scaleX(-1)`;
        } else {
          console.log(`from the RIGHT`);
          // the hit is from the right
          swimmerX += pixels;
          player.style.transform = `translate(${swimmerX}px, ${swimmerY}px)`;
          // player.style.transform = `translate(${swimmerX}px, ${swimmerY}px) scaleX(1)`;
        }
      } else {
        // console.log(`X > Y : VERTICAL COLLISION`);
        // it's a vertical collision
        if (playerRect.top < npcRect.bottom) {
          console.log(`from the TOP`);
          // its a hit from the top
          swimmerY -= pixels;
          // player.style.transform = `translate(${swimmerX}px, ${swimmerY}px)`;
          player.style.transform = `translate(${swimmerX}px, ${swimmerY}px) rotate(360deg)`;
        } else {
          // ********COMPUTATION HERE IS OFF*****
          // movements are not blocked*******
          console.log(`from the BOTTOM`);
          // its a hit from the bottom
          swimmerY += pixels;
          // player.style.transform = `translate(${swimmerX}px, ${swimmerY}px)`;
          player.style.transform = `translate(${swimmerX}px, ${swimmerY}px) rotate(360deg)`;
        }
      }
    }
  }
} */

// **************** CLICK FUNCTION ****************
/* function whenClicking(event) {
  if (event.type === "click") {
    const xPosition = event.clientX;
    const yPosition = event.clientY;
    const areaClicked = document.elementFromPoint(xPosition, yPosition);
    const imgWidth = swimmer.offsetWidth;
    const imgHeight = swimmer.offsetHeight;

    swimmerX = xPosition - imgWidth / 2;
    swimmerY = yPosition - imgHeight / 2;

    if (event.target === ocean) {
      // ***

      // tramsform method
      swimmer.style.transform = `translate(${swimmerX}px,${swimmerY}px)`;
      // position method
      // swimmer.style.left = `${swimmerX}px`;
      // swimmer.style.top = `${swimmerY}px`;

      // console.log(`Swimmer x: ${swimmerX}, y:${swimmerY}`);
      // ***
    }
    console.log(event.target);
  }
} */
