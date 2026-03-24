import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

interface StrokeGraphProps {
  data: number[];
  maxDataPoints?: number;
}

export function StrokeGraph({ data, maxDataPoints = 20 }: StrokeGraphProps) {
  const chartData = data.slice(-maxDataPoints).map((value, index) => ({
    index,
    spm: value,
  }));

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="mb-2">
        <span className="text-white/60">SPM</span>
      </div>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00B8FF" />
                <stop offset="100%" stopColor="#22FF88" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="index" hide />
            <YAxis domain={[0, 40]} hide />
            <Line
              type="monotone"
              dataKey="spm"
              stroke="url(#strokeGradient)"
              strokeWidth={3}
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-center">
        <span className="text-3xl text-[#00B8FF]">{data[data.length - 1] || 0}</span>
        <span className="text-white/60 ml-1">SPM</span>
      </div>
    </div>
  );
}
