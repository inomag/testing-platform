import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { SwitchProps } from './types';
import styles from './index.module.scss';

function Switch({
  value = false,
  disabled = false,
  size = 'medium',
  onChange = () => {},
  'data-test-id': dataTestId,
  classNames = '',
}: React.PropsWithChildren<SwitchProps>) {
  const switchInnerRef = useRef<HTMLSpanElement>(null);
  const [moveSpanRight, setMoveSpanRight] = useState<string>();
  const [checked, setChecked] = useState<boolean>(value);

  useEffect(() => {
    setChecked(value);
  }, [value]);

  useEffect(() => {
    if (switchInnerRef.current) {
      const selfHeight = switchInnerRef.current.offsetHeight;
      if (checked) {
        setMoveSpanRight(`calc(100% - ${selfHeight}px - 2px)`);
      } else {
        setMoveSpanRight('2px');
      }
    }
  }, [checked]);

  return (
    <div
      className={classnames(
        styles.switch,
        styles[`switch__${size}`],
        {
          [styles.switch__on]: checked,
          [styles.switch__disabled]: disabled,
        },
        classNames,
      )}
      data-test-id={dataTestId}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.checked, e);
          setChecked(e.target.checked);
        }}
        disabled={disabled}
        className={classnames({
          [styles.checkbox__disabled]: disabled,
        })}
        data-test-id={`${dataTestId}-input`}
      />
      <span
        ref={switchInnerRef}
        className={classnames(styles.switch__inner)}
        style={{
          height: 'calc(100% - 4px)',
          aspectRatio: '1/1',
          left: moveSpanRight,
        }}
      />
    </div>
  );
}

export default Switch;
