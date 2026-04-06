import { useState, useRef, useEffect, useCallback } from "react";
import { debounce } from "./utils/debounce";
import { extractDominantColors, getContrastingTextColor } from "./utils/colorUtils";
import { getCroppedImg } from "./utils/cropUtils";
import { useCanvasRenderer } from "./hooks/useCanvasRenderer";
import { SongDetailsForm } from "./components/SongDetailsForm";
import { AlbumCoverUpload } from "./components/AlbumCoverUpload";
import { ColorPickerSection } from "./components/ColorPickerSection";
import { CropModal } from "./components/CropModal";
import { ResultModal } from "./components/ResultModal";
import "./App.css";

function App() {
	// Form state
	const [trackName, setTrackName] = useState("");
	const [author, setAuthor] = useState("");
	const [lyrics, setLyrics] = useState("");

	// Image state
	const [coverImage, setCoverImage] = useState(null);
	const [rawImage, setRawImage] = useState(null);

	// Color state
	const [backgroundColor, setBackgroundColor] = useState("#222222");
	const [foregroundColor, setForegroundColor] = useState("#111111");
	const [textColor, setTextColor] = useState("#eeeeee");
	const [activeColorTab, setActiveColorTab] = useState("background");

	// Gradient state
	const [useGradient, setUseGradient] = useState(false);
	const [useCustomGradient, setUseCustomGradient] = useState(false);
	const [gradientColors, setGradientColors] = useState([]);
	const [customGradientColors, setCustomGradientColors] = useState(["#222222", "#111111"]);
	const [useCoverForForeground, setUseCoverForForeground] = useState(false);

	// Aspect ratio state
	const [aspectRatio, setAspectRatio] = useState("9:16");

	// Modal state
	const [showModal, setShowModal] = useState(false);
	const [showCropModal, setShowCropModal] = useState(false);
	const [modalAnimating, setModalAnimating] = useState(false);
	const [modalOffset, setModalOffset] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState(0);

	// Crop state
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [rotation, setRotation] = useState(0);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

	// Custom hook for canvas rendering
	const { canvasRef, renderCanvas } = useCanvasRenderer();
	const fileInputRef = useRef(null);

	// Load fonts on mount
	useEffect(() => {
		const loadFont = (name, url) => {
			const fontFace = new FontFace(name, `url(${url})`);
			fontFace
				.load()
				.then((font) => {
					document.fonts.add(font);
				})
				.catch((e) => {
					console.error("Font loading error:", e);
				});
		};

		loadFont("Plus Jakarta Sans ExtraBold", "./ExtraBold.ttf");
		loadFont("Plus Jakarta Sans SemiBold", "./SemiBold.ttf");
	}, []);

	// Extract colors from cover image when uploaded
	useEffect(() => {
		if (coverImage) {
			extractDominantColors(coverImage, 4).then((colors) => {
				// Set gradient colors
				if (useGradient && !useCustomGradient) {
					setGradientColors(colors);
				}

				// Auto-set foreground color from cover if enabled
				if (useCoverForForeground && colors.length >= 2) {
					setForegroundColor(colors[colors.length - 2] || colors[colors.length - 1]);
				}
			});
		}
	}, [coverImage, useGradient, useCustomGradient, useCoverForForeground]);

	// Auto-adjust text color based on foreground brightness
	useEffect(() => {
		setTextColor(getContrastingTextColor(foregroundColor));
	}, [foregroundColor]);

	// Modal handlers
	const handleCloseModal = useCallback(() => {
		setModalAnimating(false);
		setModalOffset(0);
		setIsDragging(false);
		setShowModal(false);
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		setModalAnimating(true);
		setShowModal(true);
	};

	// Keyboard navigation - Escape to close modals
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Escape") {
				if (showCropModal) {
					setShowCropModal(false);
				} else if (showModal) {
					handleCloseModal();
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [showCropModal, showModal, handleCloseModal]);

	// Render canvas when modal opens
	useEffect(() => {
		if (!showModal) return;

		const debouncedRender = debounce(() => {
			renderCanvas(
				trackName,
				author,
				lyrics,
				coverImage,
				backgroundColor,
				foregroundColor,
				textColor,
				aspectRatio,
				useGradient,
				gradientColors
			);
		}, 300);

		debouncedRender();

		return () => {
			debouncedRender.cancel();
		};
	}, [
		showModal,
		renderCanvas,
		trackName,
		author,
		lyrics,
		coverImage,
		backgroundColor,
		foregroundColor,
		textColor,
		aspectRatio,
		useGradient,
		gradientColors,
	]);

	// Image upload handler
	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				setRawImage(event.target.result);
				setShowCropModal(true);
				setCrop({ x: 0, y: 0 });
				setZoom(1);
				setRotation(0);
				setCroppedAreaPixels(null);
			};
			reader.readAsDataURL(file);
			e.target.value = "";
		}
	};

	const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
		setCroppedAreaPixels(croppedAreaPixels);
	}, []);

	const handleCropSave = useCallback(async () => {
		if (!rawImage || !croppedAreaPixels) return;

		try {
			const croppedImage = await getCroppedImg(rawImage, croppedAreaPixels, rotation);
			setCoverImage(croppedImage);
			setShowCropModal(false);
		} catch (err) {
			console.error("Error cropping image:", err);
			alert("Failed to crop image. Please try again.");
		}
	}, [rawImage, croppedAreaPixels, rotation]);

	// Bottom sheet swipe handlers
	const handleTouchStart = useCallback((e) => {
		setIsDragging(true);
		setDragStart(e.touches[0].clientY);
	}, []);

	const handleTouchMove = useCallback(
		(e) => {
			if (!isDragging) return;
			const deltaY = e.touches[0].clientY - dragStart;
			if (deltaY > 0) {
				setModalOffset(deltaY);
			}
		},
		[isDragging, dragStart]
	);

	const handleTouchEnd = useCallback(() => {
		setIsDragging(false);
		if (modalOffset > 150) {
			setShowModal(false);
		}
		setModalOffset(0);
	}, [modalOffset]);

	const handleMouseDown = useCallback((e) => {
		setIsDragging(true);
		setDragStart(e.clientY);
	}, []);

	const handleMouseMove = useCallback(
		(e) => {
			if (!isDragging) return;
			const deltaY = e.clientY - dragStart;
			if (deltaY > 0) {
				setModalOffset(deltaY);
			}
		},
		[isDragging, dragStart]
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
		if (modalOffset > 150) {
			setShowModal(false);
		}
		setModalOffset(0);
	}, [modalOffset]);

	// Download and share handlers
	const handleDownload = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const link = document.createElement("a");
		link.download = `lyrictify-${Date.now()}.png`;
		link.href = canvas.toDataURL("image/png");
		link.click();
	};

	const handleShare = async () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		canvas.toBlob(
			async (blob) => {
				const file = new File([blob], "lyrictify.png", { type: "image/png" });

				if (!navigator.canShare) {
					alert("This browser does not support web sharing. Please try another browser.");
					return;
				}

				if (navigator.canShare({ files: [file] })) {
					try {
						await navigator.share({ files: [file] });
					} catch (err) {
						alert(err.message);
					}
				} else {
					alert("This Lyrictify could not be shared.");
				}
			},
			"image/png",
			1.0
		);
	};

	// Aspect ratio change handler that re-renders canvas
	const handleAspectRatioChange = useCallback(
		(newRatio) => {
			setAspectRatio(newRatio);
			if (showModal) {
				renderCanvas(
					trackName,
					author,
					lyrics,
					coverImage,
					backgroundColor,
					foregroundColor,
					textColor,
					newRatio,
					useGradient,
					gradientColors
				);
			}
		},
		[
			showModal,
			trackName,
			author,
			lyrics,
			coverImage,
			backgroundColor,
			foregroundColor,
			textColor,
			useGradient,
			gradientColors,
			renderCanvas,
		]
	);

	return (
		<>
			<div className="app-container">
				<header className="app-header">
					<img src="./lyrictify.png" alt="Lyrictify" className="logo" />
					<p className="tagline">{import.meta.env.VITE_COMMIT_MSG}</p>
				</header>

				<form id="CardForm" onSubmit={handleSubmit} autoComplete="off">
					<SongDetailsForm
						trackName={trackName}
						author={author}
						lyrics={lyrics}
						onTrackChange={setTrackName}
						onAuthorChange={setAuthor}
						onLyricsChange={setLyrics}
					/>

					<AlbumCoverUpload
						coverImage={coverImage}
						onUpload={handleImageUpload}
						onRecrop={() => {
							setRawImage(coverImage);
							setShowCropModal(true);
						}}
					/>

					<ColorPickerSection
						activeColorTab={activeColorTab}
						setActiveColorTab={setActiveColorTab}
						backgroundColor={backgroundColor}
						setBackgroundColor={setBackgroundColor}
						foregroundColor={foregroundColor}
						setForegroundColor={setForegroundColor}
						textColor={textColor}
						setTextColor={setTextColor}
						coverImage={coverImage}
						useGradient={useGradient}
						setUseGradient={setUseGradient}
						gradientColors={gradientColors}
						setGradientColors={setGradientColors}
						useCustomGradient={useCustomGradient}
						setUseCustomGradient={setUseCustomGradient}
						customGradientColors={customGradientColors}
						setCustomGradientColors={setCustomGradientColors}
						useCoverForForeground={useCoverForForeground}
						setUseCoverForForeground={setUseCoverForForeground}
					/>

					<button type="submit" className="submit-btn">
						Generate Card
					</button>
				</form>

				<footer className="app-footer">
					<span>Built with ❤️ by Velo</span>
				</footer>
			</div>

			<CropModal
				show={showCropModal}
				image={rawImage}
				crop={crop}
				zoom={zoom}
				rotation={rotation}
				onCropChange={setCrop}
				onZoomChange={setZoom}
				onRotationChange={setRotation}
				onCropComplete={onCropComplete}
				onSave={handleCropSave}
				onClose={() => setShowCropModal(false)}
			/>

			<ResultModal
				show={showModal}
				aspectRatio={aspectRatio}
				onAspectRatioChange={handleAspectRatioChange}
				onDownload={handleDownload}
				onShare={handleShare}
				onClose={handleCloseModal}
				canvasRef={canvasRef}
			/>
		</>
	);
}

export default App;
