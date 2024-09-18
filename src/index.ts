import { fetchLinkPreview } from "./linkPreview";

export interface AutoLinkerOptions {
  newTab?: boolean;
  className?: string;
  mentionOptions?: {
    prefix: string;
    urlPrefix: string;
  };
  linkPreview?: boolean;
}

function truncateUrl(url: string) {
  const urlLength = url.length;
  const truncatedLength = Math.ceil(urlLength * 0.7);

  if (truncatedLength < 40) {
    // Ensure a minimum truncated length of 40 characters
    return url.substring(0, 40);
  } else {
    return url.substring(0, truncatedLength) + "...";
  }
}

export const autoLinker = async (
  text: string,
  options: AutoLinkerOptions = {}
): Promise<string> => {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
  const mentionRegex = /\B@([a-zA-Z0-9_]{1,15})\b/g;

  const urls = [...text.matchAll(urlRegex)].map((match) => match[0]); // Extract URLs from text
  const urlsToPreview = urls.slice(-2); // Get last two URLs

  let linkUrl = text;
  const promises = [];

  for (const url of urls) {
    const target = options.newTab
      ? ` target="_blank" rel="noopener noreferrer"`
      : "";
    const className = options.className ? ` class="${options.className}"` : "";

    const urlReplacement = async () => {
      // Check if we should generate a preview for this URL
      if (options.linkPreview && urlsToPreview.includes(url)) {
        const preview = await fetchLinkPreview(url);
        if (preview) {
          return `<a href="${url}"${target}${className}>${truncateUrl(
            url
          )}</a>${preview}`;
        }
      }
      return `<a href="${url}"${target}${className}>${truncateUrl(url)}</a>`;
    };
    promises.push(
      urlReplacement().then((replaceUrl) => {
        linkUrl = linkUrl.replace(url, replaceUrl);
      })
    );
  }
  await Promise.all(promises);

  const linkEmail = linkUrl.replace(emailRegex, (email) => {
    const className = options.className ? ` class="${options.className}"` : "";
    return `<a href="mailto:${email}"${className}>${email}</a>`;
  });

  const linkMentions = linkEmail.replace(mentionRegex, (mention) => {
    const user = mention.slice(1);
    const className = options.className ? ` class="${options.className}"` : "";
    return `<a href="${options.mentionOptions?.urlPrefix}${user}"${className}>${mention}</a>`;
  });

  return linkMentions;
};
