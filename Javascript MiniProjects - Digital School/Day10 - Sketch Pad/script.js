// ============================================
//  SKETCH PAD — JavaScript
//  Concepts covered:
//    - HTML Canvas API (2D drawing context)
//    - Mouse events (mousedown, mousemove, mouseup, mouseleave)
//    - Touch events for mobile (touchstart, touchmove, touchend)
//    - Canvas methods: beginPath, lineTo, stroke, fillRect
//    - getImageData / putImageData for undo history
//    - canvas.toDataURL() to export as PNG
//    - Dynamic <a> element for programmatic downloads
//    - Keyboard shortcuts (Ctrl+Z)
//    - Event delegation and active class toggling
//    - globalAlpha for opacity control
//    - lineCap | lineJoin for smooth strokes
// ============================================

// ========== 1. GRAB DOM ELEMENTS ==========

const canvas = document.getElementById('canvas');
const canvasWrapper = document.getElementById('canvasWrapper');
const cursorPreview = document.getElementById('cursorPreview');
const cursorPosEl = document.getElementById('cursorPos');
const historyCountEl = document.getElementById('historyCount');

// Tools
const penTool = document.getElementById('penTool');
const eraserTool = document.getElementById('eraserTool');
const fillTool = document.getElementById('fillTool');

// Sliders
const brushSizeSlider = document.getElementById('brushSize');
const brushOpacitySlider = document.getElementById('brushOpacity');
const sizeValueEl = document.getElementById('sizeValue');
const opacityValueEl = document.getElementById('opacityValue');

// Color
const colorPicker = document.getElementById('colorPicker');
const colorPresetsContainer = document.getElementById('colorPresets');

// Action buttons
const undoBtn = document.getElementById('undoBtn');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');

// ========== 2. GET THE CANVAS 2D CONTEXT ==========
// The "context" is the object we use to draw on the canvas.
// Think of the canvas as the paper, and the context as the pen.

const ctx = canvas.getContext('2d');

// ========== 3. PRESET COLORS ==========
// An array of hex color strings for the quick-pick palette

const presetColors = [
  '#ffffff', '#ef4444', '#f97316', '#f59e0b',
  '#22c55e', '#3b82f6', '#6366f1', '#a855f7',
  '#ec4899', '#000000', '#64748b', '#14b8a6'
];

// ========== 4. STATE VARIABLES ==========

let isDrawing = false;        // Is the mouse currently pressed down?
let currentTool = 'pen';      // 'pen', 'eraser', or 'fill'
let brushSize = 4;            // Current brush diameter in pixels
let brushOpacity = 1;         // Current opacity (0 to 1)
let currentColor = '#6366f1'; // Currently selected color
let history = [];             // Array of saved canvas states for undo
const MAX_HISTORY = 30;       // Limit undo steps to save memory

// ========== 5. CANVAS SETUP ==========
// We need to set the canvas resolution to match its display size.
// Without this, drawings would look blurry or stretched.

function setupCanvas() {
  // Get the actual pixel width of the wrapper element
  const rect = canvasWrapper.getBoundingClientRect();

  // Set the canvas drawing resolution
  // We multiply by devicePixelRatio for crisp lines on high-DPI screens
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = 500 * window.devicePixelRatio;

  // Set the CSS display size to match the wrapper
  canvas.style.width = rect.width + 'px';
  canvas.style.height = '500px';

  // Scale the context so our coordinates match CSS pixels
  // Without this, a line at x=100 would appear at a different position
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  // Set default drawing styles
  ctx.lineCap = 'round';     // Rounded line ends (not square)
  ctx.lineJoin = 'round';    // Rounded corners where lines meet

  // Fill the canvas with white so downloads have a background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Save the initial blank state for undo
  saveState();
}

// ========== 6. RENDER COLOR PRESETS ==========
// Creates small colored circles for quick color selection

function renderPresets() {
  colorPresetsContainer.innerHTML = '';

  presetColors.forEach(color => {
    const swatch = document.createElement('div');
    swatch.className = 'preset-color';
    swatch.style.background = color;

    // When clicked, set this as the active color
    swatch.addEventListener('click', () => {
      currentColor = color;
      colorPicker.value = color;
      updateActivePreset();

      // If we were on eraser, switch back to pen
      if (currentTool === 'eraser') {
        setActiveTool('pen');
      }
    });

    colorPresetsContainer.appendChild(swatch);
  });

  updateActivePreset();
}

