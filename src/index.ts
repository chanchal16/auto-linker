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
  return url.length > 40 ? url.slice(0, 40) + "..." : url;
}

export const autoLinker = async (
  text: string,
  options: AutoLinkerOptions = {}
): Promise<string> => {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
  const mentionRegex = /\B@([a-zA-Z0-9_]{1,15})\b/g;

  const urls = [...text.matchAll(urlRegex)].map((match) => match[0]);
  const urlsToPreview = urls.slice(-2);

  let linkUrl = text;

  const promises = urls.map((url) => {
    const target = options.newTab
      ? ` target="_blank" rel="noopener noreferrer"`
      : "";
    const className = options.className ? ` ${options.className}` : "";

    return (async () => {
      if (options.linkPreview && urlsToPreview.includes(url)) {
        const preview = await fetchLinkPreview(url, options.newTab || false);
        if (preview) {
          return `<a href="${url}"${target} class="link${className}">${truncateUrl(
            url
          )}</a>${preview}`;
        }
      }
      return `<a href="${url}"${target} class="link${className}">${truncateUrl(
        url
      )}</a>`;
    })().then((replaceUrl) => {
      linkUrl = linkUrl.replace(url, replaceUrl);
    });
  });

  await Promise.allSettled(promises);

  linkUrl = linkUrl.replace(emailRegex, (email) => {
    const className = options.className ? ` ${options.className}` : "";
    return `<a href="mailto:${email}" class="link${className}">${email}</a>`;
  });

  return linkUrl.replace(mentionRegex, (mention) => {
    const user = mention.slice(1);
    const className = options.className ? ` ${options.className}` : "";
    return `<a href="${options.mentionOptions?.urlPrefix}${user}" class="link${className}">${mention}</a>`;
  });
};