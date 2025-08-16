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
const pixels = 10;
const morePixels = 60;
let swimmerX = 0;
let swimmerY = 0;

// eventlistener on load
window.addEventListener("load", () => {
  ocean.focus();
  if (ocean) {
    // swimmer.style.transform = `translate(${pixels}%, ${pixels}%)`;
    ocean.addEventListener("click", swim);
    ocean.addEventListener("keydown", swim);
    window.addEventListener("resize", nearBorder);
    collisionHandler(swimmer, staticElements);
  }
});

setInterval(() => {
  // console.log(`log this every .10 second`);
  collisionHandler(swimmer, staticElements);
}, 100);

// **************MOVEMENT FUNCTION per click/keypress  *******************
function swim(event) {
  nearBorder();

  // runs when event is click
  if (event.type === "click") {
    const xPosition = event.clientX;
    const yPosition = event.clientY;

    // to target and move elememt from its center
    const imgWidth = swimmer.offsetWidth;
    const imgHeight = swimmer.offsetHeight;

    // swimmerX = xPosition - imgWidth;
    swimmerX = xPosition - imgWidth / 2;
    swimmerY = yPosition - imgHeight / 2;
    // swimmerY = yPosition - imgHeight;

    if (event.target === ocean) {
      // tramsform method
      swimmer.style.transform = `translate(${swimmerX}px,${swimmerY}px)`;
      // position method
      // swimmer.style.left = `${swimmerX}px`;
      // swimmer.style.top = `${swimmerY}px`;

      // console.log(`Swimmer x: ${swimmerX}, y:${swimmerY}`);
    }
  }

  // runs when event is keydown
  if (event.type === "keydown") {
    // position method
    // swimmer.style.left = `${swimmerX}px`;
    // swimmer.style.top = `${swimmerY}px`;
    switch (event.key) {
      case "ArrowUp":
        // position method
        // swimmerY -= pixels;

        // transform method
        swimmer.style.transformOrigin = "center center";
        swimmer.style.transform = `translate(${swimmerX}px,${(swimmerY -=
          pixels)}px) rotate(270deg)`;
        // swimmer.style.transform = `translate(${swimmerX}px,${(swimmerY -=
        //   pixels)}px)`;
        break;
      case "ArrowDown":
        // swimmerY += pixels;
        swimmer.style.transformOrigin = "center center";
        swimmer.style.transform = `translate(${swimmerX}px,${(swimmerY +=
          pixels)}px) rotate(90deg)`;
        // swimmer.style.transform = `translate(${swimmerX}px,${(swimmerY +=
        //   pixels)}px)`;
        break;
      case "ArrowLeft":
        // swimmerX -= pixels;
        swimmer.style.transformOrigin = "center center";
        swimmer.style.transform = `translate(${(swimmerX -=
          pixels)}px,${swimmerY}px) scaleX(-1)`;
        // swimmer.style.transform = `translate(${(swimmerX -=
        //   pixels)}px,${swimmerY}px)`;
        break;
      case "ArrowRight":
        // swimmerX += pixels;
        swimmer.style.transformOrigin = "center center";
        swimmer.style.transform = `translate(${(swimmerX +=
          pixels)}px,${swimmerY}px) rotate(0deg)`;
        // swimmer.style.transform = `translate(${(swimmerX +=
        //   pixels)}px,${swimmerY}px)`;
        break;
      default:
        break;
    }
  }
  collisionHandler(swimmer, staticElements);

  // prevents default browser scrolling
  event.preventDefault();
  // console.log(`Swimmer x: ${swimmerX}, y:${swimmerY}`);
}

// ****************CLICK FUNCTION****************
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

// *************  COLLISION CHECKING FUNCTION  **********************
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

// ************  COLLISION HANDLING FUNCTION  **********************
function collisionHandler(player, npcs) {
  if (collisionChecker(player, npcs)) {
    const playerRect = player.getBoundingClientRect();
    for (const npc of npcs) {
      const npcRect = npc.getBoundingClientRect();

      let centerX, centerY;
      centerX =
        (playerRect.left + playerRect.right) / 2 -
        (npcRect.left + npcRect.right) / 2;
      centerY =
        (playerRect.top + playerRect.bottom) / 2 -
        (npcRect.top + npcRect.bottom) / 2;

      if (centerY * centerY > centerX * centerX) {
        if (centerY > 0) {
          playerRect.top = npcRect.bottom;
          // console.log(`from BOTTOM`);
          // swimmerY -= pixels;
          // player.style.transform = `translate(${swimmerX}px, ${swimmerY}px)`;
          player.style.transformOrigin = "center center";
          player.style.transform = `translate(${swimmerX}px, ${(swimmerY +=
            pixels)}px) rotate(90deg)`;
        } else {
          playerRect.top = npcRect.top - playerRect.bottom;
          // console.log(`from TOP`);
          // swimmerY -= pixels;
          // player.style.transform = `translate(${swimmerX}px, ${swimmerY}px)`;
          player.style.transformOrigin = "center center";
          player.style.transform = `translate(${swimmerX}px, ${(swimmerY -=
            pixels)}px) rotate(90deg)`;
        }
      } else {
        if (centerX > 0) {
          playerRect.left = npcRect.right;
          // console.log(`from RIGHT`);
          // console.log(`vextorX: ${centerX}`);

          // swimmerX += pixels;
          // player.style.transform = `translate(${swimmerX}px, ${swimmerY}px)`;
          player.style.transformOrigin = "center center";
          player.style.transform = `translate(${(swimmerX +=
            pixels)}px, ${swimmerY}px) rotate(90deg)`;
        } else {
          playerRect.left = npcRect.left - playerRect.right;
          // console.log(`from LEFT`);
          // console.log(`vextorX: ${centerX}`);
          // swimmerX -= pixels;
          // player.style.transform = `translate(${swimmerX}px,${swimmerY}px)`;
          player.style.transformOrigin = "center center";
          player.style.transform = `translate(${(swimmerX -=
            pixels)}px,${swimmerY}px) rotate(90deg)`;
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
    swimmer.style.transform = `translate(${(swimmerX +=
      morePixels)}px, ${swimmerY}px) scaleX(1)`;
  } else if (swimmerY < -5) {
    console.log(`Swimmer is near Border`);
    swimmer.style.transformOrigin = "center center";
    swimmer.style.transform = `translate(${swimmerX}px, ${(swimmerY +=
      morePixels)}px) rotate(90deg)`;
  } else if (swimmerX > screenWidth - 70) {
    // console.log(`Swimmer is near Border`);
    swimmer.style.transformOrigin = "center center";
    swimmer.style.transform = `translate(${(swimmerX -=
      morePixels)}px,${swimmerY}px) scaleX(-1)`;
  } else if (swimmerY > screenHeight - 70) {
    swimmer.style.transformOrigin = "center center";
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
