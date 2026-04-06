# Lyrictify

Create beautiful, shareable lyric cards for your favorite songs. Perfect for Instagram Stories (9:16) and Posts (1:1).

![Lyrictify Example](./lyrictify.png)

[![Deploy to GitHub Pages](https://img.shields.io/github/actions/workflow/status/ssarpv/lyrictify/deploy.yml)](https://github.com/sarp/lyrictify/actions/workflows/deploy.yml)
[![Built with Vite](https://img.shields.io/badge/built%20with-vite-646cff?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)

## Features

- **Real-time Preview**: See your lyric card update as you type
- **Custom Album Covers**: Upload and crop your own album artwork
- **Gradient Backgrounds**: Auto-extract dominant colors from album covers for beautiful gradient backgrounds
- **Smart Color Detection**: Automatically adjusts text color based on foreground brightness for optimal contrast
- **Auto-Foreground Color**: Extract foreground color directly from album artwork
- **Custom Gradient Option**: Define your own gradient colors for full control
- **Customizable Colors**: Choose from preset palettes or pick custom colors for background, foreground, and text
- **High-DPI Export**: Crisp, high-resolution exports optimized for Retina and mobile displays
- **Direct Sharing**: Share directly to social media apps via Web Share API (mobile)
- **Responsive Design**: Mobile-first UI that works great on all devices

## Tech Stack

- **Framework**: React 18 with Vite
- **Language**: JavaScript (JSX)
- **Canvas**: HTML5 Canvas API for image generation
- **Image Cropping**: react-easy-crop
- **Fonts**: Plus Jakarta Sans (ExtraBold, SemiBold)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lyrictify.git
   cd lyrictify/updated
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

## Development Commands

All commands should be run from the `updated/` directory:

```bash
# Install dependencies
npm install

# Start dev server with hot module replacement
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Usage

1. **Enter Song Details**: Fill in the track name, artist, and lyrics
2. **Upload Album Cover**: Click "Upload Album Cover" to select an image, then crop it to your liking
3. **Customize Colors**:
   - **Background**: Choose from preset swatches or use the custom color picker
   - **Foreground**: Enable "Use color from album cover" to auto-extract from your uploaded image
   - **Gradient**: Enable "Use gradient from album cover" for multi-color backgrounds, or use "Custom gradient" to define your own colors
   - **Text**: Automatically adjusts between light/dark based on foreground brightness
4. **Generate Card**: Click "Generate Card" to preview your creation
5. **Save or Share**: Download as PNG or share directly to social media (mobile)

## Project Structure

```
lyrictify/
├── src/
│   ├── App.jsx                 # Main app component (composed of smaller components)
│   ├── App.css                 # Global styles
│   ├── main.jsx                # React entry point
│   ├── index.css               # Base styles
│   ├── hooks/
│   │   ├── useCanvasRenderer.js # Canvas rendering custom hook
│   │   └── index.js
│   ├── components/
│   │   ├── SongDetailsForm.jsx   # Track/artist/lyrics form
│   │   ├── AlbumCoverUpload.jsx  # Image upload & preview
│   │   ├── ColorTabs.jsx         # Color category tabs
│   │   ├── ColorSwatches.jsx     # Preset color grid
│   │   ├── ColorPickerNative.jsx # HTML5 color picker
│   │   ├── GradientToggle.jsx    # Gradient toggle component
│   │   ├── ColorPickerSection.jsx# Combined color UI
│   │   ├── CropModal.jsx         # Image crop modal
│   │   ├── ResultModal.jsx       # Result bottom sheet
│   │   ├── index.js
│   │   └── *.css
│   ├── utils/
│   │   ├── colorUtils.js         # Color extraction & utilities
│   │   ├── cropUtils.js          # Image cropping utilities
│   │   ├── debounce.js           # Debounce utility
│   │   └── index.js
│   └── public/                   # Static assets (fonts, images)
├── index.html
├── vite.config.js
├── package.json
├── .github/workflows/
│   └── deploy.yml                # GitHub Pages deployment
└── README.md                     # This file
```

## Canvas Rendering

The lyric card is rendered on an HTML5 canvas at 1080x1920 pixels (9:16 aspect ratio). Key rendering features:

- **Dynamic Height**: Card content height adjusts based on the number of lyric lines
- **Text Wrapping**: Long text automatically wraps to fit within the card bounds
- **High-DPI Support**: Canvas scales internal resolution by `devicePixelRatio` for crisp exports on Retina/HiDPI displays
- **Font Loading**: Uses FontFace API to ensure custom fonts are loaded before rendering

## High-DPI Export

The canvas rendering accounts for device pixel ratio to ensure exports look sharp on all displays:

```javascript
const pixelRatio = window.devicePixelRatio || 1;
canvas.width = 1080 * pixelRatio;
canvas.height = 1920 * pixelRatio;
ctx.scale(pixelRatio, pixelRatio);
```

This means:
- Standard displays (1x): 1080x1920 internal resolution
- Retina displays (2x): 2160x3840 internal resolution
- High-DPI mobile (3x): 3240x5760 internal resolution

## Image Cropping

Album cover cropping is handled by `react-easy-crop`:

1. User uploads an image
2. Crop modal opens with pan/zoom/rotate controls
3. Cropped area is extracted using canvas operations
4. Result is stored as a data URL for the card preview

## Deployment

### GitHub Pages Setup

1. Go to your repository's **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to the `mommy` branch (or trigger workflow manually)
4. The workflow will automatically build and deploy

The site will be available at `https://<username>.github.io/lyrictify/`

### Workflow Status

Check deployment status in the **Actions** tab or via the badge at the top of this README.

### Manual Build

```bash
npm run build
# Deploy the dist/ folder to your hosting
```

### Manual Build

```bash
npm run build
# Deploy the dist/ folder to your hosting
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers with Web Share API support for sharing feature

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test thoroughly on both desktop and mobile
4. Submit a pull request to `master`

## Development Team

- **Sarp Varol**: Lead/Architecture & Logic
- **Mikail Kara**: UI/UX, CSS, & Accessibility
- **Kaan Türk**: Canvas API, Graphics & Performance

## License

MIT

## Acknowledgments

- Font: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
- Built with ❤️ by Velo
