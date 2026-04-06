import { downloadImage } from "./download";

describe("downloadImage", () => {
  let mockCanvas;
  let mockLink;
  let originalCreateElement;
  let appendedElements;

  beforeEach(() => {
    // Mock canvas
    mockCanvas = {
      toDataURL: jest.fn(() => "data:image/png;base64,mockdata"),
    };

    // Mock anchor link
    mockLink = {
      click: jest.fn(),
      download: "",
      href: "",
    };

    // Track appended elements
    appendedElements = [];

    // Mock document.createElement for anchor
    originalCreateElement = document.createElement;
    document.createElement = jest.fn((tag) => {
      if (tag === "a") {
        return mockLink;
      }
      return originalCreateElement.call(document, tag);
    });

    // Mock body.appendChild
    document.body.appendChild = jest.fn((el) => {
      appendedElements.push(el);
      return el;
    });

    // Mock body.removeChild
    document.body.removeChild = jest.fn((el) => {
      appendedElements = appendedElements.filter((e) => e !== el);
    });
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
    jest.clearAllMocks();
  });

  test("creates download link with correct attributes", () => {
    downloadImage(mockCanvas);

    expect(mockCanvas.toDataURL).toHaveBeenCalledWith("image/png");
    expect(mockLink.download).toMatch(/^lyrictify-\d+\.png$/);
    expect(mockLink.href).toBe("data:image/png;base64,mockdata");
  });

  test("clicks the download link", () => {
    downloadImage(mockCanvas);

    expect(mockLink.click).toHaveBeenCalledTimes(1);
  });

  test("appends and removes link from body", () => {
    downloadImage(mockCanvas);

    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
  });

  test("generates unique filename with timestamp", () => {
    const before = Date.now();
    downloadImage(mockCanvas);
    const after = Date.now();

    const filename = mockLink.download;
    const timestamp = parseInt(filename.match(/lyrictify-(\d+)\.png/)[1]);

    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
  });
});
