// 🚀 Tic-Tac-Toe Game Script
// Developer: Ashutosh

// 🌐 DOM elements for various pages
const landingPage = document.querySelector(".landing-page");
const difficultyPage = document.querySelector(".difficulty-page");
const boardPage = document.querySelector(".board-page");
const scorePage = document.querySelector(".score-page");

// 🎮 Game board elements
const boards = boardPage.querySelectorAll(".board div");
const turnIndicator = boardPage.querySelector("#turn img");

// 🔄 Initial configuration
let selectedMark = "cross";
let xTurn = true;
let aiTurn = false;
let xScore = 0;
let oScore = 0;
let tieScore = 0;

// 🎯 Set the selected mark visually
const setSelectedMark = (id) => {
  const selectedAnimationElem = landingPage.querySelector(".marks .selected");
  const positionMap = {
    cross: ".46rem",
    naught: "10.15rem",
  };

  selectedAnimationElem.style.left = positionMap[id];
  selectedMark = id;
  aiTurn = id === "naught" ? true : false;
};

// 🔄 Handle mark selection animation
const markAnimation = () => {
  const marks = landingPage.querySelectorAll(".mark");
  marks.forEach((mark) => {
    mark.addEventListener("click", () => {
      marks.forEach((mark) => {
        mark.classList.remove("selected-mark");
        mark.querySelector("svg path").setAttribute("fill", "#a8bfc9");
      });

      setSelectedMark(mark.id);

      mark.classList.add("selected-mark");
      landingPage
        .querySelector(".selected-mark svg path")
        .setAttribute("fill", "#1a2a33");
    });
  });
};

// 🔄 Toggle between landing and difficulty pages
const toggleDifficultyPage = () => {
  const vsCpuBtn = landingPage.querySelector("#vs-cpu");
  const backBtn = difficultyPage.querySelector(".back-btn");

  vsCpuBtn.addEventListener("click", () => {
    landingPage.style.top = "-100vh";
    difficultyPage.style.top = "50%";
  });

  backBtn.addEventListener("click", () => {
    difficultyPage.style.top = "-100vh";
    landingPage.style.top = "50%";
  });
};

// 🔙 Event listeners for navigating back to the landing page
const backToLandingPageListeners = () => {
  const logos = document.querySelectorAll(".logo-img");
  const quitBtn = scorePage.querySelector("#quit-btn");

  const backToLandingPage = () => {
    landingPage.style.top = "50%";
    boardPage.style.top = "-100vh";
    difficultyPage.style.top = "-100vh";
    scorePage.style.top = "-100vh";
  };

  logos.forEach((logo) =>
    logo.addEventListener("click", () => backToLandingPage())
  );
  quitBtn.addEventListener("click", () => backToLandingPage());
};

// 🎮 Start a game against another player
const playVsPlayer = () => {
  const vsPlayerBtn = landingPage.querySelector("#vs-player");

  vsPlayerBtn.addEventListener("click", () => {
    landingPage.style.top = "-100vh";
    boardPage.style.top = "50%";

    resetBoard();
    resetValues();
    playMove("Player 1", "Player 2");
    updateTitle("p1", "p2");
  });
};

// 🎮 Start a game against the CPU
const playVsCpu = () => {
  const difficultyBtn = difficultyPage.querySelector(".content");

  difficultyBtn.addEventListener("click", (event) => {
    const btn = event.target;
    if (btn.classList.contains("btn")) {
      difficultyPage.style.top = "-100vh";
      boardPage.style.top = "50%";

      resetBoard();
      resetValues();
      if (btn.id === "easy") {
        easyMode();
      } else if (btn.id === "medium") {
        mediumMode();
      } else {
        impossibleMode();
      }
      updateTitle("You", "Cpu");
    }
  });
};

// 🔄 Reset score values on the game board
const resetValues = () => {
  const values = boardPage.querySelectorAll(".value");
  values.forEach((value) => {
    value.innerText = "00";
  });
};

// 🔄 Reset the game board
const resetBoard = () => {
  boards.forEach((board) => {
    board.innerHTML = "";
    board.style.pointerEvents = "all";
  });
};

