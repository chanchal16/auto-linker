import { autoLinker } from "../src/index";

test("autoLinker should link URLs correctly", () => {
  const text = "Check https://example.com";
  const result = autoLinker(text);
  expect(result).toBe(
    `Check <a href="https://example.com">https://example.com</a>`
  );
});

test("auto-linker should open in new tab", () => {
  const text = "Check https://example.com";
  const result = autoLinker(text, { newTab: true });
  expect(result).toBe(
    `Check <a href="https://example.com" target="_blank" rel="noopener noreferrer">https://example.com</a>`
  );
});

test("auto linker should detect emails", () => {
  const text = "contact me at john@example.com";
  const result = autoLinker(text);
  expect(result).toBe(
    `contact me at <a href="mailto:john@example.com">john@example.com</a>`
  );
});