import React, { useCallback, useEffect, useState } from 'react';
import Button from 'src/@vymo/ui/atoms/button';
import Loader from 'src/@vymo/ui/atoms/loader';
import Text from 'src/@vymo/ui/atoms/text';
import Modal, { Body, Header } from 'src/@vymo/ui/blocks/modal';
// eslint-disable-next-line vymo-ui/restrict-import
import { getInitResponse } from 'src/modules/recruitment/selectors';
// eslint-disable-next-line vymo-ui/restrict-import
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import styles from './index.module.scss';

function DocuSign({
  label = 'Sign here',
  code = '',
  readOnly = false,
  scriptLink,
  getESignMeta,
  onComplete,
  finishText,
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [eSignURL, setESignUrl] = useState();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [docuSignEventType, setDocuSignEventType] = useState<string>('');
  const [envelopeId, setEnvelopeId] = useState<string>('');
  const dispatch = useAppDispatch();
  const initApiResponse = useAppSelector(getInitResponse);
  const [clientId, setClientId] = useState('');
  const handleOnClick = useCallback(async () => {
    // initiate the signing ceremony
    setIsLoading(true);
    setIsModalOpen(true);
    const response = await getESignMeta();
    setIsLoading(false);
    if (response) {
      setEnvelopeId(response.envelopeId);
      setESignUrl(response.url);
      setClientId(response.dsClientId);
    }
  }, [getESignMeta]);
  useEffect(() => {
    if (docuSignEventType) {
      onComplete(envelopeId);
      setDocuSignEventType('');
    }
  }, [
    code,
    dispatch,
    docuSignEventType,
    envelopeId,
    initApiResponse.result.page.component.meta.current_step,
    initApiResponse.result.page.component.meta.sections,
    onComplete,
  ]);
  useEffect(() => {
    if (eSignURL && isModalOpen) {
      window.DocuSign.loadDocuSign(clientId)
        .then((docusign) => {
          const signing = docusign.signing({
            url: eSignURL,
            displayFormat: 'focused',
            style: {
              branding: {
                primaryButton: {
                  backgroundColor: '#333',
                  color:
                    document.documentElement.style.getPropertyPriority(
                      '--brand-seondary',
                    ),
                },
              },
              signingNavigationButton: {
                finishText,
                position: 'bottom-center',
              },
            },
          });
          signing.mount('#docusign');
          signing.on('ready', () => {
            setIsLoading(false);
          });
          /**
              'signing_complete'
              'cancel'
              'decline'
              'exception'
              'fax_pending'
              'session_timeout'
              'ttl_expired'
              'Viewing_complete'
             */
          signing.on('sessionEnd', (event) => {
            setDocuSignEventType(event?.sessionEndType);
            setIsModalOpen(false);
          });
        })
        .catch((ex) => {
          // eslint-disable-next-line no-console
          console.error(ex);
        });
    }
  }, [clientId, eSignURL, finishText, isModalOpen]);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = scriptLink;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [scriptLink]);
  return (
    <>
      {isLoading ? (
        <Loader fullPage />
      ) : (
        <Button
          onClick={handleOnClick}
          disabled={readOnly}
          data-test-id="docu-sign-btn"
        >
          {label}
        </Button>
      )}
      <Modal
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
        closeOnEscape
        showCloseButton
        classNames={styles['docu-sign-modal']}
        data-test-id="docu-sign-modal"
      >
        <Header>
          <Text>eSignature</Text>
        </Header>
        <Body>
          <div className={styles['docusign-agreement-container']} id="docusign">
            {' '}
          </div>
        </Body>
      </Modal>
    </>
  );
}
export default DocuSign;
