/**
 * Download canvas as PNG image
 * @param {HTMLCanvasElement} canvas - The canvas element to download
 */
export const downloadImage = (canvas) => {
  const link = document.createElement("a");
  link.download = `lyrictify-${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
