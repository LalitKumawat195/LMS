import React, { useState, useRef, useEffect } from 'react';
import {
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  Modal,
  mergeStyles,
  FontWeights
} from '@fluentui/react';
import { useTheme } from './ThemeContext';

const ImagePreview = ({ isOpen, onDismiss, imageUrl, onSave }) => {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false);
      setImagePosition({ x: 0, y: 0 });
      setScale(1);
    }
  }, [isOpen]);

  const containerStyle = mergeStyles({
    width: '300px',
    height: '300px',
    position: 'relative',
    border: `2px solid ${isDark ? '#605e5c' : '#d2d0ce'}`,
    borderRadius: '50%',
    overflow: 'hidden',
    cursor: isDragging ? 'grabbing' : 'grab',
    background: isDark ? '#323130' : '#f3f2f1',
    margin: '0 auto'
  });

  const imageStyle = mergeStyles({
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: `translate(calc(-50% + ${imagePosition.x}px), calc(-50% + ${imagePosition.y}px)) scale(${scale})`,
    transformOrigin: 'center center',
    transition: isDragging ? 'none' : 'transform 0.1s ease',
    maxWidth: 'none',
    maxHeight: 'none'
  });

  const handleMouseDown = (e) => {
    if (!imageLoaded) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y
    });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !imageLoaded) return;
    setImagePosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    if (!imageLoaded) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.5, Math.min(3, scale + delta));
    setScale(newScale);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    const img = imageRef.current;
    if (img) {
      const containerSize = 300;
      const imgAspect = img.naturalWidth / img.naturalHeight;
      
      // Set initial size to fit container
      if (imgAspect > 1) {
        img.style.height = `${containerSize}px`;
        img.style.width = `${containerSize * imgAspect}px`;
      } else {
        img.style.width = `${containerSize}px`;
        img.style.height = `${containerSize / imgAspect}px`;
      }
    }
  };

  const handleSave = () => {
    if (!imageLoaded || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    canvas.width = 300;
    canvas.height = 300;
    
    // Create circular clip
    ctx.save();
    ctx.beginPath();
    ctx.arc(150, 150, 150, 0, Math.PI * 2);
    ctx.clip();
    
    // Calculate image position and size
    const imgWidth = img.offsetWidth * scale;
    const imgHeight = img.offsetHeight * scale;
    const x = 150 - (imgWidth / 2) + imagePosition.x;
    const y = 150 - (imgHeight / 2) + imagePosition.y;
    
    ctx.drawImage(img, x, y, imgWidth, imgHeight);
    ctx.restore();
    
    canvas.toBlob((blob) => {
      if (blob) {
        onSave(blob);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      styles={{
        main: {
          background: isDark ? '#323130' : '#ffffff',
          borderRadius: '4px',
          padding: '24px',
          minWidth: '400px'
        }
      }}
    >
      <Stack tokens={{ childrenGap: 20 }}>
        <Text variant="xLarge" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          Adjust Profile Picture
        </Text>
        
        <Text variant="medium" styles={{ root: { color: isDark ? '#c8c6c4' : '#605e5c' } }}>
          Drag to reposition, scroll to zoom in/out
        </Text>
        
        <div
          ref={containerRef}
          className={containerStyle}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Preview"
            className={imageStyle}
            onLoad={handleImageLoad}
            draggable={false}
          />
        </div>
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        <Stack horizontal tokens={{ childrenGap: 12 }} horizontalAlign="end">
          <DefaultButton text="Cancel" onClick={onDismiss} />
          <PrimaryButton 
            text="Save" 
            onClick={handleSave}
            disabled={!imageLoaded}
          />
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ImagePreview;