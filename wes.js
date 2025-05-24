// 1. Player Object
const wes = {
    x: 1, // Initial x position (tile index)
    y: 1, // Initial y position (tile index) - maze[1][1] should be a path
    color: 'blue',
    size: 0.7, // Relative to tileSize (70% of tile size)
    speed: 1 // Tiles per move
};

// 2. drawWes function
// Assumes window.ctx, window.tileSize are available from board.js
function drawWes() {
    if (!window.ctx || !window.tileSize) {
        console.error("Canvas context or tileSize not available globally from board.js");
        return;
    }

    const TILE_SIZE = window.tileSize;
    const WES_SIZE_RATIO = wes.size; // Use existing size property (e.g., 0.7)

    // Calculate overall bounding box for Wes based on WES_SIZE_RATIO
    const wesDisplayWidth = TILE_SIZE * WES_SIZE_RATIO;
    const wesDisplayHeight = TILE_SIZE * WES_SIZE_RATIO;
    const wesPixelX = wes.x * TILE_SIZE + (TILE_SIZE * (1 - WES_SIZE_RATIO)) / 2; // Centered X for the bounding box
    const wesPixelY = wes.y * TILE_SIZE + (TILE_SIZE * (1 - WES_SIZE_RATIO)) / 2; // Centered Y for the bounding box

    // Body (rectangle) - takes up lower 60% of Wes's display height
    const bodyHeight = wesDisplayHeight * 0.6;
    const bodyWidth = wesDisplayWidth * 0.7; // Make body a bit narrower than full Wes width
    const bodyPixelX = wesPixelX + (wesDisplayWidth - bodyWidth) / 2;
    const bodyPixelY = wesPixelY + wesDisplayHeight * 0.4;

    window.ctx.fillStyle = wes.color; // Use Wes's defined color for the body
    window.ctx.fillRect(bodyPixelX, bodyPixelY, bodyWidth, bodyHeight);

    // Head (circle) - takes up upper 40% of Wes's display height
    const headRadius = wesDisplayHeight * 0.20; // Head radius is 20% of Wes's total height
    const headCenterX = wesPixelX + wesDisplayWidth / 2;
    const headCenterY = wesPixelY + wesDisplayHeight * 0.2; // Position head in the upper part

    window.ctx.fillStyle = 'peachpuff'; // A common skin tone for the head
    window.ctx.beginPath();
    window.ctx.arc(headCenterX, headCenterY, headRadius, 0, Math.PI * 2);
    window.ctx.fill();
}

// Make drawWes globally accessible if it needs to be called from game.js for redraws
window.drawWes = drawWes; 

// 3. Keyboard Event Listeners & 4. Movement Logic
document.addEventListener('keydown', function(event) {
    if (!window.maze || !window.drawMaze) {
        console.error("Maze data or drawMaze function not available globally from board.js");
        return;
    }

    let newX = wes.x;
    let newY = wes.y;

    switch (event.key) {
        case 'ArrowUp':
            newY -= wes.speed;
            break;
        case 'ArrowDown':
            newY += wes.speed;
            break;
        case 'ArrowLeft':
            newX -= wes.speed;
            break;
        case 'ArrowRight':
            newX += wes.speed;
            break;
        default:
            return; // Exit if other key is pressed
    }

    // Wall Collision Detection
    // Check if newX and newY are within maze boundaries and not a wall
    if (newY >= 0 && newY < window.maze.length &&
        newX >= 0 && newX < window.maze[newY].length &&
        window.maze[newY][newX] !== 1) { // 1 is a wall
        
        wes.x = newX;
        wes.y = newY;

        // Wes's position is updated. The gameLoop will handle redrawing.
    }
});

// 5. Initial Draw
// Remove initial draw call. game.js's initGame will handle the first draw.
// if (document.readyState === 'complete') {
//     setTimeout(drawWes, 100); 
// } else {
//     window.addEventListener('load', () => setTimeout(drawWes, 100));
// }
console.log("wes.js loaded. Movement logic updated to not call draw functions.");
