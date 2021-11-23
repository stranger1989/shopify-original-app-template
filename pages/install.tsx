import React, { useCallback, useEffect, useState } from 'react';
import { Layout, Page, SettingToggle, TextStyle } from '@shopify/polaris';

import { useAxios } from '../hooks/useAxios';

export default function Install(): JSX.Element {
  const [axios] = useAxios();
  const [isInstalled, setIsInstalled] = useState(false);
  const [scriptTagId, setScriptTagId] = useState<string>();
  const titleDescription = isInstalled ? 'Uninstalled' : 'Installed';
  const bodyDescription = isInstalled ? 'Installed' : 'Uninstalled';

  const fetchScriptTags = useCallback(async () => {
    const { data } = await axios.get('/script_tag/all');
    console.log('my initial script tag status is ', data);
    setIsInstalled(data.installed);
    if (data.details?.length > 0) {
      setScriptTagId(data.details[0].id);
    }
  }, [axios]);

  const handleAction = async () => {
    if (isInstalled) {
      axios.delete(`/script_tag/?id=${scriptTagId}`);
    } else {
      axios.post(`/script_tag`);
    }
    setIsInstalled((oldValue) => !oldValue);
  };

  useEffect(() => {
    fetchScriptTags();
  }, [fetchScriptTags]);

  return (
    <Page>
      <Layout.AnnotatedSection
        title={`${titleDescription} app`}
        description="Toggle app installation on your shop"
      >
        <SettingToggle
          action={{
            content: titleDescription,
            onAction: handleAction,
          }}
          enabled
        >
          The App script is{' '}
          <TextStyle variation="strong">{bodyDescription}</TextStyle>
        </SettingToggle>
      </Layout.AnnotatedSection>
    </Page>
  );
}
