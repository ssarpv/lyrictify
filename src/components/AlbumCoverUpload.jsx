import "./AlbumCoverUpload.css";

/**
 * Album Cover Upload Component
 * Handles image upload and preview with recrop option
 */
export const AlbumCoverUpload = ({ coverImage, onUpload, onRecrop }) => {
	return (
		<div className="form-section">
			<h2 className="section-title">Album Cover</h2>

			<div className="file-upload">
				<input
					type="file"
					id="ImageInput"
					accept="image/png, image/jpeg"
					onChange={onUpload}
					hidden
				/>
				<button
					type="button"
					className="file-upload-btn"
					onClick={() => document.getElementById("ImageInput")?.click()}
					aria-label={coverImage ? "Change album cover" : "Upload album cover"}
				>
					{coverImage ? "Change Cover" : "Upload Album Cover"}
				</button>
				{coverImage && (
					<div className="preview-container">
						<img src={coverImage} alt="Preview" className="cover-preview" />
						<button
							type="button"
							className="crop-again-btn"
							onClick={onRecrop}
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M6.13 1L6 16a2 2 0 002 2h15M1 6.13L16 6a2 2 0 012 2v15" />
							</svg>
							Recrop
						</button>
					</div>
				)}
			</div>
		</div>
	);
};
