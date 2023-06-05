figma.showUI(__html__, { width: 275, height: 380 });

figma.ui.onmessage = async msg => {
  if (msg.type === 'create-mondrian-grid') {
    const selectedNode = figma.currentPage.selection[0];
    if (selectedNode && selectedNode.type === "FRAME") {
      selectedNode.children.forEach(child => child.remove());
      createMondrianGrid(selectedNode, msg.stroke, msg.depth, msg.split);
    } else {
      figma.notify('Please select a frame');
    }
  }
};

function createMondrianGrid(frame: FrameNode, strokeWidth: number, depth: number, split: number) {
  const colors = ['#014A97', '#0D4121A', '#F0CE06', '#1C2422', '#E0E5E7', '#E0E5E7', '#E0E5E7', '#E0E5E7'];
  createCell(frame, 0, 0, frame.width, frame.height, depth, split, colors, strokeWidth);
  frame.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 1.0 }];
  if (strokeWidth > 0) {
    frame.strokeWeight = strokeWidth * 2;
  }
  else {
    frame.strokeWeight = 0;
  }
  figma.ui.postMessage({ type: 'grid-complete' });
}

function createCell(frame: FrameNode, posX: number, posY: number, width: number, height: number, depth: number, split: number, colors: string[], strokeWidth: number) {
  if (depth > 0) {
    let div = Math.random() * (split - (1 - split)) + (1 - split);
    if (Math.random() > 0.5) {
      createCell(frame, posX, posY, width, height * div, depth - 1, split, colors, strokeWidth);
      createCell(frame, posX, posY + height * div, width, height * (1 - div), depth - 1, split, colors, strokeWidth);
    } else {
      createCell(frame, posX, posY, width * div, height, depth - 1, split, colors, strokeWidth);
      createCell(frame, posX + width * div, posY, width * (1 - div), height, depth - 1, split, colors, strokeWidth);
    }
  } else {
    const rect = figma.createRectangle();
    rect.x = posX;
    rect.y = posY;
    rect.resizeWithoutConstraints(width, height);
    if (strokeWidth > 0) {
      rect.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 1.0 }];
      rect.strokeWeight = strokeWidth;
    }
    rect.fills = [{ type: 'SOLID', color: hexToRgb(colors[Math.floor(Math.random() * colors.length)]) }];
    frame.appendChild(rect);
  }
}

function hexToRgb(hex: string) {
  const bigint = parseInt(hex.substring(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r: r / 255, g: g / 255, b: b / 255 };
}