// 🔄 Update player titles on the game board
const updateTitle = (title1, title2) => {
  const playerX = boardPage.querySelector("#player-x");
  const playerO = boardPage.querySelector("#player-o");

  playerX.textContent = selectedMark === "cross" ? title1 : title2;
  playerO.textContent = selectedMark === "naught" ? title1 : title2;
};

// 🎮 Handle player moves in the game
const playMove = (title1, title2) => {
  boards.forEach((board) => {
    indicateMove(board);

    board.addEventListener("click", () => {
      const icon = xTurn ? "x" : "o";
      turnIndicator.src = `assets/images/icon-${xTurn ? "o" : "x"}-silver.svg`;

      board.innerHTML = `<img src="./assets/images/icon-${icon}.svg" alt="${icon.toUpperCase()} Icon" class="${icon}">`;
      board.style.pointerEvents = "none";

      checkWinningState(title1, title2);
      xTurn = !xTurn;
    });
  });
};

// 🚀 Indicate the current player's move on hover
const indicateMove = (board) => {
  board.addEventListener("mouseenter", () => {
    const icon = xTurn ? "x" : "o";

    board.classList.add("outline");
    board.style.setProperty(
      "--outline",
      `url(./assets/images/icon-${icon}-outline.svg)`
    );
  });

  board.addEventListener("mouseleave", () => board.classList.remove("outline"));
};

// 🔀 Check for a winning state in the game
const checkWinningState = (title1, title2) => {
  const winStates = [
    // Rows:
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Diagonals:
    [0, 4, 8],
    [2, 4, 6],
    // Columns:
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];
  let winner = "";

  winStates.forEach((state) => {
    const [pos1, pos2, pos3] = state;
    const position1 = boards[pos1].innerHTML;
    const position2 = boards[pos2].innerHTML;
    const position3 = boards[pos3].innerHTML;

    if (
      position1 !== "" &&
      position2 !== "" &&
      position3 !== "" &&
      position1 === position2 &&
      position2 === position3 &&
      position3 === position1
    ) {
      winner = boards[pos1].querySelector("img").classList.contains("x")
        ? "cross"
        : "naught";
      turnIndicator.src = `assets/images/icon-${
        winner === "cross" ? "x" : "o"
      }-silver.svg`;
      xTurn = !xTurn;

      updateScores(winner);
      updateScorePage(winner, title1, title2);
      showScorePage();
      disableBoardPointerEvents();
    }
  });

  checkTieState(winner);
};

// 🔀 Check for a tie state in the game
const checkTieState = (winner) => {
  let isTie = Array.from(boards).every((board) => board.innerHTML !== "");
  if (isTie && winner === "") {
    updateScores("tie");
    updateScorePage("tie", "", "");
    showScorePage();
    disableBoardPointerEvents();
  }
};

// 🔄 Update scores based on the winner
const updateScores = (winner) => {
  const xScoreBox = boardPage.querySelector("#x-score");
  const oScoreBox = boardPage.querySelector("#o-score");
  const tieScoreBox = boardPage.querySelector("#tie-score");

  winner === "cross" ? xScore++ : winner === "naught" ? oScore++ : tieScore++;

  xScoreBox.textContent = xScore;
  oScoreBox.textContent = oScore;
  tieScoreBox.textContent = tieScore;
};

// 🎮 Display the score page
const showScorePage = () => {
  scorePage.style.opacity = "1";
  scorePage.style.width = "100vw";
  scorePage.style.pointerEvents = "auto";
};

// 🔙 Hide the score page
const hideScorePage = () => {
  scorePage.style.width = "0";
  scorePage.style.opacity = "0";
  scorePage.style.pointerEvents = "none";
};

// 🚫 Disable further moves on the game board
const disableBoardPointerEvents = () => {
  boards.forEach((board) => (board.style.pointerEvents = "none"));
};

// 🔄 Restart the game
const restartGame = () => {
  const restartBtn = boardPage.querySelector("#restart-btn");
  const nextRoundBtn = scorePage.querySelector("#next-round-btn");

  restartBtn.addEventListener("click", () => {
    boards.forEach((board) => (board.style.pointerEvents = "auto"));
    resetBoard();
  });

  nextRoundBtn.addEventListener("click", () => {
    resetBoard();
    hideScorePage();
  });
};

