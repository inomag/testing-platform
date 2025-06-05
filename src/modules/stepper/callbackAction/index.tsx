import { useEffect } from 'react';

interface CallbackActionProps {
  url: string;
}

function CallbackAction({ url }: CallbackActionProps) {
  useEffect(() => {
    if (url) {
      window.location.assign(url);
    }
  }, [url]);

  return null;
}

export default CallbackAction;
