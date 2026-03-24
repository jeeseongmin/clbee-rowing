import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Upload, Video, Trash2 } from 'lucide-react';
import { BackgroundVideo } from '../types/workout';
import { deleteVideo } from '../utils/videoStorage';

interface VideoSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  backgrounds: BackgroundVideo[];
  selectedBackground: BackgroundVideo;
  onSelectBackground: (background: BackgroundVideo) => void;
  onUploadVideo: (file: File) => void;
  onDeleteVideo?: (id: string) => void;
}

export function VideoSettingsDialog({
  open,
  onOpenChange,
  backgrounds,
  selectedBackground,
  onSelectBackground,
  onUploadVideo,
  onDeleteVideo,
}: VideoSettingsDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      onUploadVideo(file);
      onOpenChange(false);
    } else if (file) {
      alert('비디오 파일만 업로드 가능합니다.');
    }
  };

  const handleDelete = async (e: React.MouseEvent, bg: BackgroundVideo) => {
    e.stopPropagation();
    if (bg.category !== '업로드') return;
    if (confirm(`"${bg.name}"을(를) 삭제하시겠습니까?`)) {
      try {
        await deleteVideo(bg.id);
        onDeleteVideo?.(bg.id);
      } catch (error) {
        alert('동영상 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>배경 비디오 설정</DialogTitle>
          <DialogDescription>
            운동 중 표시할 배경을 선택하거나 동영상을 업로드하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="rounded-lg border-2 border-dashed p-8 text-center hover:border-primary/50 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              동영상 업로드
            </Button>
            <p className="text-muted-foreground text-sm mt-3">
              MP4, MOV, AVI 등 비디오 파일 지원
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">기본 배경</h3>
            <div className="grid grid-cols-4 gap-3">
              {backgrounds.map((bg) => (
                <div
                  key={bg.id}
                  onClick={() => { onSelectBackground(bg); onOpenChange(false); }}
                  className={`relative rounded-lg overflow-hidden cursor-pointer ring-2 transition-all hover:scale-[1.03] ${
                    selectedBackground.id === bg.id
                      ? 'ring-primary shadow-lg shadow-primary/20'
                      : 'ring-transparent hover:ring-border'
                  }`}
                >
                  <img src={bg.thumbnail} alt={bg.name} className="w-full h-28 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-white text-xs font-medium">{bg.name}</div>
                    <div className="text-white/60 text-[10px]">{bg.category}</div>
                  </div>
                  {selectedBackground.id === bg.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                  {bg.isVideo && (
                    <Badge variant="secondary" className="absolute top-2 left-2 h-5 px-1.5 text-[10px]">
                      <Video className="h-2.5 w-2.5 mr-1" />
                      영상
                    </Badge>
                  )}
                  {bg.category === '업로드' && (
                    <button
                      onClick={(e) => handleDelete(e, bg)}
                      className="absolute top-2 right-2 bg-destructive/80 hover:bg-destructive rounded p-1.5 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="h-3 w-3 text-white" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
