import { getAppLocationInfo } from 'src/workspace/utils';

export function updateInlineScripts(inlineScript, actionCategory) {
  const { hash } = getAppLocationInfo();
  const modifiedScript = document.createElement('script');
  modifiedScript.type = 'text/javascript';

  let updatedText = inlineScript.innerHTML;

  const hasReturnUrl = /"returnUrl"\s*:\s*".*?callbackHash=""/.test(
    updatedText,
  );

  if (hasReturnUrl && actionCategory === 'PaymentActionCategory') {
    updatedText = updatedText.replace(
      /callbackHash=""/,
      `callbackHash=${hash}`,
    );
  }

  modifiedScript.text = updatedText;
  return modifiedScript;
}
