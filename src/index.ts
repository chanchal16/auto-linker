export interface AutoLinkerOptions {
  newTab?: boolean;
  className?: string;
}

export const autoLinker = (
  text: string,
  options: AutoLinkerOptions = {}
): string => {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;

  const linkUrl = text.replace(urlRegex, (url) => {
    const target = options.newTab
      ? ` target="_blank" rel="noopener noreferrer"`
      : "";
    const className = options.className ? ` class="${options.className}"` : "";
    return `<a href="${url}"${target}${className}>${url}</a>`;
  });

  const linkEmail = linkUrl.replace(emailRegex, (email) => {
    const className = options.className ? ` class="${options.className}"` : "";
    return `<a href="mailto:${email}"${className}>${email}</a>`;
  });

  return linkEmail;
};