import fs from 'fs';
import path from 'path';

import Axios, { AxiosInstance } from 'axios';

const themeApi = 'admin/api/2021-10';

interface Theme {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  role: string;
  theme_store_id: number;
  previewable: boolean;
  processing: boolean;
  admin_graphql_api_id: string;
}

export const updateTheme = async (shop: string, accessToken: string) => {
  const axios = Axios.create({
    baseURL: `https://${shop}/${themeApi}`,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
  });
  const mainThemeId = await getThemeId(axios);
  if (!mainThemeId) {
    return;
  }
  const newPage = await getAssetThemeLiquid(axios, mainThemeId);
  if (newPage) {
    await uploadAssetTheme(axios, mainThemeId, newPage, 'layout/theme.liquid');
  }
  const newSnippet = await getFile('../../liquid/app.liquid');
  await uploadAssetTheme(
    axios,
    mainThemeId,
    newSnippet.toString(),
    'snippets/app.liquid',
  );
};

const getThemeId = async (axios: AxiosInstance) => {
  const { data } = await axios.get('themes.json');
  const mainTheme = data.themes.find((theme: Theme) => theme.role === 'main');
  if (!mainTheme) {
    console.log('No main theme found');
  }
  return mainTheme.id;
};

const getAssetThemeLiquid = async (axios: AxiosInstance, id: string) => {
  const { data } = await axios.get(
    `/themes/${id}/assets.json?asset[key]=layout/theme.liquid`,
  );
  if (!data.asset.value) {
    return {};
  }
  const snippet = getFile('../../liquid/theme.liquid');
  let newPage = data.asset.value;
  if (newPage.includes(snippet)) {
    console.log('Page already has the snippet installed');
    return {};
  }
  newPage = data.asset.value.replace(
    "{% section 'header' %}",
    `\n{% section 'header' %}\n${snippet}`,
  );
  console.log('New Page', newPage);
  return newPage;
};

const uploadAssetTheme = async (
  axios: AxiosInstance,
  id: string,
  page: string,
  pageName: string,
) => {
  const body = {
    asset: {
      key: pageName,
      value: page,
    },
  };
  const result = await axios.put(`/themes/${id}/assets.json`, body);
  console.log(`Upload page ${pageName}`, result);
};

const getFile = (fileName: string) =>
  fs.readFileSync(path.resolve(__dirname, fileName));
