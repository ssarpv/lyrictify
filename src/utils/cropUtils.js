/**
 * Image cropping utility using canvas
 * Handles rotation and high-DPI output
 */

// Utility function to create image from URL
const createImage = (url) =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.src = url;
	});

/**
 * Get cropped area from canvas using croppedAreaPixels with rotation support
 * @param {string} imageSrc - Data URL of the image
 * @param {Object} croppedAreaPixels - Crop area coordinates from react-easy-crop
 * @param {number} rotation - Rotation angle in degrees
 * @returns {Promise<string>} Cropped image as data URL
 */
export const getCroppedImg = async (imageSrc, croppedAreaPixels, rotation = 0) => {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	const pixelRatio = window.devicePixelRatio || 1;

	canvas.width = 512 * pixelRatio;
	canvas.height = 512 * pixelRatio;

	ctx.scale(pixelRatio, pixelRatio);
	ctx.imageSmoothingQuality = "high";

	// Draw image with rotation applied
	const rad = (rotation * Math.PI) / 180;

	// Calculate the size needed for the rotated image
	const absSin = Math.abs(Math.sin(rad));
	const absCos = Math.abs(Math.cos(rad));
	const rotW = image.naturalWidth * absCos + image.naturalHeight * absSin;
	const rotH = image.naturalWidth * absSin + image.naturalHeight * absCos;

	// Create temp canvas for rotated image
	const tempCanvas = document.createElement("canvas");
	const tempCtx = tempCanvas.getContext("2d");
	tempCanvas.width = rotW;
	tempCanvas.height = rotH;

	// Rotate and draw
	tempCtx.translate(rotW / 2, rotH / 2);
	tempCtx.rotate(rad);
	tempCtx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

	// croppedAreaPixels is relative to the NATURAL image size (not the rotated bounding box)
	// The cropper shows the rotated image fitted within its view
	// We need to figure out how the crop coordinates map to the rotated canvas

	// The image is displayed in the cropper scaled to fit, with the rotated dimensions
	// So croppedAreaPixels is actually relative to the NATURAL image dimensions
	// We just need to draw from the rotated canvas at the same coordinates

	const x = Math.max(0, Math.min(croppedAreaPixels.x, rotW - 1));
	const y = Math.max(0, Math.min(croppedAreaPixels.y, rotH - 1));
	const w = Math.max(1, Math.min(croppedAreaPixels.width, rotW - x));
	const h = Math.max(1, Math.min(croppedAreaPixels.height, rotH - y));

	ctx.drawImage(tempCanvas, x, y, w, h, 0, 0, 512, 512);

	return new Promise((resolve) => {
		canvas.toBlob(
			(blob) => {
				if (!blob) return;
				const reader = new FileReader();
				reader.readAsDataURL(blob);
				reader.onloadend = () => {
					resolve(reader.result);
				};
			},
			"image/png",
			1
		);
	});
};
