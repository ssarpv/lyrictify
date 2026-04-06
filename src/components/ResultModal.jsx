import { useRef } from "react";
import "./ResultModal.css";

/**
 * Result Modal Component (Bottom Sheet)
 * Displays the generated lyric card with download and share options
 */
export const ResultModal = ({
	show,
	aspectRatio,
	onAspectRatioChange,
	onDownload,
	onShare,
	onClose,
	canvasRef,
}) => {
	const modalContentRef = useRef(null);

	if (!show) return null;

	const handleOverlayClick = (e) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div id="ResultModal" className="modal open" onClick={handleOverlayClick}>
			<div className="ModalContent" ref={modalContentRef}>
				{/* Drag Handle */}
				<div className="drag-handle" />
				<button className="CloseButton" onClick={onClose} aria-label="Close modal">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
				<h2 className="modal-title">Your Lyric Card</h2>

				{/* Aspect Ratio Toggle */}
				<div className="aspect-ratio-toggle">
					<button
						type="button"
						className={`ratio-btn ${aspectRatio === "9:16" ? "active" : ""}`}
						onClick={() => onAspectRatioChange("9:16")}
						aria-pressed={aspectRatio === "9:16"}
					>
						<span className="ratio-icon">
							<svg width="20" height="24" viewBox="0 0 20 24" fill="none" stroke="currentColor" strokeWidth="2">
								<rect x="1" y="1" width="18" height="22" rx="2" />
							</svg>
						</span>
						<span className="ratio-label">Stories</span>
						<span className="ratio-dim">9:16</span>
					</button>
					<button
						type="button"
						className={`ratio-btn ${aspectRatio === "1:1" ? "active" : ""}`}
						onClick={() => onAspectRatioChange("1:1")}
						aria-pressed={aspectRatio === "1:1"}
					>
						<span className="ratio-icon">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<rect x="1" y="1" width="22" height="22" rx="2" />
							</svg>
						</span>
						<span className="ratio-label">Post</span>
						<span className="ratio-dim">1:1</span>
					</button>
				</div>

				<canvas ref={canvasRef} id="CardCanvas" />

				<div className="ButtonContainer">
					<button type="button" className="action-btn primary" onClick={onDownload}>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
						</svg>
						Save Image
					</button>
					<button type="button" className="action-btn secondary" onClick={onShare}>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<circle cx="18" cy="5" r="3" />
							<circle cx="6" cy="12" r="3" />
							<circle cx="18" cy="19" r="3" />
							<path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
						</svg>
						Share
					</button>
				</div>
			</div>
		</div>
	);
};
