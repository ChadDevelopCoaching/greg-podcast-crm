import "@testing-library/jest-dom";

// Mock window.storage (non-standard Claude Code extension API)
global.window.storage = {
  get: vi.fn().mockResolvedValue(null),
  set: vi.fn().mockResolvedValue(true),
};
