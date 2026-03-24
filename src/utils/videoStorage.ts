import { BackgroundVideo } from '../types/workout';

const DB_NAME = 'RowingAppDB';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

interface StoredVideo {
  id: string;
  name: string;
  blob: Blob;
  thumbnail: string;
  timestamp: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      reject(new Error('Canvas context not available'));
      return;
    }

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    video.onloadeddata = () => {
      video.currentTime = 1;
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
      URL.revokeObjectURL(video.src);
      resolve(thumbnail);
    };

    video.onerror = () => {
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video'));
    };

    video.src = URL.createObjectURL(file);
  });
}

export async function saveVideo(file: File): Promise<BackgroundVideo> {
  const db = await openDB();
  const id = `uploaded-${Date.now()}`;

  const thumbnail = await generateVideoThumbnail(file);

  const storedVideo: StoredVideo = {
    id,
    name: file.name,
    blob: file,
    thumbnail,
    timestamp: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(storedVideo);

    request.onsuccess = () => {
      const videoUrl = URL.createObjectURL(file);
      resolve({
        id,
        name: file.name,
        thumbnail,
        category: '업로드',
        videoUrl,
        isVideo: true,
      });
    };

    request.onerror = () => reject(request.error);
  });
}

export async function loadAllVideos(): Promise<BackgroundVideo[]> {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const storedVideos = request.result as StoredVideo[];
        const backgrounds = storedVideos.map((video) => {
          const videoUrl = URL.createObjectURL(video.blob);
          return {
            id: video.id,
            name: video.name,
            thumbnail: video.thumbnail || videoUrl,
            category: '업로드' as const,
            videoUrl,
            isVideo: true,
          };
        });
        resolve(backgrounds);
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to load videos:', error);
    return [];
  }
}

export async function deleteVideo(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getVideo(id: string): Promise<BackgroundVideo | null> {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const video = request.result as StoredVideo;
        if (video) {
          const videoUrl = URL.createObjectURL(video.blob);
          resolve({
            id: video.id,
            name: video.name,
            thumbnail: video.thumbnail || videoUrl,
            category: '업로드',
            videoUrl,
            isVideo: true,
          });
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to get video:', error);
    return null;
  }
}
