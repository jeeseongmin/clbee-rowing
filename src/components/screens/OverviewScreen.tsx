import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Play, Upload, Video, Eye } from 'lucide-react';
import { Interval, BackgroundVideo } from '../../types/workout';
import { VideoSettingsDialog } from '../VideoSettingsDialog';
import { motion } from 'motion/react';
import { formatTimeKorean } from '../../utils/formatTime';

interface OverviewScreenProps {
  intervals: Interval[];
  backgrounds: BackgroundVideo[];
  onStart: (selectedBackground: BackgroundVideo) => void;
  onUploadVideo: (file: File) => void;
  onDeleteVideo?: (id: string) => void;
}

export function OverviewScreen({ intervals, backgrounds, onStart, onUploadVideo, onDeleteVideo }: OverviewScreenProps) {
  const [selectedBg, setSelectedBg] = useState<BackgroundVideo>(backgrounds[0]);
  const [showVideoSettings, setShowVideoSettings] = useState(false);

  const totalTime = intervals.reduce((sum, i) => sum + (i.duration || 0) + i.restTime, 0);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">운동 개요</CardTitle>
                <CardDescription>배경을 선택하고 운동을 시작하세요</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Background Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">배경 영상 선택</h3>
                <Button variant="outline" size="sm" onClick={() => setShowVideoSettings(true)}>
                  <Upload className="mr-2 h-3.5 w-3.5" />
                  동영상 업로드
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {backgrounds.map((bg) => (
                  <motion.div
                    key={bg.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedBg(bg)}
                    className={`relative rounded-lg overflow-hidden cursor-pointer ring-2 transition-all ${
                      selectedBg.id === bg.id
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
                    {selectedBg.id === bg.id && (
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
                  </motion.div>
                ))}
              </div>
            </div>

            <VideoSettingsDialog
              open={showVideoSettings}
              onOpenChange={setShowVideoSettings}
              backgrounds={backgrounds}
              selectedBackground={selectedBg}
              onSelectBackground={(bg) => setSelectedBg(bg)}
              onUploadVideo={onUploadVideo}
              onDeleteVideo={onDeleteVideo}
            />

            <Separator />

            {/* Interval Summary */}
            <div>
              <h3 className="text-sm font-medium mb-3">인터벌 요약</h3>
              <div className="rounded-lg border overflow-hidden">
                <div className="grid grid-cols-4 gap-4 px-4 py-2.5 bg-muted/50 text-xs font-medium text-muted-foreground">
                  <div>세그먼트</div>
                  <div>목표 SPM</div>
                  <div>운동 시간</div>
                  <div>휴식 시간</div>
                </div>
                {intervals.map((interval) => (
                  <div key={interval.id} className="grid grid-cols-4 gap-4 px-4 py-3 border-t text-sm">
                    <div className="font-medium">{interval.name}</div>
                    <div className="text-primary">{interval.strokeRate} SPM</div>
                    <div>{formatTimeKorean(interval.duration || 0)}</div>
                    <div className="text-muted-foreground">{formatTimeKorean(interval.restTime)}</div>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4 px-4 py-3 border-t bg-muted/30">
                  <div className="text-sm font-medium">총 운동 시간</div>
                  <div className="text-sm text-primary font-semibold text-right">{formatTimeKorean(totalTime)}</div>
                </div>
              </div>
            </div>

            <Button onClick={() => onStart(selectedBg)} className="w-full" size="lg">
              <Play className="mr-2 h-5 w-5" />
              운동 시작하기
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
