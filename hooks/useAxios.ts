import axios from 'axios';
import { useAppBridge } from '@shopify/app-bridge-react';
import { getSessionToken } from '@shopify/app-bridge-utils';

export const useAxios = () => {
  const app = useAppBridge();
  const instance = axios.create();
  instance.interceptors.request.use((config) => {
    return getSessionToken(app).then((token) => {
      config.headers!.Authorization = `Bearer ${token}`;
      return config;
    });
  });
  return [instance];
};
