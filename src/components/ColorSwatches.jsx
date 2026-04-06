import "./ColorCustomization.css";

/**
 * Color Swatches Component
 * Grid of preset color swatches for quick selection
 */
export const ColorSwatches = ({ colors, selectedColor, onSelectColor }) => {
	return (
		<div className="color-swatches">
			{colors.map((color) => (
				<button
					key={color}
					type="button"
					className={`color-swatch ${selectedColor === color ? "selected" : ""}`}
					style={{
						backgroundColor: color,
						borderColor: selectedColor === color ? "#fff" : "transparent",
					}}
					onClick={() => onSelectColor(color)}
					aria-label={`Select color ${color}`}
					aria-pressed={selectedColor === color}
					tabIndex={0}
				/>
			))}
		</div>
	);
};
