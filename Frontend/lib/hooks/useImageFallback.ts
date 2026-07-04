'use client';

import { useState } from 'react';

export function useImageFallback(primaryUrl: string, fallbackUrl: string) {
  const [imageSrc, setImageSrc] = useState(primaryUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadSuccess = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleLoadError = () => {
    if (imageSrc === primaryUrl && fallbackUrl) {
      setImageSrc(fallbackUrl);
    } else {
      setHasError(true);
    }
    setIsLoading(false);
  };

  return {
    imageSrc,
    isLoading,
    hasError,
    handleLoadSuccess,
    handleLoadError,
  };
}
