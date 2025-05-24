// game.js - Main game logic

// --- Game State Variables ---
let score = 0;
let lives = 3;
let gameRunning = true; // Will be set to true in initGame

// --- Access to Global Game Elements (Assumed) ---
// window.wes (from wes.js)
// window.hogs (from hog.js)
// window.maze, window.tileSize, window.ctx, window.canvas, window.drawMaze (from board.js)
// window.drawWes (from wes.js)
// window.drawHogs, window.moveHogs (from hog.js)

// Conceptual Power-up Effects (to be integrated into updateGame)
const gameEffects = {
    wesIsInvincible: false,
    wesInvincibilityTimer: 0,
    wesInvincibilityDuration: 5000, // 5 seconds in milliseconds
    wesSpeedBoostActive: false,
    wesSpeedBoostTimer: 0,
    wesSpeedBoostDuration: 3000, // 3 seconds in milliseconds
    originalWesSpeed: 1 // Assuming wes.speed exists and is 1
};

// --- Core Game Logic Functions ---

function updateScore(points) {
    if (!gameRunning) return;
    score += points;
    // displayGameInfo() will be called by drawGame()
}

function loseLife() {
    if (!gameRunning) return;
    
    // If invincible, don't lose a life
    if (gameEffects.wesIsInvincible) {
        console.log("Wes is invincible! No life lost.");
        // Optional: "eat" the hog or make it temporarily disappear
        return; 
    }

    lives--;
    if (lives <= 0) {
        gameOver(false);
    } else {
        // Reset Wes's position to start after losing a life, if game is still running
        if (window.wes) {
            window.wes.x = 1;
            window.wes.y = 1;
        }
        console.log(`Life lost. Lives remaining: ${lives}. Wes reset to start.`);
    }
    // displayGameInfo() will be called by drawGame()
}

function checkWinCondition() {
    if (!gameRunning || !window.wes || !window.maze) return;
    if (window.maze[window.wes.y][window.wes.x] === 2) { // 2 is the hunting spot
        updateScore(100); // Bonus points for winning
        gameOver(true);
    }
}

function gameOver(isWin) {
    if (!gameRunning && !isWin) return; // Allow win to override if game was already "over" by lives
    gameRunning = false;
    
    let message = "";
    if (isWin) {
        message = "You Win! Wes made it to the hunting spot! Score: " + score;
        console.log("Game Over: You Win!");
    } else {
        message = "Game Over! The hogs got Wes... Score: " + score;
        console.log("Game Over: You Lose!");
    }
    
    // The gameLoop will stop, so final drawGame will show last state.
    // Alert after a short delay to allow the final frame to render.
    setTimeout(() => {
        alert(message);
    }, 100); 
}

function displayGameInfo() {
    if (!window.ctx || !window.canvas || !window.tileSize) return;
    
    // Clear only the top part for game info text to avoid full canvas clear here
    // window.ctx.clearRect(0, 0, window.canvas.width, window.tileSize); 
    // Actually, drawGame will handle full clear, so no need to clear here.

    window.ctx.font = "20px Arial";
    window.ctx.fillStyle = "black";
    window.ctx.textAlign = "left";
    window.ctx.fillText(`Score: ${score}`, 10, window.tileSize / 2 + 5);
    
    window.ctx.fillStyle = "red";
    window.ctx.textAlign = "right";
    window.ctx.fillText(`Lives: ${lives}`, window.canvas.width - 10, window.tileSize / 2 + 5);

    // Display power-up status
    window.ctx.textAlign = "center";
    if (gameEffects.wesIsInvincible) {
        window.ctx.fillStyle = "blue";
        window.ctx.fillText("BEER MODE ACTIVE!", window.canvas.width / 2, window.tileSize / 2 + 5);
    }
    if (gameEffects.wesSpeedBoostActive) {
        window.ctx.fillStyle = "orange";
        window.ctx.fillText("JERKY SPEED!", window.canvas.width / 2, window.tileSize / 2 + 25);
    }
}

// --- Game Initialization, Update, Draw, and Loop ---

/**
 * Initializes the game state, draws the initial board, Wes, and hogs.
 */
function initGame() {
    console.log("Initializing game...");
    score = 0;
    lives = 3;
    gameRunning = true;

    gameEffects.wesIsInvincible = false;
    gameEffects.wesInvincibilityTimer = 0;
    gameEffects.wesSpeedBoostActive = false;
    gameEffects.wesSpeedBoostTimer = 0;
    if(window.wes) window.wes.speed = gameEffects.originalWesSpeed;


    // Ensure Wes starts at the defined starting position
    if (window.wes) {
        window.wes.x = 1; // As defined in wes.js
        window.wes.y = 1; // As defined in wes.js
    }
    // TODO: Reset hog positions if needed, or ensure they are at their defined starts.

    // Initial draw calls are now part of drawGame, called by gameLoop after init.
    // No direct draw calls here, gameLoop will handle the first draw.
    console.log("Game initialized. First draw will be handled by gameLoop.");
}

