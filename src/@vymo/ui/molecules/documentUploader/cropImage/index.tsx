/* eslint-disable complexity */
import { debounce } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  PixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button, Radio, RadioOption, Slider, Text } from 'src/@vymo/ui/atoms';
import { Body, Footer, Header, List, Modal, Popup } from 'src/@vymo/ui/blocks';
import DocPreview from 'src/@vymo/ui/molecules/docPreview';
import { ReactComponent as AspectIcon } from 'src/assets/icons/aspect.svg';
import { ReactComponent as PreviewIcon } from 'src/assets/icons/preview.svg';
import { ReactComponent as ResetIcon } from 'src/assets/icons/reset.svg';
import { ReactComponent as RotateLeftIcon } from 'src/assets/icons/rotateLeft.svg';
import { ReactComponent as RotateRightIcon } from 'src/assets/icons/rotateRight.svg';
import { getGrowthBookFeatureFlag } from 'src/featureFlags';
import Logger from 'src/logger';
import { isMobile } from 'src/workspace/utils';
import { Document } from '../types';
import {
  addDocument,
  canvasToFile,
  getRenderedImageClientRect,
  parseAspectRatio,
} from './queries';
import styles from './index.module.scss';

const log = new Logger('CropImage');

function centerAspectCrop(
  {
    offsetX,
    offsetY,
    renderedWidth,
    renderedHeight,
  }: {
    offsetX: number;
    offsetY: number;
    renderedWidth: number;
    renderedHeight: number;
  },

  imageContainer,
  aspect?: number,
) {
  if (aspect) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 50,
        },
        aspect,
        imageContainer?.width,
        imageContainer?.height,
      ),
      imageContainer?.width,
      imageContainer?.height,
    );
  }

  return {
    unit: 'px',
    width: renderedWidth,
    height: renderedHeight,
    x: offsetX,
    y: offsetY,
  };
}

const MAX_CANVAS_SIZE = 5000;

