import React from 'react';
import Text from 'src/@vymo/ui/atoms/text';

interface IProps {
  readOnlyText: string[];
}
function ReadOnlyConsent({ readOnlyText }: IProps) {
  return (
    <>
      {readOnlyText.map((text) => (
        <>
          <Text key={text}>{text}</Text>
          <br />
        </>
      ))}
    </>
  );
}

export default ReadOnlyConsent;