/**
 * Updates the game state (hog movement, collisions, power-ups, win condition).
 */
let lastHogMoveTime = 0;
const hogMoveInterval = 500; // Hogs move every 500ms

function updateGame(currentTime) {
    if (!gameRunning) return;

    // Move hogs at a set interval
    if (currentTime - lastHogMoveTime > hogMoveInterval) {
        if (window.moveHogs) window.moveHogs();
        lastHogMoveTime = currentTime;
    }

    // Collision Detection (Wes vs. Hogs)
    if (window.wes && window.hogs) {
        for (const hog of window.hogs) {
            if (wes.x === hog.x && wes.y === hog.y) {
                if (!gameEffects.wesIsInvincible) {
                    loseLife(); 
                    // If loseLife results in game over, gameRunning will be false.
                    // Break from loop as Wes might be reset or game over.
                    if (!gameRunning) break; 
                } else {
                    // Optional: "Eat" the hog or similar effect if invincible
                    console.log("Invincible Wes met a hog!");
                    // Example: remove hog (or move it far away)
                    // hog.x = -100; hog.y = -100; // Move off-screen
                }
            }
        }
    }
    if (!gameRunning) return; // Check again if collision caused game over

    // Collision Detection (Wes vs. Power-ups)
    if (window.wes && window.maze) {
        const currentTile = window.maze[window.wes.y][window.wes.x];
        if (currentTile === 3) { // Beer
            updateScore(10);
            window.maze[window.wes.y][window.wes.x] = 0; // Remove beer
            gameEffects.wesIsInvincible = true;
            gameEffects.wesInvincibilityTimer = gameEffects.wesInvincibilityDuration;
            console.log("Beer collected! Invincible for 5s.");
        } else if (currentTile === 4) { // Jerky
            updateScore(5);
            window.maze[window.wes.y][window.wes.x] = 0; // Remove jerky
            if (!gameEffects.wesSpeedBoostActive && window.wes) {
                gameEffects.originalWesSpeed = window.wes.speed; // Store original speed
                window.wes.speed *= 2; // Double speed
                gameEffects.wesSpeedBoostActive = true;
            }
            gameEffects.wesSpeedBoostTimer = gameEffects.wesSpeedBoostDuration; // Reset timer even if already active
            console.log("Jerky collected! Speed boost for 3s.");
        }
    }

    // Update Power-up Timers
    if (gameEffects.wesInvincibilityTimer > 0) {
        gameEffects.wesInvincibilityTimer -= 16; // Approximate ms per frame
        if (gameEffects.wesInvincibilityTimer <= 0) {
            gameEffects.wesIsInvincible = false;
            console.log("Invincibility wore off.");
        }
    }
    if (gameEffects.wesSpeedBoostTimer > 0) {
        gameEffects.wesSpeedBoostTimer -= 16; // Approximate ms per frame
        if (gameEffects.wesSpeedBoostTimer <= 0) {
            if (window.wes) window.wes.speed = gameEffects.originalWesSpeed; // Reset speed
            gameEffects.wesSpeedBoostActive = false;
            console.log("Speed boost wore off.");
        }
    }

    checkWinCondition();
}

/**
 * Clears the canvas and redraws all game elements.
 */
function drawGame() {
    if (!window.ctx || !window.canvas) return;

    window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height);

    if (window.drawMaze) window.drawMaze();
    if (window.drawWes) window.drawWes();
    if (window.drawHogs) window.drawHogs();
    displayGameInfo(); // Must be last to draw over other elements if needed
}

/**
 * The main game loop.
 */
function gameLoop(timestamp) { // timestamp is automatically provided by requestAnimationFrame
    if (!gameRunning) {
        console.log("Game loop stopped.");
        // Optionally draw a final "Game Over" screen here if not relying on alert
        // drawGame(); // Draw final state
        // window.ctx.font = "40px Arial";
        // window.ctx.fillStyle = "black";
        // window.ctx.textAlign = "center";
        // window.ctx.fillText("GAME OVER", window.canvas.width/2, window.canvas.height/2);
        return;
    }

    updateGame(timestamp); // Pass timestamp for time-based logic (e.g. hog movement)
    drawGame();

    requestAnimationFrame(gameLoop);
}

// --- Initial Setup ---
window.addEventListener('load', () => {
    console.log("All resources loaded. Starting game.");
    if (!window.canvas || !window.ctx) { // Make sure board.js has initialized canvas/ctx
        console.error("Canvas or context not initialized by board.js before game.js load event.");
        // Attempt to initialize them if possible, or alert user.
        // This is a fallback, ideally board.js runs first.
        window.canvas = document.getElementById('gameCanvas');
        if(window.canvas) window.ctx = window.canvas.getContext('2d');
        else {
            alert("Critical error: Canvas element not found!");
            return;
        }
        if(!window.ctx) {
            alert("Critical error: Canvas context could not be retrieved!");
            return;
        }
    }
    
    initGame(); // Set up game state
    gameLoop(0);  // Start the game loop, pass initial timestamp 0
});

console.log("game.js loaded - game loop and core functions defined.");
