'use client';

import { Pie, PieChart } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { convertFileSize } from '@/lib/utils';

const Chart = ({ used }: { used: number }) => {
  const totalSpace = 2 * 1024 * 1024 * 1024; // 2GB in bytes
  const usedPercentage = (used / totalSpace) * 100;
  const freePercentage = 100 - usedPercentage;
  const availableSpace = convertFileSize(totalSpace - used);

  const spaceChartData = [
    { name: 'Free Space', value: freePercentage, fill: '#E6E6FA' },
    { name: 'Used Space', value: usedPercentage, fill: '#AA336A' },
  ];

  return (
    <Card className="w-full flex flex-col xl:flex-row bg-brand rounded-3xl shadow-lg p-4 text-white hover:animate-pulse hover:cursor-pointer">
      <CardContent className="relative flex items-center justify-center">
        <PieChart width={200} height={200}>
          <Pie
            data={spaceChartData}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={90}
            startAngle={300}
            endAngle={600}
          />
        </PieChart>
        <div className="absolute flex flex-col items-center">
          <span className="text-xl font-bold">
            {usedPercentage.toFixed(2)}%
          </span>
          <span className="text-sm">Space Used</span>
        </div>
      </CardContent>
      <div className="w-full flex flex-col justify-center items-center gap-2 text-center">
        <p className="antialiased tracking-wide text-xl font-bold line-clamp-1">
          Available Space
        </p>
        <p className="text-sm font-semibold">{availableSpace} / 2 GB</p>
      </div>
    </Card>
  );
};

export default Chart;
