import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Trophy, MonitorPlay, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export function LandingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🚣</div>
          <h1 className="text-3xl font-bold">Indoor Rowing Challenge</h1>
          <p className="text-muted-foreground mt-2">실내 로잉 챌린지 플랫폼</p>
        </div>

        <div className="space-y-4">
          <Link to="/main" className="block">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="flex items-center gap-4 py-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <MonitorPlay className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Main — 비디오 플레이어</div>
                  <div className="text-sm text-muted-foreground">
                    로잉 머신 인터벌 운동
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard" className="block">
            <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="flex items-center gap-4 py-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10 shrink-0">
                  <Trophy className="h-6 w-6 text-chart-2" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Dashboard — 리더보드</div>
                  <div className="text-sm text-muted-foreground">
                    1000M 레이스 실시간 순위
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
