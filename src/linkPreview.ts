import config from "./api.config";

// Metadata cache to store previews and avoid repeated requests
export const metadataCache: Record<string, string> = {};

export const fetchLinkPreview = async (
  url: string,
  newTab: boolean
): Promise<string> => {
  if (metadataCache[url]) {
    return metadataCache[url];
  }

  const target = newTab ? ` target="_blank" rel="noopener noreferrer"` : "";

  try {
    const response = await fetch(
      `https://jsonlink.io/api/extract?url=${url}&api_key=${config.apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.title || !data.description) {
      throw new Error("Incomplete preview data");
    }

    const previewHTML = `<div class="link-preview">
      <img src="${data.images?.[0] || ""}" alt="${data.title}" />
      <div class='link-content'>
        <a id="content-wrapper" href="${data.url}"${target}>
          <h4 class="title-ellipsis">${data.title}</h4>
          <p class="description-ellipsis">${data.description}</p>
          <small>${data.domain}</small>
        </a>
      </div>
    </div>`;

    metadataCache[url] = previewHTML; // Store valid preview data
    return previewHTML;
  } catch (error: any) {
    console.error(error.message);
    return "";
  }
};