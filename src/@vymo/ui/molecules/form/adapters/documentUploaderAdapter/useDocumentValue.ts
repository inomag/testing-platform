import { isEmpty } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import axios from 'src/workspace/axios';
import { isJsonString } from 'src/workspace/utils';
import { convertFileUrlToBlob } from './queries';

type UseDocumentValueProps = {
  value: any;
  code: string;
};

function useDocumentValue({ value = '', code }: UseDocumentValueProps) {
  const [parsedDocuments, setParsedDocuments] = useState([]);
  const [filesLength, setFilesLength] = useState(0);
  const isValueJsonString = isJsonString(value);
  const itemsPreSigned = isValueJsonString || isEmpty(value) ? [] : value;
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current || isValueJsonString) {
      // This should be run for only first time to transform the files from backend
      if (isValueJsonString) {
        const { bucket, items = [] } = JSON.parse(value) || {};
        setFilesLength(items.length);
        const promises = [] as any;
        items?.forEach((item) => {
          if (item.presigned_url) {
            promises.push(
              Promise.resolve({
                data: {
                  ...item,
                  presignedUrl: item.presigned_url,
                },
              }),
            );
          } else {
            promises.push(
              axios.get(
                `/signed-url?bucket=${bucket}&path=${item.path}&redirection=false`,
              ),
            );
          }
        });
        Promise.all(promises).then((res) => {
          res.forEach((response) => {
            itemsPreSigned.push({
              ...response.data,
              uri: response.data.presignedUrl,
            });
          });
          convertFileUrlToBlob(itemsPreSigned, code)
            .then((preSignedresponse: any) =>
              setParsedDocuments(preSignedresponse.filter(Boolean)),
            )
            .finally(() => {
              isFirstMount.current = false;
            });
        });
      } else {
        setFilesLength(itemsPreSigned.length);
        convertFileUrlToBlob(itemsPreSigned, code)
          .then((res: any) => setParsedDocuments(res.filter(Boolean)))
          .finally(() => {
            isFirstMount.current = false;
          });
      }
    } else {
      setParsedDocuments(value);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, value]);

  return { value: parsedDocuments, filesLength };
}

export default useDocumentValue;