// 🔀 Update the score page with winner information
const updateScorePage = (player, title1, title2) => {
  const nextRoundBtn = scorePage.querySelector("#next-round-btn");
  const winner = scorePage.querySelector("#winner");
  const h1 = scorePage.querySelector("h1");
  const icon = h1.querySelector("img");
  const span = h1.querySelector("span");

  winner.textContent = `${
    player === selectedMark
      ? title1 + ` Won`
      : player !== "tie"
      ? title2 + ` Won`
      : "Tie"
  }!`;

  const setUIStyles = (
    iconSrc,
    h1Color,
    addClass,
    removeClass1,
    removeClass2
  ) => {
    icon.src = `./assets/images/${iconSrc}.svg`;
    h1.style.color = `var(--${h1Color})`;
    nextRoundBtn.classList.add(addClass);
    nextRoundBtn.classList.remove(removeClass1);
    nextRoundBtn.classList.remove(removeClass2);
  };

  if (player == "cross") {
    setUIStyles("icon-x", "Light-Blue", "blue", "yellow", "gray");
  } else if (player == "naught") {
    setUIStyles("icon-o", "Light-Yellow", "yellow", "blue", "gray");
  } else {
    setUIStyles("logo", "Silver", "gray", "blue", "yellow");
  }

  span.textContent = player == "tie" ? "Match Draw." : "Takes the round.";
  icon.style.display = player == "tie" ? "none" : "block";
};

// 🎮 Placeholder function for AI move
const playAiMove = (spots, index) => {
  const icon = selectedMark === "naught" ? "x" : "o";

  spots.length > 0 &&
    ((boards[
      spots[index]
    ].innerHTML = `<img src="./assets/images/icon-${icon}.svg" alt="${icon.toUpperCase()} Icon" class="${icon}">`),
    (boards[spots[index]].style.pointerEvents = "none"));

  turnIndicator.src = `./assets/images/icon-${
    selectedMark === "naught" ? "o" : "x"
  }-silver.svg`;
  checkWinningState("You", "Cpu");
  aiTurn = false;
};

// 🎮 Placeholder function for USER move
const playUserMove = (mode) => {
  boards.forEach((board) => {
    const icon = selectedMark === "cross" ? "x" : "o";

    board.addEventListener("mouseenter", () => {
      board.classList.add("outline");
      board.style.setProperty(
        "--outline",
        `url(./assets/images/icon-${icon}-outline.svg)`
      );
    });

    board.addEventListener("mouseleave", () =>
      board.classList.remove("outline")
    );

    board.addEventListener("click", () => {
      turnIndicator.src = `./assets/images/icon-${
        selectedMark === "naught" ? "x" : "o"
      }-silver.svg`;

      board.innerHTML = `<img src="./assets/images/icon-${icon}.svg" alt="${icon.toUpperCase()} Icon" class="${icon}">`;
      board.style.pointerEvents = "none";

      checkWinningState("You", "Cpu");
      disableBoardPointerEvents();
      aiTurn = true;
      if (scorePage.style.opacity !== "1") {
        setTimeout(() => {
          mode === "easy"
            ? easyMode()
            : mode === "medium"
            ? mediumMode()
            : impossibleMode();

          boards.forEach(
            (board) =>
              board.innerHTML === "" && (board.style.pointerEvents = "all")
          );
        }, 300);
      }
    });
  });
};

// Helper function to get empty spots on the board
const getEmptySpots = (board) => {
  let emptySpots = [];
  board.forEach((e, index) => e.innerHTML === "" && emptySpots.push(index));
  return emptySpots;
};

// AI randomly picks an empty spot for a move in easyMode
const easyMode = () =>
  aiTurn
    ? (playAiMove(
        getEmptySpots(boards),
        Math.floor(Math.random() * getEmptySpots(boards).length)
      ),
      easyMode())
    : playUserMove("easy");

// 🚀 Initializations and setup
markAnimation();
toggleDifficultyPage();
backToLandingPageListeners();
playVsPlayer();
playVsCpu();
restartGame();
