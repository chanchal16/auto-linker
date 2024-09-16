export interface AutoLinkerOptions {
  newTab?: boolean;
  className?: string;
  mentionOptions?: {
    prefix: string,
    urlPrefix: string,
  },
  linkPreview?: boolean,
}

// Metadata cache to store previews and avoid repeated requests
const metadataCache: Record<string, string> = {};

const fetchLinkPreview = async (url: string): Promise<string> => {
  if(metadataCache[url]){
    return metadataCache[url]
  }

  try {
    const response = await fetch(`https://jsonlink.io/api/extract?url=${url}&api_key=${process.env.API_KEY}`)
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    // Generate HTML for preview
    const previewHTML = `<div class="link-preview">
      <img src="${data.image}" alt="${data.title}" />
      <p>${data.title}</p>
      <p>${data.description}</p>
    </div>`;

    metadataCache[url] = previewHTML;
    return previewHTML;
    
  } catch (error:any) {
    console.error(error.message);
    return error
  }  
}

export const autoLinker = async(
  text: string,
  options: AutoLinkerOptions = {}
): Promise<string> => {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
  const mentionRegex = /\B@([a-zA-Z0-9_]{1,15})\b/g

  const urls = [...text.matchAll(urlRegex)].map(match => match[0]); // Extract URLs from text
  const urlsToPreview = urls.slice(-2); // Get last two URLs

  let linkUrl = text;
  const promises = [];

  for(const url of urls){
    const target = options.newTab
      ? ` target="_blank" rel="noopener noreferrer"`
      : "";
    const className = options.className ? ` class="${options.className}"` : "";

    const urlReplacement = async()=>{
      // Check if we should generate a preview for this URL
      if (options.linkPreview && urlsToPreview.includes(url)) {
        const preview = await fetchLinkPreview(url);
        return `<a href="${url}"${target}${className}>${url}</a>${preview}`;
      }
      return `<a href="${url}"${target}${className}>${url}</a>`;
    }
    promises.push(urlReplacement().then(replaceUrl=>{
      linkUrl = linkUrl.replace(url,replaceUrl)
    }))
  }
  await Promise.all(promises)

  const linkEmail = linkUrl.replace(emailRegex, (email) => {
    const className = options.className ? ` class="${options.className}"` : "";
    return `<a href="mailto:${email}"${className}>${email}</a>`;
  });

  const linkMentions = linkEmail.replace(mentionRegex,(mention)=>{
    const user = mention.slice(1)
    const className = options.className ? ` class="${options.className}"` : "";
    return `<a href="${options.mentionOptions?.urlPrefix}${user}"${className}>${mention}</a>`
  })
console.log('men',linkMentions)
  return linkMentions;
};