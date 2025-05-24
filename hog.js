// 1. Hog Array
const hogs = [
    { x: 3, y: 1, color: 'chocolate', size: 0.75, speed: 1 }, // Valid path: maze[1][3]
    { x: 1, y: 3, color: 'peru', size: 0.7, speed: 1 },       // Valid path: maze[3][1]
    { x: 6, y: 5, color: 'sienna', size: 0.72, speed: 1 }     // Valid path: maze[5][6]
];

// 2. drawHog function
// Assumes window.ctx, window.tileSize are available from board.js
function drawHog(hog) {
    if (!window.ctx || !window.tileSize) {
        console.error("Canvas context or tileSize not available globally for drawing hog.");
        return;
    }

    const TILE_SIZE = window.tileSize;
    const HOG_SIZE_RATIO = hog.size; // Use existing size property (e.g., 0.75)

    // Overall bounding box for the hog
    const hogDisplayWidth = TILE_SIZE * HOG_SIZE_RATIO;
    const hogDisplayHeight = TILE_SIZE * HOG_SIZE_RATIO * 0.8; // Hogs are a bit wider than tall
    const hogPixelX = hog.x * TILE_SIZE + (TILE_SIZE * (1 - HOG_SIZE_RATIO)) / 2; // Centered X for the bounding box
    const hogPixelY = hog.y * TILE_SIZE + (TILE_SIZE * (1 - (HOG_SIZE_RATIO * 0.8))) / 2; // Centered Y

    // Body (rounded rectangle)
    const bodyWidth = hogDisplayWidth;
    const bodyHeight = hogDisplayHeight * 0.7;
    const bodyX = hogPixelX;
    const bodyY = hogPixelY + hogDisplayHeight * 0.15; // Position body a bit lower for head/snout space
    const cornerRadius = TILE_SIZE / 10;

    window.ctx.fillStyle = hog.color; // Use hog's defined color
    window.ctx.beginPath();
    window.ctx.moveTo(bodyX + cornerRadius, bodyY);
    window.ctx.lineTo(bodyX + bodyWidth - cornerRadius, bodyY);
    window.ctx.quadraticCurveTo(bodyX + bodyWidth, bodyY, bodyX + bodyWidth, bodyY + cornerRadius);
    window.ctx.lineTo(bodyX + bodyWidth, bodyY + bodyHeight - cornerRadius);
    window.ctx.quadraticCurveTo(bodyX + bodyWidth, bodyY + bodyHeight, bodyX + bodyWidth - cornerRadius, bodyY + bodyHeight);
    window.ctx.lineTo(bodyX + cornerRadius, bodyY + bodyHeight);
    window.ctx.quadraticCurveTo(bodyX, bodyY + bodyHeight, bodyX, bodyY + bodyHeight - cornerRadius);
    window.ctx.lineTo(bodyX, bodyY + cornerRadius);
    window.ctx.quadraticCurveTo(bodyX, bodyY, bodyX + cornerRadius, bodyY);
    window.ctx.closePath();
    window.ctx.fill();

    // Legs (simple rectangles)
    const legWidth = bodyWidth / 5;
    const legHeight = hogDisplayHeight * 0.25;
    const legY = bodyY + bodyHeight * 0.9; // Position legs slightly overlapping bottom of body
    const legColor = hog.color === 'chocolate' ? '#A0522D' : // Darker shade for legs
                     hog.color === 'peru' ? '#CD853F' : '#D2691E'; 

    window.ctx.fillStyle = legColor;
    // Front-left leg
    window.ctx.fillRect(bodyX + legWidth / 2, legY - legHeight * 0.2, legWidth, legHeight);
    // Front-right leg
    window.ctx.fillRect(bodyX + bodyWidth - legWidth * 1.5, legY - legHeight * 0.2, legWidth, legHeight);
    // Back-left leg (slightly shorter or offset to give perspective, or just same)
    window.ctx.fillRect(bodyX + legWidth / 2, bodyY + bodyHeight - legHeight * 0.8, legWidth, legHeight * 0.8);
    // Back-right leg
    window.ctx.fillRect(bodyX + bodyWidth - legWidth * 1.5, bodyY + bodyHeight - legHeight * 0.8, legWidth, legHeight*0.8);


    // Snout (ellipse/circle)
    const snoutRadius = bodyWidth / 8;
    const snoutX = bodyX + bodyWidth * 0.9; // Position snout to the right (assuming hog faces right)
    const snoutY = bodyY + bodyHeight / 2.5;
    window.ctx.fillStyle = 'pink';
    window.ctx.beginPath();
    window.ctx.arc(snoutX, snoutY, snoutRadius, 0, Math.PI * 2);
    window.ctx.fill();
    // Nostrils
    window.ctx.fillStyle = 'black';
    window.ctx.fillRect(snoutX - snoutRadius/3, snoutY - snoutRadius/4, snoutRadius/4, snoutRadius/4);
    window.ctx.fillRect(snoutX + snoutRadius/6, snoutY - snoutRadius/4, snoutRadius/4, snoutRadius/4);
}

// 3. drawHogs function
function drawHogs() {
    if (!hogs || hogs.length === 0) {
        console.warn("No hogs to draw.");
        return;
    }
    hogs.forEach(hog => drawHog(hog));
}
window.drawHogs = drawHogs; // Make globally accessible

// 4. moveHog function (Basic Random Movement)
// Assumes window.maze is available
function moveHog(hog) {
    if (!window.maze) {
        console.error("Maze data not available globally from board.js for moving hog.");
        return;
    }

    let newX = hog.x;
    let newY = hog.y;
    const direction = Math.floor(Math.random() * 4); // 0: up, 1: down, 2: left, 3: right

    switch (direction) {
        case 0: // Up
            newY -= hog.speed;
            break;
        case 1: // Down
            newY += hog.speed;
            break;
        case 2: // Left
            newX -= hog.speed;
            break;
        case 3: // Right
            newX += hog.speed;
            break;
    }

    // Wall Collision Detection
    // Check if newX and newY are within maze boundaries and not a wall
    if (newY >= 0 && newY < window.maze.length &&
        newX >= 0 && newX < window.maze[newY].length &&
        window.maze[newY][newX] !== 1) { // 1 is a wall
        
        hog.x = newX;
        hog.y = newY;
    }
    // If it's a wall, the hog stays in place (no else needed)
}

// 5. moveHogs function
function moveHogs() {
    if (!hogs || hogs.length === 0) {
        return;
    }
    hogs.forEach(hog => moveHog(hog));
}

// 6. Initial Draw
// Removed. game.js's initGame will handle the first draw.
// if (document.readyState === 'complete') {
//     setTimeout(drawHogs, 150); 
// } else {
//     window.addEventListener('load', () => setTimeout(drawHogs, 150));
// }
console.log("hog.js loaded. Initial draw call removed.");

// For testing movement (optional, can be removed or integrated into game.js later)
// Example: move hogs once after 2 seconds, then redraw everything
/*
setTimeout(() => {
    if (typeof window.drawMaze === 'function' && typeof drawWes === 'function') {
        moveHogs();
        window.drawMaze(); // Redraw maze
        drawWes();         // Redraw Wes
        drawHogs();        // Redraw hogs in new positions
        console.log("Hogs moved for testing.");
    } else {
        console.log("Could not test hog movement: drawMaze or drawWes not found globally.");
    }
}, 2000);
*/
