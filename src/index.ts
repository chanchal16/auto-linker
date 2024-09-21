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
  const knownTlds = [
    "com",
    "org",
    "net",
    "edu",
    "gov",
    "mil",
    "int",
    "co",
    "io",
    "biz",
    "info",
    "xyz",
    "ai",
    "dev",
    "tv",
    "me",
    "app",
    "shop",
    "tech",
    "health",
    "news",
    "media",
    "cloud",
    "online",
    "pro",
    "in",
    "de",
    "us",
    "uk",
    "ca",
    "fr",
    "es",
    "it",
    "nl",
    "no",
    "se",
    "ch",
    "store",
    "blog",
    "inc",
  ];
  const tldRegex = knownTlds.join("|");

  const urlRegex = new RegExp(
    `\\b((https?:\\/\\/)?([a-zA-Z0-9.-]+\\.(${tldRegex}))(\\/[^\\s]*)?)\\b`,
    "g"
  );
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
  const mentionRegex = /\B@([a-zA-Z0-9._]{1,15})\b/g;

  let processText = text;
  const emailMatches = [...processText.matchAll(emailRegex)];

  // Replace URLs only if they are not part of email matches
  const urls = [...processText.matchAll(urlRegex)]
    .filter((urlMatch) => {
      const url = urlMatch[0];
      return !emailMatches.some((emailMatch) => emailMatch[0].includes(url));
    })
    .map((match) => match[0]);

  const urlsToPreview = urls.slice(-2);

  const promises = urls.map((url) => {
    const target = options.newTab
      ? ` target="_blank" rel="noopener noreferrer"`
      : "";
    const className = options.className ? ` ${options.className}` : "";

    return (async () => {
      const fullUrl = url.startsWith("http") ? url : `http://${url}`;

      if (options.linkPreview && urlsToPreview.includes(url)) {
        const preview = await fetchLinkPreview(
          fullUrl,
          options.newTab || false
        );
        if (preview) {
          return `<a href="${fullUrl}"${target} class="link${className}">${truncateUrl(
            url
          )}</a>${preview}`;
        }
      }
      return `<a href="${fullUrl}"${target} class="link${className}">${truncateUrl(
        url
      )}</a>`;
    })().then((replaceUrl) => {
      processText = processText.replace(url, replaceUrl);
    });
  });

  await Promise.allSettled(promises);

  processText = processText.replace(emailRegex, (email) => {
    const className = options.className ? ` ${options.className}` : "";
    return `<a href="mailto:${email}" class="link${className}">${email}</a>`;
  });

  return processText.replace(mentionRegex, (mention) => {
    const user = mention.slice(1);
    const className = options.className ? ` ${options.className}` : "";
    return `<a href="${options.mentionOptions?.urlPrefix}${user}" class="link${className}">${mention}</a>`;
  });
};