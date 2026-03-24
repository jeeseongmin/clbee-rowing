import { useState, useEffect } from 'react';
import { BackgroundVideo } from '../types/workout';
import { defaultBackgrounds } from '../constants/backgrounds';
import { saveVideo, loadAllVideos } from '../utils/videoStorage';

export function useBackgrounds() {
  const [allBackgrounds, setAllBackgrounds] = useState<BackgroundVideo[]>(defaultBackgrounds);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundVideo>(defaultBackgrounds[0]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);

  useEffect(() => {
    const loadSavedVideos = async () => {
      try {
        const savedVideos = await loadAllVideos();
        setAllBackgrounds([...defaultBackgrounds, ...savedVideos]);
      } catch (error) {
        console.error('Failed to load saved videos:', error);
      } finally {
        setIsLoadingVideos(false);
      }
    };

    loadSavedVideos();
  }, []);

  const uploadVideo = async (file: File) => {
    try {
      const newBackground = await saveVideo(file);
      setAllBackgrounds((prev) => [...prev, newBackground]);
      setSelectedBackground(newBackground);
    } catch (error) {
      console.error('Failed to save video:', error);
      alert('동영상 저장에 실패했습니다.');
    }
  };

  const removeVideo = (id: string) => {
    setAllBackgrounds((prev) => prev.filter((bg) => bg.id !== id));
    if (selectedBackground.id === id) {
      setSelectedBackground(defaultBackgrounds[0]);
    }
  };

  return {
    allBackgrounds,
    selectedBackground,
    isLoadingVideos,
    setSelectedBackground,
    uploadVideo,
    removeVideo,
  };
}
