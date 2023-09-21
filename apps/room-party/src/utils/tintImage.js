let _context;

function tintImage(image, color, opacity = 0.5, darkness = 0) {
  if (!_context) {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    _context = canvas.getContext("2d");
  } else {
    _context.canvas.width = image.width;
    _context.canvas.height = image.height;
  }

  _context.save();
  _context.fillStyle = color;
  _context.globalAlpha = opacity;
  _context.fillRect(0, 0, _context.canvas.width, _context.canvas.height);
  _context.fillStyle = "black";
  _context.globalAlpha = darkness;
  _context.fillRect(0, 0, _context.canvas.width, _context.canvas.height);
  _context.globalCompositeOperation = "destination-atop";
  _context.globalAlpha = 1;
  _context.drawImage(image, 0, 0);
  _context.restore();

  return _context.canvas;
}

window.tintImage = tintImage;
