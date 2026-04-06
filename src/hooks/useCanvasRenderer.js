import { useRef, useCallback } from "react";

/**
 * Custom hook for canvas rendering logic
 * Handles all canvas operations for lyric card generation
 */

/**
 * Utility function to wrap text to fit within max width
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} text - Text to wrap
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} maxWidth - Maximum width
 * @param {number} lineHeight - Line height
 * @returns {number} Number of lines drawn
 */
const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
	const lines = [];
	let currentLine = "";

	for (const char of text) {
		const testLine = currentLine + char;
		const metrics = ctx.measureText(testLine);

		if (metrics.width > maxWidth && currentLine) {
			lines.push(currentLine);
			currentLine = char;
		} else {
			currentLine = testLine;
		}
	}
	if (currentLine) {
		lines.push(currentLine);
	}

	// Draw each line
	lines.forEach((line, index) => {
		ctx.fillText(line, x, y + index * lineHeight);
	});

	return lines.length;
};

/**
 * Canvas renderer hook
 * @returns {Object} Canvas ref and render function
 */
export const useCanvasRenderer = () => {
	const canvasRef = useRef(null);

	/**
	 * Render the lyric card to canvas
	 */
	const renderCanvas = useCallback(
		async (track, author, lyricsLines, cover, bg, fg, txt, ratio, gradient, gradColors) => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const ctx = canvas.getContext("2d");
			const lyricsArray = lyricsLines.split("\n");

			// Device pixel ratio for high-DPI displays
			const pixelRatio = window.devicePixelRatio || 1;

			// Set canvas size based on aspect ratio
			// 9:16 = 1080x1920 (Stories), 1:1 = 1080x1080 (Posts)
			const canvasWidth = 1080;
			const canvasHeight = ratio === "9:16" ? 1920 : 1080;

			canvas.width = canvasWidth * pixelRatio;
			canvas.height = canvasHeight * pixelRatio;

			// Scale context to match pixel ratio so drawing coordinates remain the same
			ctx.scale(pixelRatio, pixelRatio);
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = "high";

			// Wait for fonts to be ready
			await document.fonts.ready;

			// Calculate dynamic height based on content
			const trackMaxWidth = 850;
			const authorMaxWidth = 850;
			const lyricsMaxWidth = 900;
			const lineHeight = 80;

			// Measure wrapped lines for track and author
			ctx.font = "50px Plus Jakarta Sans ExtraBold";
			const trackLinesCount =
				wrapText(ctx, track, 0, 0, trackMaxWidth, lineHeight) === 0
					? 1
					: wrapText(ctx, track, 0, 0, trackMaxWidth, lineHeight);
			ctx.font = "40px Plus Jakarta Sans SemiBold";
			const authorLinesCount =
				wrapText(ctx, author, 0, 0, authorMaxWidth, lineHeight) === 0
					? 1
					: wrapText(ctx, author, 0, 0, authorMaxWidth, lineHeight);

			// Measure wrapped lines for each lyric line
			const lyricsLineCounts = lyricsArray.map((lyric) => {
				ctx.font = "50px Plus Jakarta Sans ExtraBold";
				return wrapText(ctx, lyric, 0, 0, lyricsMaxWidth, lineHeight);
			});

			const totalLines = trackLinesCount + authorLinesCount + lyricsLineCounts.reduce((a, b) => a + b, 0);
			const contentHeight = 260 + (totalLines - 1) * 80;

			// Fill background (solid or gradient)
			if (gradient && gradColors && gradColors.length >= 2) {
				// Create diagonal gradient for more dynamic look (like Spotify)
				const gradientObj = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);

				// Add smooth color transitions with intermediate stops
				const colors = gradColors;
				const numColors = colors.length;

				// Primary color stops
				gradientObj.addColorStop(0, colors[0]);
				gradientObj.addColorStop(1, colors[numColors - 1]);

				// Add intermediate stops for smoother transitions
				for (let i = 1; i < numColors - 1; i++) {
					const position = i / (numColors - 1);
					gradientObj.addColorStop(position, colors[i]);
				}

				// Add subtle intermediate blends between each color pair
				for (let i = 0; i < numColors - 1; i++) {
					const midPosition = (i + 0.5) / numColors;
					// Blend between adjacent colors
					gradientObj.addColorStop(midPosition, colors[i]);
				}

				ctx.fillStyle = gradientObj;
			} else {
				ctx.fillStyle = bg;
			}
			ctx.fillRect(0, 0, canvas.width / pixelRatio, canvas.height / pixelRatio);
			ctx.closePath();

			// Draw foreground rounded rect - centered vertically based on canvas height
			ctx.beginPath();
			ctx.roundRect(40, (canvasHeight - contentHeight) / 2, 1000, contentHeight, 50);
			ctx.fillStyle = fg;
			ctx.fill();

			// Draw track name (with wrapping)
			ctx.font = "50px Plus Jakarta Sans ExtraBold";
			ctx.fillStyle = txt;
			let currentY = 103 + (canvasHeight - contentHeight) / 2;
			wrapText(ctx, track, 238, currentY, trackMaxWidth, lineHeight);

			// Draw author (with wrapping)
			ctx.font = "40px Plus Jakarta Sans SemiBold";
			currentY = 160 + (canvasHeight - contentHeight) / 2 + (trackLinesCount - 1) * lineHeight;
			wrapText(ctx, author, 238, currentY, authorMaxWidth, lineHeight);

			// Draw lyrics (with wrapping)
			ctx.font = "50px Plus Jakarta Sans ExtraBold";
			currentY = 260 + (canvasHeight - contentHeight) / 2 + (trackLinesCount + authorLinesCount - 2) * lineHeight;
			lyricsArray.forEach((lyric) => {
				const linesDrawn = wrapText(ctx, lyric, 95, currentY, lyricsMaxWidth, lineHeight);
				currentY += linesDrawn * lineHeight;
			});

			// Draw cover image - wait for it to load
			const coverImg = new Image();
			coverImg.crossOrigin = "anonymous";
			const coverLoaded = new Promise((resolve) => {
				coverImg.onload = () => {
					ctx.drawImage(coverImg, 90, 50 + (canvasHeight - contentHeight) / 2, 128, 128);
					resolve();
				};
			});
			coverImg.src = cover || "./fallback.png";
			await coverLoaded;

			// Draw lyrictify logo - wait for it to load (bottom left of card)
			const lyrictifyImg = new Image();
			lyrictifyImg.crossOrigin = "anonymous";
			const logoLoaded = new Promise((resolve) => {
				lyrictifyImg.onload = () => {
					const cardTop = (canvasHeight - contentHeight) / 2;
					const cardBottom = cardTop + contentHeight;
					ctx.drawImage(lyrictifyImg, 90, cardBottom - 100, 236, 70);
					resolve();
				};
			});
			lyrictifyImg.src = "./lyrictify.png";
			await logoLoaded;
		},
		[]
	);

	return { canvasRef, renderCanvas };
};
