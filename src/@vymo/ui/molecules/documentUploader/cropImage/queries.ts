import { Document } from '../types';

export const parseAspectRatio = (aspectRatio) => {
  if (aspectRatio === 'custom') {
    return undefined;
  }
  const [numerator, denominator] = aspectRatio.split(':').map(Number);
  return numerator / denominator;
};

export const canvasToFile = (
  canvas: HTMLCanvasElement,
  filename: string,
): Promise<File> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], filename, { type: 'image/jpeg' });
        resolve(file);
      } else {
        reject(
          new Error('Canvas is empty or could not be converted to a file.'),
        );
      }
    }, 'image/jpeg');
  });

export const addDocument = (state: Document[], document: Document) => {
  const cuurentDocIndex = state.findIndex((doc) => doc.id === document.id);
  if (cuurentDocIndex > -1) {
    state.splice(cuurentDocIndex, 1, document);
  } else {
    state.push(document);
  }
  return [...state];
};

export const getRenderedImageClientRect = (
  image,
): {
  renderedWidth: number;
  renderedHeight: number;
  offsetX: number;
  offsetY: number;
} => {
  const container = image.parentElement;
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  const intrinsicWidth = image.naturalWidth; // Original image width
  const intrinsicHeight = image.naturalHeight; // Original image height

  const containerAspectRatio = containerHeight
    ? containerWidth / containerHeight
    : 0;
  const intrinsicAspectRatio = intrinsicHeight
    ? intrinsicWidth / intrinsicHeight
    : 0;

  let renderedWidth;
  let renderedHeight;
  let offsetX;
  let offsetY;

  if (intrinsicAspectRatio > containerAspectRatio) {
    // Image is wider than container
    renderedWidth = containerWidth;
    renderedHeight = containerWidth / intrinsicAspectRatio;

    offsetX = 0;
    offsetY = (containerHeight - renderedHeight) / 2; // Center vertically
  } else {
    // Image is taller than container
    renderedHeight = containerHeight;
    renderedWidth = containerHeight * intrinsicAspectRatio;

    offsetX = (containerWidth - renderedWidth) / 2; // Center Horizontally
    offsetY = 0;
  }

  return {
    renderedWidth,
    renderedHeight,
    offsetX,
    offsetY,
  };
};