// Highlights the active preset swatch
function updateActivePreset() {
  document.querySelectorAll('.preset-color').forEach((swatch, i) => {
    swatch.classList.toggle('active', presetColors[i] === currentColor);
  });
}

// ========== 7. DRAWING FUNCTIONS ==========

// --- Start Drawing ---
// Called when the mouse button is pressed down on the canvas
function startDrawing(x, y) {
  isDrawing = true;

  // beginPath() starts a new drawing path
  // Without it, all lines would connect to each other
  ctx.beginPath();

  // moveTo() positions the "pen" without drawing
  ctx.moveTo(x, y);
}

// --- Draw ---
// Called continuously as the mouse moves while pressed
function draw(x, y) {
  if (!isDrawing) return;

  // Set the drawing style based on the current tool
  if (currentTool === 'eraser') {
    // Eraser draws with white (the background color)
    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 1;   // Eraser is always fully opaque
  } else {
    ctx.strokeStyle = currentColor;
    ctx.globalAlpha = brushOpacity;
  }

  // Set the line thickness
  ctx.lineWidth = brushSize;

  // lineTo() draws a line from the last position to (x, y)
  ctx.lineTo(x, y);

  // stroke() actually renders the line on the canvas
  ctx.stroke();
}

// --- Stop Drawing ---
// Called when the mouse button is released
function stopDrawing() {
  if (isDrawing) {
    isDrawing = false;

    // closePath() ends the current path
    ctx.closePath();

    // Reset opacity to full
    ctx.globalAlpha = 1;

    // Save this state so the user can undo back to it
    saveState();
  }
}

// ========== 8. GET MOUSE / TOUCH POSITION ==========
// Converts page coordinates to canvas-relative coordinates.
// We need this because mouse events give us page positions,
// but we need to know where on the canvas the click happened.

function getPosition(e) {
  const rect = canvas.getBoundingClientRect();

  // Check if this is a touch event or a mouse event
  if (e.touches && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  }

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

// ========== 9. MOUSE EVENT LISTENERS ==========
// These connect mouse actions to our drawing functions

canvas.addEventListener('mousedown', (e) => {
  if (currentTool === 'fill') {
    fillCanvas();
    return;
  }
  const pos = getPosition(e);
  startDrawing(pos.x, pos.y);
});

canvas.addEventListener('mousemove', (e) => {
  const pos = getPosition(e);

  // Update cursor position display (bottom-left)
  cursorPosEl.textContent = `X: ${Math.round(pos.x)}  Y: ${Math.round(pos.y)}`;

  // Update the custom cursor preview circle position
  updateCursorPreview(e.clientX, e.clientY);

  // Draw if the mouse is pressed
  draw(pos.x, pos.y);
});

canvas.addEventListener('mouseup', stopDrawing);

// Stop drawing if the mouse leaves the canvas area
canvas.addEventListener('mouseleave', () => {
  stopDrawing();
  cursorPreview.style.display = 'none';
});

// Show the cursor preview when the mouse enters the canvas
canvas.addEventListener('mouseenter', () => {
  cursorPreview.style.display = 'block';
});

// ========== 10. TOUCH EVENT LISTENERS ==========
// Same logic as mouse events, but for mobile/tablet devices.
// Touch events use e.touches[0] instead of e.clientX/Y.

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();  // Prevent scrolling while drawing
  if (currentTool === 'fill') {
    fillCanvas();
    return;
  }
  const pos = getPosition(e);
  startDrawing(pos.x, pos.y);
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  const pos = getPosition(e);
  draw(pos.x, pos.y);
});

canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  stopDrawing();
});

// ========== 11. CUSTOM CURSOR PREVIEW ==========
// A circle that follows the mouse showing the current brush size

function updateCursorPreview(clientX, clientY) {
  const rect = canvasWrapper.getBoundingClientRect();

  // Position the circle relative to the canvas wrapper
  cursorPreview.style.left = (clientX - rect.left) + 'px';
  cursorPreview.style.top = (clientY - rect.top) + 'px';

  // Size the circle to match the brush size
  cursorPreview.style.width = brushSize + 'px';
  cursorPreview.style.height = brushSize + 'px';

  // Show or hide based on whether cursor is over the canvas
  cursorPreview.style.display = 'block';
}

// ========== 12. FILL CANVAS ==========
// Fills the entire canvas with the current color

