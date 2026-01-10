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

const ProfilePicturePreview = ({ isOpen, onDismiss, imageUrl, onSave }) => {
  const { isDark } = useTheme();
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setImageLoaded(false);
    }
  }, [isOpen]);

  const containerStyle = mergeStyles({
    width: '300px',
    height: '300px',
    position: 'relative',
    border: `2px solid ${isDark ? '#605e5c' : '#d2d0ce'}`,
    borderRadius: '50%',
    overflow: 'hidden',
    background: isDark ? '#323130' : '#f3f2f1',
    margin: '0 auto'
  });

  const imageStyle = mergeStyles({
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  });

  const handleSave = () => {
    if (!imageLoaded || !imageRef.current) {
      console.error('Image not loaded');
      return;
    }

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
    
    // Draw image to fill the circle
    ctx.drawImage(img, 0, 0, 300, 300);
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
          Profile Picture Preview
        </Text>
        
        <div className={containerStyle}>
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Preview"
            className={imageStyle}
            onLoad={() => setImageLoaded(true)}
            crossOrigin="anonymous"
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

export default ProfilePicturePreview;