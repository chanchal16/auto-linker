"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoLinker = void 0;
const autoLinker = (text, options = {}) => {
    const urlRegex = /https?:\/\/[^\s]+/g;
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
    const linkUrl = text.replace(urlRegex, (url) => {
        const target = options.newTab ? `target_blank rel="noopener noreferrer"` : '';
        const className = options.className ? ` class="${options.className}"` : '';
        return `<a href="${url}"${target}${className}>${url}</a>`;
    });
    const linkEmail = linkUrl.replace(emailRegex, (email) => {
        const className = options.className ? ` class="${options.className}"` : '';
        return `<a href="mailto:${email}"${className}>${email}</a>`;
    });
    return linkEmail;
};
exports.autoLinker = autoLinker;
const text = 'Check out https://example.com or contact me at john@example.com.';
const linkedText = (0, exports.autoLinker)(text, { newTab: true, className: 'my-link-class' });
console.log(linkedText);
