import React from 'react';
import classnames from 'classnames';
import styles from './index.module.scss';

type AvatarProps = {
  imageUrl?: string;
  text?: string;
  shape?: 'circle' | 'square' | 'rounded';
  size?: 'small' | 'medium' | 'large';
  background?: string;
  'data-test-id'?: string;
};

function Avatar({
  imageUrl,
  text,
  shape = 'circle',
  size = 'medium',
  background = 'rgb(214 124 124)',
  'data-test-id': dataTestId = 'avatar',
}: AvatarProps) {
  const avatarClassnames = classnames(
    styles.avatar,
    styles[`avatar__${shape}`],
    styles[`avatar__${size}`],
  );

  const textClassnames = classnames(
    styles.avatar__text,
    styles[`avatar__text__${size}`],
  );
  return (
    <div style={{ backgroundColor: background }} className={avatarClassnames}>
      {imageUrl && (
        <img
          src={imageUrl}
          data-test-id={`${dataTestId}-image`}
          alt={text}
          className={styles.avatar__image}
        />
      )}
      {text && !imageUrl && (
        <span data-test-id={`${dataTestId}-text`} className={textClassnames}>
          {text}
        </span>
      )}
    </div>
  );
}

export default Avatar;
