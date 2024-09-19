<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://github.com/chanchal16/auto-linker">
    <img src="https://res.cloudinary.com/cr07/image/upload/v1726732074/linked-rings_ppywau.svg" alt="Logo" width="90" height="90">
  </a>
  <h3 align="center">auto-linker</h3>

  <p align="center">
    A utility package that automatically converts URLs, email addresses, and mentions within text into clickable hyperlinks.
    <br />
    <a href="" target="_blank">View Demo</a>
  </p>
</p>


## Key Features
**URL Detection**:
Automatically detect and convert plain-text URLs into clickable links.

**Email Address Detection**:
Identify email addresses and convert them into mailto: links.

**Social Media Handles**:
Optionally detect and link social media handles (like Twitter handles: @username)

**Link Preview:**
Option to generate link preview data for detected URLs.

**Truncation**: 
Ability to truncate long URLs in display text while keeping the full URL in the href.


## Usage
**auto-linker** is compatible with all JavaScript frameworks like React, Vue, Angular, etc.

### Basic example
```javascript
import { autoLinker } from 'auto-linker';

const text = 'Check out https://example.com or contact me at john@example.com. You can also find me on twitter @john';
const linkedText = autoLinker(text, { newTab: true, mentionOptions: { prefix: "@", urlPrefix: "https://twitter.com/"} });
console.log(linkedText);

```

### React
React allows you to directly insert HTML using **dangerouslySetInnerHTM**L. You can use the auto-linker like this:

```javascript
import React from 'react';
import { autoLinker } from 'auto-linker';

function App() {
  const text = "Visit https://example.com or contact john@example.com";
  const linkedText = autoLinker(text);

  return (
    <div>
      <p dangerouslySetInnerHTML={{ __html: linkedText }} />
    </div>
  );
}

export default App;
```

## Props
| Name           | Type    | Description                                                                                                                                     |
|----------------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| newTab         | boolean | Will open the link in the new tab                                                                                                               |
| className      | string  | add custom css classes to the links                                                                                                             |
| mentionOptions | Object  | An object to specify social handles. Consists of properties - `prefix:string` prefix for the mention. (eg:@) `urlPrefix:string` social handle url |
| linkPreview    | boolean | Determines whether to generate link preview or not                                                                                              |
