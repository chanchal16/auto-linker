import { autoLinker } from "../src/index";

test("autoLinker should link URLs correctly", async () => {
  const text = "Check https://example.com";
  const result = await autoLinker(text, { className: "test" });
  console.log("res", result);
  expect(result).toBe(
    `Check <a href="https://example.com" class="link test">https://example.com</a>`
  );
});

test("autolinker should shorten long urls", async () => {
  const text =
    "Check out https://scanairobi.hashnode.dev/integration-testing-with-jest";
  const result = await autoLinker(text);
  expect(result).toBe(
    `Check out <a href="https://scanairobi.hashnode.dev/integration-testing-with-jest" class="link ">https://scanairobi.hashnode.dev/integration...</a>`
  );
});

test("auto-linker should open in new tab", async () => {
  const text = "Check https://example.com";
  const result = await autoLinker(text, { newTab: true });
  expect(result).toBe(
    `Check <a href="https://example.com" target="_blank" rel="noopener noreferrer" class="link ">https://example.com</a>`
  );
});

test("auto linker should detect emails", async () => {
  const text = "contact me at john@example.com";
  const result = await autoLinker(text);
  expect(result).toBe(
    `contact me at <a href="mailto:john@example.com" class="link ">john@example.com</a>`
  );
});

test("should link mentions", async () => {
  const text = "Hello @johndoe, how are you?";
  const result = await autoLinker(text, {
    newTab: true,
    mentionOptions: { prefix: "@", urlPrefix: "https://twitter.com/" },
  });
  expect(result).toBe(
    `Hello <a href="https://twitter.com/johndoe" class="link ">@johndoe</a>, how are you?`
  );
});

// Create a Response-like object
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

// Mock fetch globally
global.fetch = jest.fn(() => Promise.resolve(mockResponse));

// Define your test
test("auto-linker should preview link if enabled", async () => {
  const text = "Check out https://example.com";
  const result = await autoLinker(text, { newTab: true, linkPreview: true });

  expect(result).toContain('<div class="link-preview">');
  expect(result).toContain('<h4 class="title-ellipsis">Mock Title</h4>');
  expect(result).toContain(
    '<p class="description-ellipsis">Mock Description</p>'
  );
});