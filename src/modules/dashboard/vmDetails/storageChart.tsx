import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import styles from './index.module.scss';

const COLORS = [
  'var(--icon-status-info-sublte)',
  'var(--icon-status-success-subtle)',
  '#FFBB28',
];

interface StorageChartProps {
  data: Array<{
    type: string;
    space: number;
  }>;
}

function StorageChart({ data }: StorageChartProps): JSX.Element {
  // Only show free and used in the pie chart
  const chartData = data.filter((item) => item.type !== 'total');

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="var(--icon-status-info-sublte)"
            paddingAngle={5}
            dataKey="space"
          >
            {chartData.map((entry) => (
              <Cell
                key={`cell-${entry.type}`}
                fill={
                  COLORS[
                    chartData.findIndex((item) => item.type === entry.type)
                  ]
                }
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${value} GB`}
            labelFormatter={(_: number, entries: any[]) =>
              entries?.[0]?.payload?.type
                ? entries[0].payload.type.charAt(0).toUpperCase() +
                  entries[0].payload.type.slice(1)
                : ''
            }
          />
        </PieChart>
      </ResponsiveContainer>
      <div className={styles.legend}>
        {chartData.map((entry) => (
          <div key={entry.type} className={styles.legend__item}>
            <div
              className={styles.legend__color}
              style={{
                backgroundColor:
                  COLORS[
                    chartData.findIndex((item) => item.type === entry.type)
                  ],
              }}
            />
            <span className={styles.legend__label}>
              {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}:{' '}
              {entry.space} GB
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default StorageChart;
