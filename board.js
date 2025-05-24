// 1. Define the Canvas and Context
window.canvas = document.getElementById('gameCanvas');
window.ctx = window.canvas.getContext('2d');

// 2. Define Maze Structure
// 0 = path, 1 = wall, 2 = hunting spot (goal), 3 = Beer, 4 = Jerky
window.maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 3, 0, 1, 0, 0, 0, 0, 1], // Start Wes at (1,1), Beer at (1,2)
    [1, 0, 1, 0, 1, 4, 1, 1, 0, 1], // Jerky at (2,5)
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 3, 0, 1], // Beer at (5,7)
    [1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 4, 0, 0, 0, 0, 1, 2, 1], // Jerky at (7,2), Hunting spot at (8, 7)
    [1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// 3. Define Tile Size
window.tileSize = 40; // 40 pixels

// 4. Implement drawMaze function
window.drawMaze = function() {
    // Set canvas dimensions
    window.canvas.width = window.maze[0].length * window.tileSize;
    window.canvas.height = window.maze.length * window.tileSize;

    for (let row = 0; row < window.maze.length; row++) {
        for (let col = 0; col < window.maze[row].length; col++) {
            const x = col * window.tileSize;
            const y = row * window.tileSize;

            // Base path color for all traversable tiles (0, 2, 3, 4)
            if (window.maze[row][col] === 0 || window.maze[row][col] === 2 || window.maze[row][col] === 3 || window.maze[row][col] === 4) {
                window.ctx.fillStyle = 'lightgreen';
                window.ctx.fillRect(x, y, window.tileSize, window.tileSize);
            }

            switch (window.maze[row][col]) {
                case 1: // Wall - Enhanced Tree/Bush
                    // Fill the entire tile with a base color (e.g., dark green for dense foliage)
                    window.ctx.fillStyle = '#228B22'; // Forest Green
                    window.ctx.fillRect(x, y, window.tileSize, window.tileSize);
                    
                    // Trunk
                    window.ctx.fillStyle = 'saddlebrown';
                    window.ctx.fillRect(x + window.tileSize / 2.5, y + window.tileSize * 0.6, window.tileSize / 5, window.tileSize * 0.4);
                    
                    // Leaves - several overlapping circles
                    window.ctx.fillStyle = 'green';
                    window.ctx.beginPath();
                    window.ctx.arc(x + window.tileSize / 2, y + window.tileSize / 3, window.tileSize / 3, 0, Math.PI * 2);
                    window.ctx.fill();
                    window.ctx.beginPath();
                    window.ctx.arc(x + window.tileSize / 3, y + window.tileSize / 2, window.tileSize / 3.5, 0, Math.PI * 2);
                    window.ctx.fill();
                    window.ctx.beginPath();
                    window.ctx.arc(x + window.tileSize * 2/3, y + window.tileSize / 2, window.tileSize / 3.5, 0, Math.PI * 2);
                    window.ctx.fill();
                    break;
                case 0: // Path - already drawn (lightgreen)
                    break;
                case 2: // Hunting Spot - Enhanced (Green tile with brown 'X')
                    // Base tile already drawn (lightgreen), overwrite with darkgreen for spot
                    window.ctx.fillStyle = 'darkgreen'; 
                    window.ctx.fillRect(x, y, window.tileSize, window.tileSize);
                    
                    // Brown 'X'
                    window.ctx.strokeStyle = 'saddlebrown';
                    window.ctx.lineWidth = window.tileSize / 8;
                    window.ctx.beginPath();
                    // Line 1: Top-left to Bottom-right
                    window.ctx.moveTo(x + window.tileSize / 4, y + window.tileSize / 4);
                    window.ctx.lineTo(x + window.tileSize * 3/4, y + window.tileSize * 3/4);
                    // Line 2: Top-right to Bottom-left
                    window.ctx.moveTo(x + window.tileSize * 3/4, y + window.tileSize / 4);
                    window.ctx.lineTo(x + window.tileSize / 4, y + window.tileSize * 3/4);
                    window.ctx.stroke();
                    window.ctx.lineWidth = 1; // Reset line width
                    break;
                case 3: // Beer - Enhanced Mug
                    // Path tile already drawn
                    // Mug body
                    window.ctx.fillStyle = 'gold';
                    window.ctx.fillRect(x + window.tileSize / 4, y + window.tileSize / 3, window.tileSize / 2, window.tileSize / 2);
                    // Mug handle (simple rectangle)
                    window.ctx.fillStyle = 'darkgoldenrod';
                    window.ctx.fillRect(x + window.tileSize * 3/4, y + window.tileSize / 2.5, window.tileSize / 8, window.tileSize / 4);
                    // Foam
                    window.ctx.fillStyle = 'white';
                    window.ctx.beginPath();
                    window.ctx.ellipse(x + window.tileSize / 2, y + window.tileSize / 3, window.tileSize / 2.5, window.tileSize / 6, 0, Math.PI, Math.PI * 2);
                    window.ctx.fill();
                    break;
                case 4: // Jerky - Enhanced
                    // Path tile already drawn
                    window.ctx.fillStyle = '#A0522D'; // Sienna color
                    // Irregular shape using a path
                    window.ctx.beginPath();
                    window.ctx.moveTo(x + window.tileSize * 0.2, y + window.tileSize * 0.3);
                    window.ctx.lineTo(x + window.tileSize * 0.8, y + window.tileSize * 0.2);
                    window.ctx.lineTo(x + window.tileSize * 0.7, y + window.tileSize * 0.8);
                    window.ctx.lineTo(x + window.tileSize * 0.3, y + window.tileSize * 0.7);
                    window.ctx.closePath();
                    window.ctx.fill();
                    // Texture lines
                    window.ctx.strokeStyle = '#8B4513'; // SaddleBrown (darker)
                    window.ctx.lineWidth = window.tileSize / 20;
                    window.ctx.beginPath();
                    window.ctx.moveTo(x + window.tileSize * 0.3, y + window.tileSize * 0.4);
                    window.ctx.lineTo(x + window.tileSize * 0.7, y + window.tileSize * 0.3);
                    window.ctx.moveTo(x + window.tileSize * 0.4, y + window.tileSize * 0.6);
                    window.ctx.lineTo(x + window.tileSize * 0.6, y + window.tileSize * 0.5);
                    window.ctx.stroke();
                    window.ctx.lineWidth = 1; // Reset line width
                    break;
            }
        }
    }
}

// 5. Initial Call
// Removed. game.js's initGame will handle the first draw.
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', window.drawMaze);
// } else {
//     window.drawMaze();
// }
console.log("board.js loaded. Initial draw call removed.");
