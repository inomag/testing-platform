import { getDocObject, getDocumentName } from './queries';

describe('src/@vymo/ui/molecules/currencyAndDecimal/queries.ts', () => {
  describe('getDocumentName', () => {
    const mockDate = new Date(2024, 6, 3, 15, 30, 0); // July 3, 2024, 15:30:00

    beforeAll(() => {
      jest.useFakeTimers('modern');
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });
    it('should generate document name without extension correctly', () => {
      // Mocking the current date and time
      const result = getDocumentName('', 1);
      const expected = `2024-07-03-03-30-00-1`;
      expect(result).toEqual(expected);
    });

    it('should generate document name with extension correctly', () => {
      // Mocking the current date and time
      const result = getDocumentName('pdf', 2);
      const expected = `2024-07-03-03-30-00-2.pdf`;
      expect(result).toEqual(expected);
    });
  });

  describe('getDocObject', () => {
    const documentsPhoto = [
      { file: new File(['photo1.jpg'], 'photo1.jpg', { type: 'image/jpeg' }) },
      { file: new File(['photo2.png'], 'photo2.png', { type: 'image/png' }) },
    ];
    const documentsPdf = [
      { file: new File(['photo1.jpg'], 'photo1.jpg', { type: 'image/jpeg' }) },
      { file: new File(['photo2.png'], 'photo2.png', { type: 'image/png' }) },
      {
        file: new File(['document1.pdf'], 'document1.pdf', {
          type: 'application/pdf',
        }),
      },
      {
        file: new File(['document2.docx'], 'document2.docx', {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }),
      },
    ];

    it('should rename photo documents correctly', () => {
      const result = getDocObject(documentsPhoto, 'photo');
      result.forEach((doc, i) => {
        const fileExtArr = documentsPhoto[i].file.name.split('.');
        const fileExt = fileExtArr[fileExtArr.length - 1];
        const newFileName = getDocumentName(fileExt, i);

        // Check if file name and properties are correctly updated
        expect(doc.file.name).toEqual(newFileName);
        expect(doc.origName).toEqual(documentsPhoto[i].file.name);
        expect(doc.fileName).toEqual(documentsPhoto[i].file.name);
      });
    });

    it('should rename document documents correctly', () => {
      const result = getDocObject(documentsPdf, 'document');
      result.forEach((doc, i) => {
        const fileExtArr = documentsPdf[i].file.name.split('.');
        const fileExt = fileExtArr[fileExtArr.length - 1];
        const newFileName = getDocumentName(fileExt, i);

        // Check if file name and properties are correctly updated
        expect(doc.file.name).toEqual(newFileName);
        expect(doc.label).toEqual(documentsPdf[i].file.name);
        expect(doc.fileName).toEqual(documentsPdf[i].file.name);
      });
    });
  });
});
