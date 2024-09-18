// Metadata cache to store previews and avoid repeated requests
export const metadataCache: Record<string, string> = {};

export const fetchLinkPreview = async (url: string): Promise<string> => {
  if (metadataCache[url]) {
    return metadataCache[url];
  }

  try {
    const response = await fetch(
      `https://jsonlink.io/api/extract?url=${url}&api_key=${process.env.API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    // If the data doesn't contain necessary fields, skip preview
    if (!data.title || !data.description) {
      throw new Error("Incomplete preview data");
    }
    // Generate HTML for preview
    const previewHTML = `<div class="link-preview">
      <img src="${data.images[0]}" alt="${data.title}" />
      <div class='link-content'>
      <a id="content-wrapper" href="${data.url}">
      <h4 class="title-ellipsis">${data.title}</h4>
      <p class="description-ellipsis">${data.description}</p>
      <small>${data.domain}</small>
      </a>
      </div>
    </div>`;

    metadataCache[url] = previewHTML;
    return previewHTML;
  } catch (error: any) {
    console.error(error.message);
    return "";
  }
};
