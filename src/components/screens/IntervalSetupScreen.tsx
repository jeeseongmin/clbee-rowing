import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, Trash2, Play, Dumbbell } from 'lucide-react';
import { Interval } from '../../types/workout';
import { motion } from 'motion/react';

interface IntervalSetupScreenProps {
  onStart: (intervals: Interval[]) => void;
}

export function IntervalSetupScreen({ onStart }: IntervalSetupScreenProps) {
  const [intervals, setIntervals] = useState<Interval[]>([
    { id: '1', name: '워밍업', strokeRate: 20, duration: 300, restTime: 60 },
    { id: '2', name: '고강도', strokeRate: 28, duration: 240, restTime: 90 },
  ]);

  const addInterval = () => {
    const newInterval: Interval = {
      id: Date.now().toString(),
      name: `인터벌 ${intervals.length + 1}`,
      strokeRate: 24,
      duration: 180,
      restTime: 60,
    };
    setIntervals([...intervals, newInterval]);
  };

  const deleteInterval = (id: string) => {
    setIntervals(intervals.filter((i) => i.id !== id));
  };

  const updateInterval = (id: string, field: keyof Interval, value: any) => {
    setIntervals(
      intervals.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">인터벌 설정</CardTitle>
                <CardDescription>운동 인터벌을 설정하고 시작하세요</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {intervals.map((interval, index) => (
              <motion.div
                key={interval.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-lg border bg-secondary/50 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{index + 1}</Badge>
                  <span className="text-sm font-medium text-muted-foreground">{interval.name}</span>
                </div>
                <div className="grid grid-cols-5 gap-4 items-end">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">이름</Label>
                    <Input
                      value={interval.name}
                      onChange={(e) => updateInterval(interval.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">목표 SPM</Label>
                    <Input
                      type="number"
                      value={interval.strokeRate}
                      onChange={(e) => updateInterval(interval.id, 'strokeRate', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">운동 시간 (초)</Label>
                    <Input
                      type="number"
                      value={interval.duration}
                      onChange={(e) => updateInterval(interval.id, 'duration', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">휴식 시간 (초)</Label>
                    <Input
                      type="number"
                      value={interval.restTime}
                      onChange={(e) => updateInterval(interval.id, 'restTime', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteInterval(interval.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={addInterval}>
                <Plus className="mr-2 h-4 w-4" />
                인터벌 추가
              </Button>
              <Button onClick={() => onStart(intervals)} className="flex-1">
                <Play className="mr-2 h-4 w-4" />
                운동 시작
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
