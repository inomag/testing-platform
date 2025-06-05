import React from 'react';
import Divider from 'src/@vymo/ui/atoms/divider';
import Text from 'src/@vymo/ui/atoms/text';
import Collapsible from 'src/@vymo/ui/blocks/collapsible';
import { getPortalBranding } from 'src/models/portalConfig/selectors';
import { useAppSelector } from 'src/store/hooks';
import styles from './index.module.scss';

function Sidebar() {
  const portalBranding = useAppSelector(getPortalBranding);
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebar__image}>
        {/* @ts-ignore */}
        <img src={portalBranding?.banner.url} alt="banner" />
      </div>
      <div className={styles.faq}>
        <Text type="h3">FAQs</Text>
        <div className={styles['faq-item']}>
          <Text bold>What is a PAN Validation</Text>
          <Text>
            PAN validation is a necessary step and it helps us verify your
            identity.
          </Text>
        </div>
        <Divider />
        <Collapsible title="How to change an interview date?" open={false}>
          Lorem Ipsum
        </Collapsible>
        <Divider />
        <Text bold>How do I connect with my interview?</Text>
      </div>
    </aside>
  );
}

export default Sidebar;
