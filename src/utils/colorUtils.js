/**
 * Color utilities for Lyrictify
 * Extract dominant colors from images and calculate brightness
 */

/**
 * Extract dominant colors from an image using canvas
 * @param {string} imageSrc - Data URL or URL to image
 * @param {number} colorCount - Number of colors to extract
 * @returns {Promise<string[]>} Array of hex color codes
 */
export const extractDominantColors = async (imageSrc, colorCount = 3) => {
	return new Promise((resolve) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			// Scale down for faster processing but keep more detail
			const scale = 150 / Math.max(img.width, img.height);
			canvas.width = img.width * scale;
			canvas.height = img.height * scale;
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			const data = imageData.data;
			const colorBuckets = new Map();

			// Sample more pixels with finer quantization for smoother colors
			const step = 2;
			for (let i = 0; i < data.length; i += 4 * step) {
				const r = data[i];
				const g = data[i + 1];
				const b = data[i + 2];
				const a = data[i + 3];

				// Skip transparent and very dark pixels
				if (a < 128) continue;
				const brightness = (r + g + b) / 3;
				if (brightness < 20) continue;

				// Finer quantization (16 instead of 32) for smoother gradients
				const qr = Math.round(r / 16) * 16;
				const qg = Math.round(g / 16) * 16;
				const qb = Math.round(b / 16) * 16;
				const key = `${qr},${qg},${qb}`;

				colorBuckets.set(key, (colorBuckets.get(key) || 0) + 1);
			}

			// Sort by frequency and get top colors
			let sortedColors = Array.from(colorBuckets.entries())
				.sort((a, b) => b[1] - a[1])
				.slice(0, colorCount * 2) // Get extra colors to filter
				.map(([key]) => {
					const [r, g, b] = key.split(",").map(Number);
					return {
						r,
						g,
						b,
						hex: `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`,
					};
				});

			// Filter out similar colors for better gradient variety
			const filteredColors = [];
			const minColorDistance = 50; // Minimum Euclidean distance between colors

			for (const color of sortedColors) {
				let isDifferent = true;
				for (const existing of filteredColors) {
					const distance = Math.sqrt(
						Math.pow(color.r - existing.r, 2) +
							Math.pow(color.g - existing.g, 2) +
							Math.pow(color.b - existing.b, 2)
					);
					if (distance < minColorDistance) {
						isDifferent = false;
						break;
					}
				}
				if (isDifferent) {
					filteredColors.push(color);
				}
				if (filteredColors.length >= colorCount) break;
			}

			// Pad with darker variants if not enough colors
			while (filteredColors.length < colorCount) {
				if (filteredColors.length === 1) {
					// Create darker variant of first color
					const base = filteredColors[0];
					const darken = 0.7;
					filteredColors.push({
						r: Math.round(base.r * darken),
						g: Math.round(base.g * darken),
						b: Math.round(base.b * darken),
						hex: `#${((1 << 24) + (Math.round(base.r * darken) << 16) + (Math.round(base.g * darken) << 8) + Math.round(base.b * darken)).toString(16).slice(1)}`,
					});
				} else {
					filteredColors.push({ r: 30, g: 30, b: 30, hex: "#1e1e1e" });
				}
			}

			resolve(filteredColors.map((c) => c.hex));
		};
		img.onerror = () => {
			// Fallback colors
			resolve(["#222222", "#111111", "#000000"]);
		};
		img.src = imageSrc;
	});
};

/**
 * Calculate perceived brightness of a color using ITU-R BT.709 formula
 * @param {string} hexColor - Hex color code
 * @returns {number} Brightness value (0-255)
 */
export const calculateBrightness = (hexColor) => {
	const r = parseInt(hexColor.slice(1, 3), 16);
	const g = parseInt(hexColor.slice(3, 5), 16);
	const b = parseInt(hexColor.slice(5, 7), 16);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Determine text color (light or dark) based on background brightness
 * @param {string} backgroundColor - Hex color code
 * @returns {string} '#ffffff' for dark backgrounds, '#111111' for light backgrounds
 */
export const getContrastingTextColor = (backgroundColor) => {
	const brightness = calculateBrightness(backgroundColor);
	return brightness < 128 ? "#ffffff" : "#111111";
};

/**
 * Preset color palettes for better mobile UX
 */
export const COLOR_PRESETS = {
	background: ["#222222", "#1a1a2e", "#16213e", "#0f0f23", "#2d132c", "#1b4332", "#780000", "#3d0000"],
	foreground: ["#111111", "#0f3460", "#1a406e", "#1a1a2e", "#4a0e4e", "#0d7377", "#9b2226", "#660708"],
	text: ["#eeeeee", "#e94560", "#00adb5", "#ffc107", "#ff6b6b", "#4ecdc4", "#a8e6cf", "#fdffab"],
};
