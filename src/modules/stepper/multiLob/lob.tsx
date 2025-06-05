import React, { useCallback, useState } from 'react';
import { Button, Text } from 'src/@vymo/ui/atoms';
import { Card } from 'src/@vymo/ui/blocks';
import DocumentUploaderAdapter from 'src/@vymo/ui/molecules/form/adapters/documentUploaderAdapter';
import { ReactComponent as Circle } from 'src/assets/icons/circle.svg';
import { ReactComponent as CircleWithTick } from 'src/assets/icons/circleTick.svg';
import { locale } from 'src/i18n';
import Keys from 'src/i18n/keys';
import { LobProps } from './types';
import styles from './index.module.scss';

function Lob({
  lob_code,
  bullet_list = [],
  multimedia = [],
  title,
  setSelectedLob,
  selectedLob = [],
}: LobProps) {
  const [showMore, setShowMore] = useState(false);

  const [isLobSelected, setIsLobSelected] = useState(
    selectedLob.includes(lob_code),
  );

  const onToggleShowMore = useCallback(() => {
    setShowMore(!showMore);
  }, [showMore]);

  const onChangeSelected = useCallback(() => {
    if (isLobSelected) {
      setSelectedLob(selectedLob.filter((lob) => lob !== lob_code));
      setIsLobSelected(false);
    } else {
      setSelectedLob([...selectedLob, lob_code]);
      setIsLobSelected(true);
    }
  }, [isLobSelected, lob_code, selectedLob, setSelectedLob]);

  return (
    <Card classNames={styles.lob}>
      <div className={styles.lob__header}>
        <Text semiBold>{title}</Text>
        <Button
          data-test-id={`lobSelect-${lob_code}`}
          className={styles.lob__header__button}
          type="text"
          iconProps={{
            icon: isLobSelected ? <CircleWithTick /> : <Circle />,
            iconPosition: 'right',
          }}
          onClick={onChangeSelected}
        />
      </div>

      <>
        <div className={styles.lob__bulletList}>
          {bullet_list.map((bullet) => (
            <Text type="sublabel">
              <li> {bullet} </li>
            </Text>
          ))}
        </div>
        {multimedia.length > 0 && !showMore && (
          <Button type="text" onClick={onToggleShowMore} size="small">
            {locale(Keys.SHOW_MORE)}
          </Button>
        )}

        {multimedia.length > 0 && showMore && (
          <div className={styles.lob__showMoreContent}>
            <Text type="sublabel">{locale(Keys.BROCHURES_VIDEOS)}</Text>
            <div className={styles.lob__multimedia}>
              <DocumentUploaderAdapter
                code=""
                onChange={() => {}}
                disabled
                value={multimedia.map(({ resourceUrl, thumbnail }) => ({
                  uri: resourceUrl,
                  thumbnail,
                }))}
              />
            </div>

            <Button type="text" onClick={onToggleShowMore} size="small">
              {locale(Keys.SHOW_LESS)}
            </Button>
          </div>
        )}
      </>
    </Card>
  );
}

export default Lob;
