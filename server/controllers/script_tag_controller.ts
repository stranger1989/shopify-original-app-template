import { DataType } from '@shopify/shopify-api';
import { RestClient } from '@shopify/shopify-api/dist/clients/rest/rest_client';

export const createScriptTag = async (client: RestClient) => {
  if (client) {
    const data = {
      script_tag: {
        event: 'onload',
        src: 'https://google.com',
      },
    };
    const result = await client.post({
      path: 'script_tags',
      data,
      type: DataType.JSON,
    });
    return result;
  }
  console.log('could not make the rest request as the client does not exist');
  return null;
};

export const getAllScriptTags = async (client: RestClient, src: string) => {
  if (!client) {
    console.log('could not make the rest request as the client does not exist');
    return null;
  }
  const result = await client.get({
    path: 'script_tags',
  });
  const matchSrc = (result.body as {
    script_tags: { src: string }[];
  })?.script_tags.filter((tag) => tag.src === src);
  return matchSrc;
};

export const deleteScriptTagById = async (client: RestClient, id: string) => {
  if (!client) {
    console.log('could not make the rest request as the client does not exist');
    return null;
  }
  const result = await client.delete({
    path: `script_tags/${id}`,
  });
  return result;
};

export const getBaseUrl = (shop: string) => {
  return `https://${shop}`;
};

export const getAllScriptTagsUrl = (shop: string) => {
  return `${getBaseUrl(shop)}/admin/api/2021-10/script_tags.json`;
};

export const getScriptTagUrl = (shop: string, id: string) => {
  return `${getBaseUrl(shop)}/admin/api/2021-10/script_tags/${id}.json`;
};

export const getCreateScriptTagUrl = (shop: string) => {
  return `${getBaseUrl(shop)}/admin/api/2021-10/script_tags.json`;
};

export const getDelateScriptTagUrl = (shop: string, id: string) => {
  return `${getBaseUrl(shop)}/admin/api/2021-10/script_tags/${id}.json`;
};
