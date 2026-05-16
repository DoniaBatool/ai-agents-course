import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BrowserOnly>
        {() => {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const ChatWidget = require("@/components/ChatWidget").default;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const TextSelectionPopup = require("@/components/TextSelectionPopup").default;
          return (
            <>
              <ChatWidget />
              <TextSelectionPopup />
            </>
          );
        }}
      </BrowserOnly>
    </>
  );
}
