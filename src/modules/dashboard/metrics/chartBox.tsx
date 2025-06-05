import React, { useState } from 'react';
import { Button, Text } from 'src/@vymo/ui/atoms';
import { Card } from 'src/@vymo/ui/blocks';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ReactComponent as CloseIcon } from 'src/assets/icons/close.svg';
import { ReactComponent as FullScreenIcon } from 'src/assets/icons/fullScreen.svg';
import styles from './index.module.scss';

type ChartBoxProps = {
  title: string;
  data: Array<any>;
  type: 'area' | 'bar';
  dataKey: string;
  brushKey: string;
  yDomain?: [number?, number?];
  referenceLine?: { value: number; label: string } | null;
};
export default function ChartBox({
  title,
  data = [],
  type,
  dataKey,
  brushKey,
  yDomain = [],
  referenceLine = null,
}: ChartBoxProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => setIsFullScreen((prev) => !prev);

  return (
    <Card
      classNames={`${styles.chartBox} ${isFullScreen ? styles.fullScreen : ''}`}
    >
      <div className={styles.chartBox__header}>
        <Text bold type={isFullScreen ? 'h4' : 'default'}>
          {title}
        </Text>
        <Button
          type="text"
          variant="filled"
          onClick={toggleFullScreen}
          iconProps={{
            icon: isFullScreen ? <CloseIcon /> : <FullScreenIcon />,
            iconPosition: 'left',
          }}
        />
      </div>
      <div
        className={styles.chartBox__chart}
        style={{ height: isFullScreen ? '100%' : 400 }}
      >
        <ResponsiveContainer width="100%" height={400}>
          {type === 'area' ? (
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={brushKey} />
              <YAxis dataKey={dataKey} domain={yDomain as any} />
              <Tooltip />
              {referenceLine && (
                <ReferenceLine
                  y={referenceLine.value}
                  label={referenceLine.label}
                  fill="green"
                />
              )}
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke="#8884d8"
                fill="#8884d8"
              />
              <Brush dataKey={brushKey} height={30} stroke="#8884d8" />
            </AreaChart>
          ) : (
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={brushKey} />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar dataKey="pending" stackId="a" fill="var(--text-subtle)" />
              <Bar
                dataKey="passes"
                stackId="a"
                fill="var(--icon-status-success-subtle)"
              />
              <Bar
                dataKey="flaky"
                stackId="a"
                fill="var(--icon-status-info-sublte)"
              />
              <Bar
                dataKey="skipped"
                stackId="a"
                fill="var(--icon-status-warning-subtle)"
              />

              <Bar
                dataKey="failures"
                stackId="a"
                fill="var(--icon-status-error-subtle)"
              />
              <Brush
                dataKey={brushKey}
                startIndex={Math.max(0, data.length - 15)}
                endIndex={data.length - 1}
                height={30}
                stroke="var(--text-subtlest)"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
