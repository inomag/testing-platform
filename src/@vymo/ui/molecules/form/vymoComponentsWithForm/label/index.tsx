import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import Text from 'src/@vymo/ui/atoms/text';
import { ReactComponent as LinkIcon } from 'src/assets/icons/link.svg';
import { decodeMarkup } from './queries';
import styles from './index.module.scss';

function Label({
  html,
  dataTestId,
  value,
  onChange,
  hint,
}: {
  html: string;
  dataTestId: string;
  value?: string;
  onChange?: (arg1, arg2, arg3) => undefined;
  hint?: string;
}) {
  const handleOnClick = useCallback(
    (event) => {
      if (event.target?.tagName === 'A') {
        onChange?.(value ?? html, event, {
          meta: {
            hint,
            clicked: true,
          },
        });
      }
    },
    [hint, html, onChange, value],
  );
  const renderValue = useMemo(() => {
    if (!html && !value) return '';
    let labelValue = value || html;
    const markupArray = decodeMarkup(labelValue);
    if (markupArray) {
      const [href] = markupArray;
      if (href && !href.match(/target\s*=\s*"_blank"/)) {
        labelValue = _.replace(href, '<a href', '<a target="_blank" href');
      }
    }
    return (
      <div
        className={styles.label__link}
        onClick={handleOnClick}
        onKeyDown={_.noop}
        role="button"
        tabIndex={0}
      >
        <span
          style={{ width: '100%' }}
          /* eslint-disable-next-line react/no-danger */
          dangerouslySetInnerHTML={{ __html: labelValue }}
        />
        {markupArray ? <LinkIcon /> : null}
      </div>
    );
  }, [handleOnClick, html, value]);

  return (
    <div>
      <Text data-test-id={dataTestId} bold>
        {renderValue}
      </Text>
    </div>
  );
}

export default Label;
