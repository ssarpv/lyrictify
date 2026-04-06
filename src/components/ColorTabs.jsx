import "./ColorCustomization.css";

/**
 * Color Tabs Component
 * Tab buttons for switching between background, foreground, and text color customization
 */
export const ColorTabs = ({ activeTab, onTabChange }) => {
	const tabs = [
		{ id: "background", label: "Background" },
		{ id: "foreground", label: "Foreground" },
		{ id: "text", label: "Text" },
	];

	return (
		<div className="color-tabs" role="tablist" aria-label="Color customization tabs">
			{tabs.map((tab) => (
				<button
					key={tab.id}
					type="button"
					className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
					onClick={() => onTabChange(tab.id)}
					role="tab"
					aria-selected={activeTab === tab.id}
					aria-controls="color-panel"
					id={`${tab.id}-tab`}
				>
					{tab.label}
				</button>
			))}
		</div>
	);
};
