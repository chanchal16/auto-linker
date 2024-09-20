<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://github.com/chanchal16/auto-linker">
    <img src="https://res.cloudinary.com/cr07/image/upload/v1726732074/linked-rings_ppywau.svg" alt="Logo" width="90" height="90">
  </a>
  <h3 align="center">auto-linker-previewer</h3>

  <p align="center">
    A utility package that automatically converts URLs, email addresses, and mentions within text into clickable hyperlinks.
    <br />
    <a href="https://4l62tc.csb.app/" target="_blank">View Demo</a>
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


## Installation
```
npm i auto-linker-previewer
```


## Usage
**auto-linker-previewer** is compatible with all JavaScript frameworks like React, Vue, Angular, etc.
> **Note**: To use the auto-linker package, make sure to include the CSS file in your project:
```js
import 'auto-linker-previewer/dist/autolinker.css';
```

### Basic example
```javascript
import { autoLinker } from 'auto-linker-previewer';
import 'auto-linker-previewer/dist/autolinker.css';

const text = 'Visit https://www.chanchal.dev/ or email chanchalr060@gmail.com. You may also find me on Twitter: @chanchal16_';
const processText = async () => {
    const result= await autoLinker(text, {newTab:true, mentionOptions: { prefix: "@", urlPrefix: "https://twitter.com/" }});
    console.log('result',result)
};
processText();

```

### React
React allows you to directly insert HTML using **dangerouslySetInnerHTM**L. You can use the auto-linker-previewer like this:

```javascript
import React, { useState, useEffect } from "react";
import { autoLinker } from "auto-linker-previewer";
import 'auto-linker-previewer/dist/autolinker.css';

const ReactExample = () => {
  const [text, setText] = useState(
    "Visit https://www.chanchal.dev/ or email chanchalr060@gmail.com. You may also find me on Twitter: @chanchal16_"
  );
  const [processedText, setProcessedText] = useState<string>("");

  useEffect(() => {
    const options: AutoLinkerOptions = {
      newTab: true,
      className: "custom-link",
      mentionOptions: { prefix: "@", urlPrefix: "https://twitter.com/" },
      linkPreview: true,
    };
    const processText = async () => {
      const result = await autoLinker(text, options);
      setProcessedText(result);
    };
    processText();
  }, [text]);

  return (
    <div>
      <h1>React AutoLinker Example</h1>
      {/* Display processed text as HTML */}
      <div dangerouslySetInnerHTML={{ __html: processedText }} />
    </div>
  );
};

export default ReactExample;

```

### Angular
```javascript
import { Component, OnInit } from '@angular/core';
import { autoLinker, AutoLinkerOptions } from 'auto-linker-previewer';
import 'auto-linker-previewer/dist/autolinker.css';

@Component({
  selector: 'app-auto-linker',
  template: `
    <div>
      <h1>Angular AutoLinker Example</h1>
      <!-- Display the processed HTML in Angular -->
      <div [innerHTML]="processedText"></div>
    </div>
  `,
  styles: [`
    .custom-link {
      color: blue;
      text-decoration: underline;
    }
  `]
})
export class AutoLinkerComponent implements OnInit {
  text = 'Visit https://www.chanchal.dev/ or email chanchalr060@gmail.com. You may also find me on Twitter: @chanchal16_';
  processedText = '';
  async ngOnInit() {
    const options: AutoLinkerOptions = {
      newTab: true,
      className: 'custom-link',
      mentionOptions: { prefix: '@', urlPrefix: 'https://twitter.com/' },
      linkPreview: true,
    };
    this.processedText = await autoLinker(this.text, options);
  }
}

```

## Props
| Name           | Type    | Description                                                                                                                                     |
|----------------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| newTab         | boolean | Will open the link in the new tab                                                                                                               |
| className      | string  | add custom css classes to the links                                                                                                             |
| mentionOptions | Object  | An object to specify social handles. Consists of properties - `prefix:string` prefix for the mention. (eg:@) `urlPrefix:string` social handle url |
| linkPreview    | boolean | Determines whether to generate link preview or not                                                                                              |