function fillCanvas() {
  ctx.fillStyle = currentColor;
  // We divide by devicePixelRatio because the context is scaled
  ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);
  saveState();
}

// ========== 13. UNDO (HISTORY MANAGEMENT) ==========
// We save the canvas state after each stroke.
// Undo = restore the previous saved state.

function saveState() {
  // getImageData() captures every pixel on the canvas as raw data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  history.push(imageData);

  // Limit history size to prevent excessive memory use
  if (history.length > MAX_HISTORY) {
    history.shift();  // Remove the oldest state
  }

  historyCountEl.textContent = `History: ${history.length}`;
}

function undo() {
  if (history.length <= 1) return;  // Keep at least the initial blank state

  // Remove the current state
  history.pop();

  // Get the previous state
  const previousState = history[history.length - 1];

  // putImageData() restores saved pixel data back to the canvas
  ctx.putImageData(previousState, 0, 0);

  historyCountEl.textContent = `History: ${history.length}`;
}

// ========== 14. CLEAR CANVAS ==========
// Wipes the canvas back to white

function clearCanvas() {
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

  // Clear all history and save the new blank state
  history = [];
  saveState();
}

// ========== 15. DOWNLOAD CANVAS AS PNG ==========
// canvas.toDataURL() converts the canvas to a base64-encoded PNG image.
// We then create a temporary <a> link and click it programmatically.

function downloadCanvas() {
  // Create a temporary link element
  const link = document.createElement('a');

  // Set the filename
  link.download = 'sketch.png';

  // Convert canvas to a data URL (base64-encoded PNG)
  link.href = canvas.toDataURL('image/png');

  // Programmatically click the link to trigger the download
  link.click();
}

// ========== 16. TOOL SELECTION ==========
// Switches between pen, eraser, and fill tools

function setActiveTool(tool) {
  currentTool = tool;

  // Remove 'active' class from all tool buttons
  penTool.classList.remove('active');
  eraserTool.classList.remove('active');
  fillTool.classList.remove('active');

  // Add 'active' class to the selected tool's button
  if (tool === 'pen') penTool.classList.add('active');
  if (tool === 'eraser') eraserTool.classList.add('active');
  if (tool === 'fill') fillTool.classList.add('active');
}

// ========== 17. EVENT LISTENERS — TOOLS ==========

penTool.addEventListener('click', () => setActiveTool('pen'));
eraserTool.addEventListener('click', () => setActiveTool('eraser'));
fillTool.addEventListener('click', () => setActiveTool('fill'));

// ========== 18. EVENT LISTENERS — SLIDERS ==========

// Brush size slider
brushSizeSlider.addEventListener('input', (e) => {
  brushSize = parseInt(e.target.value);
  sizeValueEl.textContent = brushSize;
});

// Opacity slider
brushOpacitySlider.addEventListener('input', (e) => {
  const percent = parseInt(e.target.value);
  opacityValueEl.textContent = percent;

  // Convert percentage (0–100) to a decimal (0–1) for globalAlpha
  brushOpacity = percent / 100;
});

// ========== 19. EVENT LISTENERS — COLOR ==========

colorPicker.addEventListener('input', (e) => {
  currentColor = e.target.value;
  updateActivePreset();

  // Switch to pen when picking a new color
  if (currentTool === 'eraser') {
    setActiveTool('pen');
  }
});

// ========== 20. EVENT LISTENERS — ACTION BUTTONS ==========

undoBtn.addEventListener('click', undo);
clearBtn.addEventListener('click', clearCanvas);
downloadBtn.addEventListener('click', downloadCanvas);

// ========== 21. KEYBOARD SHORTCUTS ==========
// Ctrl+Z = Undo (a familiar shortcut for students)

document.addEventListener('keydown', (e) => {
  // e.ctrlKey is true when the Ctrl key is held down
  if (e.ctrlKey && e.key === 'z') {
    e.preventDefault();  // Prevent the browser's default undo
    undo();
  }
});

// ========== 22. HANDLE WINDOW RESIZE ==========
// When the window resizes, we need to recalculate the canvas size.
// We save the current drawing, resize, then restore it.

window.addEventListener('resize', () => {
  // Save the current canvas content before resizing
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  setupCanvas();

  // Restore the saved content after resizing
  ctx.putImageData(imageData, 0, 0);
});

// ========== 23. INITIALIZE EVERYTHING ==========

setupCanvas();
renderPresets();
