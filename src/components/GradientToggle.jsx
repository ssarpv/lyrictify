import "./ColorCustomization.css";

/**
 * Gradient Toggle Component
 * Checkbox toggle for enabling gradient from album cover or custom gradient
 */
export const GradientToggle = ({
	enabled,
	onToggle,
	label,
	gradientColors,
	showPreview,
	customColors,
	onCustomColorChange,
}) => {
	return (
		<div className="gradient-toggle">
			<label className="toggle-label">
				<input type="checkbox" checked={enabled} onChange={(e) => onToggle(e.target.checked)} />
				<span>{label}</span>
			</label>
			{showPreview && gradientColors?.length > 0 && (
				<div className="gradient-preview">
					<span>Preview:</span>
					<div
						className="gradient-preview-box"
						style={{
							background: `linear-gradient(180deg, ${gradientColors.join(", ")})`,
						}}
					/>
				</div>
			)}
			{customColors && (
				<div className="custom-gradient-colors" style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
					<div className="gradient-color-input">
						<label>Color 1</label>
						<input
							type="color"
							value={customColors[0]}
							onChange={(e) => {
								const newColors = [...customColors];
								newColors[0] = e.target.value;
								onCustomColorChange(newColors);
							}}
						/>
					</div>
					<div className="gradient-color-input">
						<label>Color 2</label>
						<input
							type="color"
							value={customColors[1] || "#111111"}
							onChange={(e) => {
								const newColors = [...customColors];
								newColors[1] = e.target.value;
								onCustomColorChange(newColors);
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
};
