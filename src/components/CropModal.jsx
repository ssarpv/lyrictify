import Cropper from "react-easy-crop";
import "./CropModal.css";

/**
 * Crop Modal Component
 * Handles image cropping with pan, zoom, and rotation controls
 */
export const CropModal = ({
	show,
	image,
	crop,
	zoom,
	rotation,
	onCropChange,
	onZoomChange,
	onRotationChange,
	onCropComplete,
	onSave,
	onClose,
}) => {
	if (!show || !image) return null;

	return (
		<div className="modal crop-modal" style={{ display: "flex" }}>
			<div className="ModalContent crop-content">
				<button className="CloseButton" onClick={onClose} aria-label="Close crop modal">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
				<h2 className="modal-title">Crop Album Cover</h2>
				<p className="crop-instruction">Drag to pan, scroll to zoom, use slider for fine control</p>

				<div className="crop-container">
					<Cropper
						image={image}
						crop={crop}
						rotation={rotation}
						zoom={zoom}
						aspect={1}
						onCropChange={onCropChange}
						onZoomChange={onZoomChange}
						onCropComplete={onCropComplete}
						showGrid={true}
						cropShape="rect"
					/>
				</div>

				<div className="crop-controls">
					<div className="zoom-slider">
						<label>Zoom</label>
						<input
							type="range"
							min="1"
							max="3"
							step="0.1"
							value={zoom}
							onChange={(e) => onZoomChange(parseFloat(e.target.value))}
						/>
						<button
							type="button"
							className="reset-zoom-btn"
							onClick={() => onZoomChange(1)}
							title="Reset zoom"
						>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
								<path d="M3 3v5h5" />
							</svg>
						</button>
						<span className="slider-value">{zoom.toFixed(1)}x</span>
					</div>
					<div className="rotation-slider">
						<label>Rotate</label>
						<input
							type="range"
							min="-180"
							max="180"
							step="45"
							value={rotation}
							onChange={(e) => onRotationChange(parseFloat(e.target.value))}
						/>
						<button
							type="button"
							className="reset-rotation-btn"
							onClick={() => onRotationChange(0)}
							title="Reset rotation"
						>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
								<path d="M3 3v5h5" />
							</svg>
						</button>
						<span className="slider-value">{rotation}°</span>
					</div>
				</div>

				<div className="crop-actions">
					<button type="button" className="action-btn secondary" onClick={onClose}>
						Cancel
					</button>
					<button type="button" className="action-btn primary" onClick={onSave}>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M5 13l4 4L19 7" />
						</svg>
						Apply Crop
					</button>
				</div>
			</div>
		</div>
	);
};
