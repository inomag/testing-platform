import { Document } from '../types';
import {
  addDocument,
  canvasToFile,
  getRenderedImageClientRect,
  parseAspectRatio,
} from './queries';

// Mock canvas toBlob
global.HTMLCanvasElement.prototype.toBlob = function toBlob(
  callback: (blob: Blob | null) => void,
  type: string,
) {
  callback(new Blob([], { type }));
};

describe('src/@vymo/ui/components/documentUploader/cropImage/queries', () => {
  describe('parseAspectRatio', () => {
    it('should return undefined for custom aspect ratio', () => {
      expect(parseAspectRatio('custom')).toBeUndefined();
    });

    it('should correctly parse aspect ratio', () => {
      expect(parseAspectRatio('16:9')).toBeCloseTo(16 / 9);
      expect(parseAspectRatio('4:3')).toBeCloseTo(4 / 3);
    });

    it('should handle invalid aspect ratio format', () => {
      expect(parseAspectRatio('invalid')).toBeNaN();
    });
  });

  describe('canvasToFile', () => {
    it('should resolve with a file when canvas is not empty', async () => {
      const canvas = document.createElement('canvas') as HTMLCanvasElement;
      const filename = 'test.jpg';
      const file = await canvasToFile(canvas, filename);
      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe(filename);
      expect(file.type).toBe('image/jpeg');
    });

    it('should reject if canvas is empty', async () => {
      global.HTMLCanvasElement.prototype.toBlob = function toBlob(
        callback: (blob: Blob | null) => void,
      ) {
        callback(null);
      };

      const canvas = document.createElement('canvas') as HTMLCanvasElement;
      const filename = 'test.jpg';
      await expect(canvasToFile(canvas, filename)).rejects.toThrow(
        'Canvas is empty or could not be converted to a file.',
      );
    });
  });

  describe('addDocument', () => {
    it('should update existing document in the state', () => {
      const state: Document[] = [
        { id: '1', mime: 'image/jpeg', file: new File([], 'file1.jpg') },
      ];
      const newDoc: Document = {
        id: '1',
        mime: 'image/png',
        file: new File([], 'file2.png'),
      };

      const updatedState = addDocument(state, newDoc);
      expect(updatedState).toHaveLength(1);
      expect(updatedState[0]).toEqual(newDoc);
    });

    it('should add new document if not already present in the state', () => {
      const state: Document[] = [
        { id: '1', mime: 'image/jpeg', file: new File([], 'file1.jpg') },
      ];
      const newDoc: Document = {
        id: '2',
        mime: 'image/png',
        file: new File([], 'file2.png'),
      };

      const updatedState = addDocument(state, newDoc);
      expect(updatedState).toHaveLength(2);
      expect(updatedState[1]).toEqual(newDoc);
    });
  });

  describe('getRenderedImageClientRect', () => {
    let mockImage;
    let mockContainer;

    beforeEach(() => {
      // Mock the container element
      mockContainer = {
        offsetWidth: 800,
        offsetHeight: 600,
      };

      // Mock the image element
      mockImage = {
        parentElement: mockContainer,
        naturalWidth: 0,
        naturalHeight: 0,
      };
    });

    it('should calculate dimensions for an image wider than the container (landscape)', () => {
      mockImage.naturalWidth = 1600;
      mockImage.naturalHeight = 900;

      // eslint-disable-next-line testing-library/render-result-naming-convention
      const result = getRenderedImageClientRect(mockImage);

      expect(result).toEqual({
        renderedWidth: 800, // Matches container width
        renderedHeight: 450, // Scaled height
        offsetX: 0, // No horizontal offset
        offsetY: 75, // Centered vertically
      });
    });

    it('should calculate dimensions for an image taller than the container (portrait)', () => {
      mockImage.naturalWidth = 600;
      mockImage.naturalHeight = 1200;

      // eslint-disable-next-line testing-library/render-result-naming-convention
      const result = getRenderedImageClientRect(mockImage);

      expect(result).toEqual({
        renderedWidth: 300, // Scaled width
        renderedHeight: 600, // Matches container height
        offsetX: 250, // Centered horizontally
        offsetY: 0, // No vertical offset
      });
    });

    it('should calculate dimensions for an image matching the container aspect ratio', () => {
      mockImage.naturalWidth = 800;
      mockImage.naturalHeight = 600;

      // eslint-disable-next-line testing-library/render-result-naming-convention
      const result = getRenderedImageClientRect(mockImage);

      expect(result).toEqual({
        renderedWidth: 800, // Matches container width
        renderedHeight: 600, // Matches container height
        offsetX: 0, // No horizontal offset
        offsetY: 0, // No vertical offset
      });
    });

    it('should handle zero dimensions gracefully', () => {
      mockContainer.offsetWidth = 0;
      mockContainer.offsetHeight = 0;
      mockImage.naturalWidth = 0;
      mockImage.naturalHeight = 0;

      // eslint-disable-next-line testing-library/render-result-naming-convention
      const result = getRenderedImageClientRect(mockImage);

      expect(result).toEqual({
        renderedWidth: 0,
        renderedHeight: 0,
        offsetX: 0,
        offsetY: 0,
      });
    });

    it('should calculate for a very narrow container', () => {
      mockContainer.offsetWidth = 100;
      mockContainer.offsetHeight = 600;
      mockImage.naturalWidth = 800;
      mockImage.naturalHeight = 600;

      // eslint-disable-next-line testing-library/render-result-naming-convention
      const result = getRenderedImageClientRect(mockImage);

      expect(result).toEqual({
        renderedWidth: 100, // Scaled width
        renderedHeight: 75, // Scaled height
        offsetX: 0, // No horizontal offset
        offsetY: 262.5, // Centered vertically
      });
    });

    it('should calculate for a very wide container', () => {
      mockContainer.offsetWidth = 1200;
      mockContainer.offsetHeight = 300;
      mockImage.naturalWidth = 800;
      mockImage.naturalHeight = 600;

      // eslint-disable-next-line testing-library/render-result-naming-convention
      const result = getRenderedImageClientRect(mockImage);

      expect(result).toEqual({
        renderedWidth: 400, // Scaled width
        renderedHeight: 300, // Matches container height
        offsetX: 400, // Centered horizontally
        offsetY: 0, // No vertical offset
      });
    });
  });
});
