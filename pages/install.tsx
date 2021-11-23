import React, { useState } from "react";
import { Layout, Page, SettingToggle, TextStyle } from "@shopify/polaris";

export default function Install(): JSX.Element {
  const [isInstalled, setIsInstalled] = useState(false);
  const titleDescription = isInstalled ? "Uninstalled" : "Installed";
  const bodyDescription = isInstalled ? "Installed" : "Uninstalled";

  const handleAction = () => {
    setIsInstalled((oldValue) => !oldValue);
  };

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
          The App script is{" "}
          <TextStyle variation="strong">{bodyDescription}</TextStyle>
        </SettingToggle>
      </Layout.AnnotatedSection>
    </Page>
  );
}
