import { fetchLinkPreview } from "../src/linkPreview";

let metadataCache: Record<string, string> = {};

describe("fetchLinkPreview", () => {
  beforeEach(() => {
    metadataCache = {}; // Reset the cache before each test
  });
  test("should return preview HTML on successful response", async () => {
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          title: "Mock Title",
          description: "Mock Description",
          images: ["https://example.com/image.jpg"],
          url: "https://example.com",
          domain: "example.com",
        }),
    } as unknown as Response; // Cast to `Response` type

    global.fetch = jest.fn(() => Promise.resolve(mockResponse));

    const preview = await fetchLinkPreview("https://example.com");

    expect(preview).toContain('<div class="link-preview">');
    expect(preview).toContain('<h4 class="title-ellipsis">Mock Title</h4>');
    expect(preview).toContain(
      '<p class="description-ellipsis">Mock Description</p>'
    );
  });

  test("should handle errors and return empty string", async () => {
    const mockErrorResponse = new Error("Network Error");
    global.fetch = jest.fn(() => Promise.reject(mockErrorResponse));
    metadataCache = {};
    const preview = await fetchLinkPreview("https://google.com");
    expect(preview).toBe("");
  });

  test("should not generate preveiw if data not available", async () => {
    const mockResponse = {
      ok: true,
      json: () =>
        Promise.resolve({
          title: "Mock Title",
          description: null,
          images: ["https://react.com/image.jpg"],
          url: "https://react.com",
          domain: "react.com",
        }),
    } as unknown as Response;
    global.fetch = jest.fn(() => Promise.reject(mockResponse));
    metadataCache = {};
    const preview = await fetchLinkPreview("https://react.com");
    expect(preview).toBe("");
  });
});
