import React, { useEffect, useMemo, useState } from 'react';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

export default function PreviewLink({ link, isPdf, fileName }) {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const renderLink = useMemo(() => {
    if (isPdf) {
      return (
        <DocViewer
          documents={[{ uri: link, fileName }]}
          pluginRenderers={DocViewerRenderers}
        />
      );
    }
    return (
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `<iframe 
              transform: scale(0.5, 0.5);  
              width="100%"
              height="${windowHeight - 200}px" 
              frameborder="no" 
              src=${link}
            </iframe>`,
        }}
      />
    );
  }, [fileName, isPdf, link, windowHeight]);
  return <div>{renderLink}</div>;
}
