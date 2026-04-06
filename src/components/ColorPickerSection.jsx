import { COLOR_PRESETS } from "../utils/colorUtils";
import { ColorSwatches } from "./ColorSwatches";
import { ColorPickerNative } from "./ColorPickerNative";
import { GradientToggle } from "./GradientToggle";
import { ColorTabs } from "./ColorTabs";
import "./ColorCustomization.css";

/**
 * Color Picker Section Component
 * Combines color tabs, gradient toggles, swatches, and native color picker
 */
export const ColorPickerSection = ({
	activeColorTab,
	setActiveColorTab,
	backgroundColor,
	foregroundColor,
	textColor,
	setBackgroundColor,
	setForegroundColor,
	setTextColor,
	coverImage,
	useGradient,
	setUseGradient,
	gradientColors,
	setGradientColors,
	useCustomGradient,
	setUseCustomGradient,
	customGradientColors,
	setCustomGradientColors,
	useCoverForForeground,
	setUseCoverForForeground,
}) => {
	const handleCustomGradientChange = (newColors) => {
		setCustomGradientColors(newColors);
		if (useGradient) {
			setGradientColors(newColors);
		}
	};

	return (
		<div className="form-section">
			<h2 className="section-title">Colors</h2>

			<ColorTabs activeTab={activeColorTab} onTabChange={setActiveColorTab} />

			{/* Gradient Toggle - Background tab */}
			{activeColorTab === "background" && coverImage && (
				<GradientToggle
					enabled={useGradient}
					onToggle={setUseGradient}
					label="Use gradient from album cover"
					gradientColors={gradientColors}
					showPreview={useGradient && !useCustomGradient}
				/>
			)}

			{/* Foreground color from cover */}
			{activeColorTab === "foreground" && coverImage && (
				<GradientToggle
					enabled={useCoverForForeground}
					onToggle={setUseCoverForForeground}
					label="Use color from album cover"
				/>
			)}

			{/* Custom Gradient Option */}
			{activeColorTab === "background" && (
				<GradientToggle
					enabled={useCustomGradient}
					onToggle={setUseCustomGradient}
					label="Use custom gradient colors"
					customColors={customGradientColors}
					onCustomColorChange={handleCustomGradientChange}
				/>
			)}

			<div className="color-picker-section">
				<ColorSwatches
					colors={
						activeColorTab === "background"
							? COLOR_PRESETS.background
							: activeColorTab === "foreground"
							? COLOR_PRESETS.foreground
							: COLOR_PRESETS.text
					}
					selectedColor={
						activeColorTab === "background"
							? backgroundColor
							: activeColorTab === "foreground"
							? foregroundColor
							: textColor
					}
					onSelectColor={
						activeColorTab === "background"
							? setBackgroundColor
							: activeColorTab === "foreground"
							? setForegroundColor
							: setTextColor
					}
				/>

				<ColorPickerNative
					tab={activeColorTab}
					value={
						activeColorTab === "background"
							? backgroundColor
							: activeColorTab === "foreground"
							? foregroundColor
							: textColor
					}
					onChange={
						activeColorTab === "background"
							? setBackgroundColor
							: activeColorTab === "foreground"
							? setForegroundColor
							: setTextColor
					}
				/>
			</div>
		</div>
	);
};
