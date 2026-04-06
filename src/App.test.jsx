import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

// Mock the canvas API
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4) })),
  fillText: jest.fn(),
  measureText: jest.fn(() => ({ width: 100 })),
  beginPath: jest.fn(),
  closePath: jest.fn(),
  fill: jest.fn(),
  roundRect: jest.fn(),
  drawImage: jest.fn(),
  scale: jest.fn(),
  set transform(v) {},
  imageSmoothingEnabled: true,
  imageSmoothingQuality: "high",
}));

// Mock FontFace API
global.FontFace = jest.fn(() => ({
  load: jest.fn(() => Promise.resolve()),
}));
global.document.fonts = {
  add: jest.fn(),
  ready: Promise.resolve(),
};

// Mock FileReader
global.FileReader = class MockFileReader {
  constructor() {
    this.result = "mock-data-url";
  }
  readAsDataURL() {
    setTimeout(() => {
      if (this.onload) {
        this.onload({ target: { result: this.result } });
      }
    }, 0);
  }
};

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders app header and title", () => {
    render(<App />);

    expect(screen.getByText("Lyrictify")).toBeInTheDocument();
    expect(
      screen.getByText(/create beautiful lyric cards/i),
    ).toBeInTheDocument();
  });

  test("renders form inputs for track details", () => {
    render(<App />);

    expect(screen.getByLabelText(/track name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/artist/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lyrics/i)).toBeInTheDocument();
  });

  test("renders album cover upload button", () => {
    render(<App />);

    expect(
      screen.getByRole("button", { name: /upload album cover/i }),
    ).toBeInTheDocument();
  });

  test("renders color customization tabs", () => {
    render(<App />);

    expect(screen.getByRole("tab", { name: "Background" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Foreground" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Text" })).toBeInTheDocument();
  });

  test("renders submit button", () => {
    render(<App />);

    expect(
      screen.getByRole("button", { name: /generate card/i }),
    ).toBeInTheDocument();
  });

  test("updates track name input state", () => {
    render(<App />);

    const trackInput = screen.getByLabelText(/track name/i);
    fireEvent.change(trackInput, { target: { value: "Test Song" } });

    expect(trackInput.value).toBe("Test Song");
  });

  test("updates artist input state", () => {
    render(<App />);

    const artistInput = screen.getByLabelText(/artist/i);
    fireEvent.change(artistInput, { target: { value: "Test Artist" } });

    expect(artistInput.value).toBe("Test Artist");
  });

  test("updates lyrics textarea state", () => {
    render(<App />);

    const lyricsInput = screen.getByLabelText(/lyrics/i);
    fireEvent.change(lyricsInput, { target: { value: "Test lyrics" } });

    expect(lyricsInput.value).toBe("Test lyrics");
  });

  test("switches color tabs when clicking tab buttons", () => {
    render(<App />);

    const foregroundTab = screen.getByRole("tab", { name: "Foreground" });
    fireEvent.click(foregroundTab);

    expect(foregroundTab).toHaveAttribute("aria-selected", "true");

    const textTab = screen.getByRole("tab", { name: "Text" });
    fireEvent.click(textTab);

    expect(textTab).toHaveAttribute("aria-selected", "true");
  });
});
