import { debounce } from "./debounce";

describe("debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test("delays function execution by specified wait time", () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn("arg1", "arg2");

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(299);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
  });

  test("cancels previous call when invoked again before wait time", () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn("first");
    jest.advanceTimersByTime(150);

    debouncedFn("second");
    jest.advanceTimersByTime(150);

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(150);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("second");
  });

  test("cancel method prevents function execution", () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn("arg");
    debouncedFn.cancel();

    jest.advanceTimersByTime(300);
    expect(mockFn).not.toHaveBeenCalled();
  });

  test("cancel can be called multiple times safely", () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn("arg");
    debouncedFn.cancel();
    debouncedFn.cancel();
    debouncedFn.cancel();

    jest.advanceTimersByTime(300);
    expect(mockFn).not.toHaveBeenCalled();
  });

  test("allows new execution after cancel", () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 300);

    debouncedFn("first");
    debouncedFn.cancel();

    jest.advanceTimersByTime(100);
    debouncedFn("second");

    jest.advanceTimersByTime(300);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("second");
  });
});
