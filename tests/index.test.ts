import { autoLinker } from "../src/index";

test("autoLinker should link URLs correctly", async () => {
  const text = "Check https://example.com";
  const result = await autoLinker(text);
  expect(result).toBe(
    `Check <a href="https://example.com">https://example.com</a>`
  );
});

test("auto-linker should open in new tab", async() => {
  const text = "Check https://example.com";
  const result = await autoLinker(text, { newTab: true });
  expect(result).toBe(
    `Check <a href="https://example.com" target="_blank" rel="noopener noreferrer">https://example.com</a>`
  );
});

test("auto linker should detect emails", async() => {
  const text = "contact me at john@example.com";
  const result = await autoLinker(text);
  expect(result).toBe(
    `contact me at <a href="mailto:john@example.com">john@example.com</a>`
  );
});

test('should link mentions',async()=>{
  const text = "Hello @johndoe, how are you?";
  const result = await autoLinker(text,{newTab:true,mentionOptions:{prefix:'@',urlPrefix:'https://twitter.com/'}})
  expect(result).toBe(`Hello <a href="https://twitter.com/johndoe">@johndoe</a>, how are you?`)
})