function CropImage({
  imageData,
  aspectRatioList = ['custom', '1:1', '4:3'],
  onChange,
}) {
  const [crop, setCrop] = useState({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25,
  });
  const [zoom, setZoom] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [showModal, setShowModal] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewImage, setPreviewImage] = useState<Document[]>([]);
  const [aspectRatioIndex, setAspectRatioIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoomRotate, setZoomRotate] = useState('zoom');
  const [isCanvasLoaded, setIsCanvasLoaded] = useState(false);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const aspect = useMemo(
    () => parseAspectRatio(aspectRatioList[aspectRatioIndex]),
    [aspectRatioList, aspectRatioIndex],
  );

  const {
    rotate: isRotateEnabled,
    zoom: isZoomEnabled,
    aspect: isAspectEnabled,
  } = getGrowthBookFeatureFlag('platform-multimedia-image-config') ?? {};

  useEffect(() => {
    setShowModal(true);
  }, [imageData]);

  useEffect(() => {
    if (imageRef.current && imageLoaded) {
      const { offsetX, offsetY, renderedHeight, renderedWidth } =
        getRenderedImageClientRect(imageRef.current);
      const newCrop = centerAspectCrop(
        { offsetX, offsetY, renderedHeight, renderedWidth },
        imageRef?.current,
        aspect,
      );
      setCrop(newCrop);
      setCompletedCrop(
        convertToPixelCrop(
          // @ts-ignore
          newCrop,
          imageRef?.current?.width,
          imageRef?.current?.height,
        ),
      );
    }
  }, [aspect, imageLoaded, currentIndex, aspectRatioIndex]);

  const handleRotateImage = (angle: number) => {
    setRotate((prevRotate) => (prevRotate + angle) % 360);
  };

  const handleAspectRatioChange = (index: number) => {
    setAspectRatioIndex(index);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleCropChange = (newCrop: PixelCrop) => {
    setCrop(newCrop);
  };

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setPreviewImage([]);
    onChange([]);
    closeModal();
  }, [closeModal, onChange]);

  const handleNextImage = () => {
    setImageLoaded(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageData.length);
  };

  const handlePreviousImage = () => {
    setImageLoaded(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageData.length - 1 : prevIndex - 1,
    );
  };

  const handleResetImage = () => {
    setCrop({
      unit: '%',
      width: 50,
      height: 50,
      x: 25,
      y: 25,
    });
    setZoom(1);
    setRotate(0);
    setCompletedCrop(null);
  };

  const handlePreviewImage = useCallback(() => {
    setShowPreviewModal(true);
  }, []);

  const updateCanvas = useCallback(async () => {
    if (completedCrop && imageRef.current && previewCanvasRef.current) {
      const canvas = previewCanvasRef.current;
      const ctx = canvas.getContext('2d');

      const { renderedHeight, renderedWidth, offsetX, offsetY } =
        getRenderedImageClientRect(imageRef.current);

      if (ctx) {
        const scaleX = imageRef.current.naturalWidth / renderedWidth;
        const scaleY = imageRef.current.naturalHeight / renderedHeight;
        const pixelRatio = window.devicePixelRatio;

        // Calculate scaled dimensions
        let canvasWidth = Math.floor(crop.width * scaleX * pixelRatio);
        let canvasHeight = Math.floor(crop.height * scaleY * pixelRatio);

        let scaleFactor = 1;

        if (canvasWidth > MAX_CANVAS_SIZE || canvasHeight > MAX_CANVAS_SIZE) {
          scaleFactor = Math.min(
            MAX_CANVAS_SIZE / canvasWidth,
            MAX_CANVAS_SIZE / canvasHeight,
          );

          canvasWidth = Math.floor(canvasWidth * scaleFactor);
          canvasHeight = Math.floor(canvasHeight * scaleFactor);
        }

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        const cropX = (crop.x - offsetX) * scaleX * scaleFactor;
        const cropY = (crop.y - offsetY) * scaleY * scaleFactor;

        ctx.save();
        ctx.translate(-cropX, -cropY);
        ctx.translate(
          imageRef.current.naturalWidth / 2,
          imageRef.current.naturalHeight / 2,
        );
        ctx.rotate((rotate * Math.PI) / 180);
        ctx.scale(zoom, zoom);
        ctx.translate(
          -imageRef.current.naturalWidth / 2,
          -imageRef.current.naturalHeight / 2,
        );
        ctx.drawImage(
          imageRef.current,
          0,
          0,
          imageRef.current.naturalWidth * scaleFactor,
          imageRef.current.naturalHeight * scaleFactor,
        );
        ctx.restore();

        try {
          const file = await canvasToFile(
            canvas,
            imageData[currentIndex].file.name,
          );
          setIsCanvasLoaded(true);

          const fileURL = URL.createObjectURL(file);
          setPreviewImage((currentPreviewImage) =>
            addDocument(currentPreviewImage, {
              ...imageData[currentIndex],
              file,
              mime: 'image/jpeg',
              uri: fileURL,
              thumbnail: fileURL,
            }),
          );
        } catch (e) {
          setIsCanvasLoaded(true);
          log.error(e);
        }
      } else {
        log.error('Canvas context is null');
      }
    } else {
      log.error('Crop data or image reference is undefined');
    }
  }, [
    completedCrop,
    crop.height,
    crop.width,
    crop.x,
    crop.y,
    currentIndex,
    imageData,
    rotate,
    zoom,
  ]);

  const debouncedUpdateCanvas = useMemo(
    () => debounce(updateCanvas, 300),
    [updateCanvas],
  );

  useEffect(() => {
    debouncedUpdateCanvas();
    return () => {
      debouncedUpdateCanvas.cancel();
    };
  }, [completedCrop, rotate, zoom, debouncedUpdateCanvas]);

  const cropImageHandler = useCallback(() => {
    onChange(previewImage);
    closeModal();
  }, [onChange, previewImage, closeModal]);

  const supportedAspectRatioElements = useMemo(
    () =>
      aspectRatioList.map((aspectRatio) => {
        switch (aspectRatio) {
          case 'custom':
            return <Text>Custom</Text>;
          case '1:1':
            return <Text>1:1</Text>;
          case '2:1':
            return <Text>2:1</Text>;
          case '4:3':
            return <Text>4:3</Text>;
          case '16:9':
            return <Text>16:9</Text>;
          default:
            return <Text>1:1</Text>;
        }
      }),
    [aspectRatioList],
  );

  return (
    <>
      <Modal
        onClose={closeModal}
        open={showModal}
        showCloseButton={false}
        classNames={styles.cropImage}
      >
        <Header className={styles.cropImage__header}>
          <div className={styles.cropImage__header__controls}>
            <Button
              type="text"
              className={styles.cropImage__rotate}
              onClick={handleResetImage}
              iconProps={{
                icon: <ResetIcon />,
                iconPosition: 'left',
              }}
            >
              {!isMobile() && 'Reset'}
            </Button>

            <div className={styles.cropImage__header__controls__image}>
              <Button
                type="text"
                className={styles.cropImage__rotate}
                onClick={() => handleRotateImage(-90)}
                iconProps={{ icon: <RotateLeftIcon />, iconPosition: 'left' }}
              >
                {!isMobile() && 'Rotate Left'}
              </Button>

              <Button
                type="text"
                className={styles.cropImage__rotate}
                onClick={() => handleRotateImage(90)}
                iconProps={{ icon: <RotateRightIcon />, iconPosition: 'left' }}
              >
                {!isMobile() && 'Rotate Right'}
              </Button>

              {isAspectEnabled && (
                <Popup
                  placement="bottom"
                  content={
                    <List
                      onItemClick={handleAspectRatioChange}
                      selectedIndex={aspectRatioIndex}
                      showSelected
                    >
                      {supportedAspectRatioElements.map(
                        (aspectRatioElement, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <List.Item key={index}>
                            {aspectRatioElement}
                          </List.Item>
                        ),
                      )}
                    </List>
                  }
                >
                  <Button
                    type="text"
                    className={styles.cropImage__rotate}
                    iconProps={{
                      icon: <AspectIcon />,
                      iconPosition: 'left',
                    }}
                  >
                    {!isMobile() && 'Aspect'}
                  </Button>
                </Popup>
              )}
            </div>

            <Button
              type="text"
              className={styles.cropImage__rotate}
              onClick={handlePreviewImage}
              iconProps={{ icon: <PreviewIcon />, iconPosition: 'left' }}
            >
              {!isMobile() && 'Preview'}
            </Button>
          </div>
          {imageData.length > 1 && (
            <Text bold type="label">
              {currentIndex + 1} / {imageData.length}
            </Text>
          )}
        </Header>
        <Body className={styles.cropImage__body}>
          <ReactCrop
            key={currentIndex}
            className={styles.cropImage__body__crop}
            // @ts-ignore
            crop={crop}
            keepSelection
            onComplete={setCompletedCrop}
            onChange={handleCropChange}
            aspect={aspect}
            ruleOfThirds
          >
            <img
              key={currentIndex}
              alt="crop"
              ref={imageRef}
              src={imageData[currentIndex].uri}
              onLoad={handleImageLoad}
              style={{ transform: `scale(${zoom}) rotate(${rotate}deg)` }}
            />
          </ReactCrop>
        </Body>
        <Footer>
          {(isRotateEnabled || isZoomEnabled) && (
            <div className={styles.cropImage__slider}>
              <Slider
                type="angle"
                value={
                  zoomRotate === 'zoom'
                    ? // @ts-ignore
                      parseInt((zoom - 1) * 100, 10)
                    : rotate
                }
                max={zoomRotate === 'zoom' ? 100 : 360}
                onChange={(value) =>
                  zoomRotate === 'zoom'
                    ? setZoom(1 + value / 100)
                    : setRotate(value)
                }
              />
              <Radio
                variant="filled"
                type="tabs"
                name="sliderOptions"
                classNames={styles.cropImage__slider__radioButton}
                value={zoomRotate}
                onChange={(selected) => setZoomRotate(selected[0]?.code || '')}
              >
                {isRotateEnabled && (
                  <RadioOption value="rotate" label="Rotate" />
                )}
                {isZoomEnabled && <RadioOption value="zoom" label="Zoom" />}
              </Radio>
            </div>
          )}
          <div>
            <Button type="text" onClick={handleCancelEdit}>
              Cancel
            </Button>

            {imageData.length > 1 && (
              <Button
                onClick={handlePreviousImage}
                type="text"
                disabled={currentIndex === 0}
              >
                Previous
              </Button>
            )}

            {currentIndex === imageData.length - 1 ? (
              <Button onClick={cropImageHandler} loading={!isCanvasLoaded}>
                Done
              </Button>
            ) : (
              <Button onClick={handleNextImage} loading={!isCanvasLoaded}>
                Next
              </Button>
            )}
          </div>
        </Footer>
      </Modal>

      <DocPreview
        document={previewImage[currentIndex]}
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />

      <canvas ref={previewCanvasRef} style={{ display: 'none' }} />
    </>
  );
}

export default CropImage;
