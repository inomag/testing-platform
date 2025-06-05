import React, { useCallback } from 'react';
import { Text } from 'src/@vymo/ui/atoms';
import { ImageLoader } from 'src/@vymo/ui/blocks';
import { useAppDispatch } from 'src/store/hooks';
import { renderModule } from 'src/workspace/slice';
import styles from './index.module.scss';

function Tile({ name, tile: { icon = '', description = '' } = {} }) {
  const dispatch = useAppDispatch();

  const onClickTile = useCallback(() => {
    dispatch(
      renderModule({
        id: 'UI_SELFSERVE_RUNNER',
        props: { appProjectName: name },
      }),
    );
  }, [name, dispatch]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={styles.container__content__tile} onClick={onClickTile}>
      <ImageLoader
        className={styles.container__content__tile__left}
        src={icon}
        alt={name}
        width={40}
        height={40}
      />
      <div className={styles.container__content__tile__right}>
        <Text>{name}</Text>
        <Text type="sublabel">{description}</Text>
      </div>
    </div>
  );
}

export default Tile;
