import React from 'react';
import { useRouter } from 'next/router';
import { ClientRouter as AppBridgeClientRouter } from '@shopify/app-bridge-react';

function ClientRouter() {
  const router = useRouter();
  return <AppBridgeClientRouter history={router} />;
}

export default ClientRouter;
