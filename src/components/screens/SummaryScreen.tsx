import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { RotateCcw, Download, Trophy, Clock, MapPin, Activity, Gauge } from 'lucide-react';
import { WorkoutSummary } from '../../types/workout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { formatTime } from '../../utils/formatTime';

interface SummaryScreenProps {
  summary: WorkoutSummary;
  onRestart: () => void;
}

export function SummaryScreen({ summary, onRestart }: SummaryScreenProps) {
  const chartData = summary.intervals.map((interval) => ({
    name: interval.name,
    spm: interval.avgStrokeRate,
    distance: interval.distance,
  }));

  const stats = [
    { icon: Clock, label: '총 시간', value: formatTime(summary.totalTime), color: 'text-chart-1' },
    { icon: MapPin, label: '총 거리', value: `${summary.totalDistance.toFixed(0)}m`, color: 'text-chart-2' },
    { icon: Activity, label: '평균 SPM', value: summary.averageStrokeRate.toFixed(1), color: 'text-chart-3' },
    { icon: Gauge, label: '평균 속도', value: `${formatTime(summary.averageSpeed)}/500m`, color: 'text-chart-4' },
  ];

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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                <Trophy className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <CardTitle className="text-2xl">운동 완료!</CardTitle>
                <CardDescription>훌륭한 운동이었습니다</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-lg border bg-secondary/50 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                </motion.div>
              ))}
            </div>

            <Separator />

            {/* Chart */}
            <div>
              <h3 className="text-sm font-medium mb-3">인터벌별 통계</h3>
              <div className="rounded-lg border p-4">
                <div className="h-56 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--chart-1)" />
                          <stop offset="100%" stopColor="var(--chart-2)" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          color: 'var(--foreground)',
                        }}
                      />
                      <Bar dataKey="spm" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 px-4 py-2.5 bg-muted/50 text-xs font-medium text-muted-foreground">
                    <div>구간</div>
                    <div>평균 SPM</div>
                    <div>거리</div>
                    <div>시간</div>
                  </div>
                  {summary.intervals.map((interval, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4 px-4 py-2.5 border-t text-sm">
                      <div className="font-medium">{interval.name}</div>
                      <div className="text-primary">{interval.avgStrokeRate.toFixed(1)} SPM</div>
                      <div>{interval.distance.toFixed(0)}m</div>
                      <div className="text-muted-foreground">{formatTime(interval.time)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={onRestart} className="flex-1" size="lg">
                <RotateCcw className="mr-2 h-4 w-4" />
                새 운동 시작
              </Button>
              <Button variant="outline" size="lg">
                <Download className="mr-2 h-4 w-4" />
                내보내기
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
