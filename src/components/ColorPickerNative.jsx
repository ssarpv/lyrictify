import "./ColorCustomization.css";

/**
 * Native Color Picker Component
 * HTML5 color input with hex value display
 */
export const ColorPickerNative = ({ tab, value, onChange }) => {
	const labels = {
		background: "Custom Background",
		foreground: "Custom Foreground",
		text: "Custom Text",
	};

	return (
		<div
			className="color-picker-native"
			id="color-panel"
			role="tabpanel"
			aria-labelledby={`${tab}-tab`}
		>
			<label htmlFor="colorPicker">{labels[tab]}</label>
			<div className="color-input-wrapper">
				<input
					type="color"
					id="colorPicker"
					aria-label={`Select custom ${tab} color`}
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
				<span className="color-value">{value}</span>
			</div>
		</div>
	);
};
