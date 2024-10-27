// components/DashboardCard.tsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import styles from './chart-card.module.css';

interface DataItem {
  name: string;
  value: number;
}

interface DashboardCardProps {
  title: string;
  total: number;
  data: DataItem[];
}

// Define color palette for the pie chart
const COLORS = ['#0D3559', '#175D9C', '#2185DE', '#63A9E8', '#A6CEF2'];

const DashboardCard: React.FC<DashboardCardProps> = ({ title, total, data }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.content}>
        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.totalWrapper}>
          <span className={styles.total}>{total.toLocaleString()}</span>
          <span className={styles.totalLabel}>{title}</span>
        </div>
      </div>
      <div className={styles.legend}>
        {data.map((item, index) => (
          <div key={item.name} className={styles.legendItem}>
            <span
              className={styles.legendColor}
              style={{ backgroundColor: COLORS[index % COLORS.length] }} // Set legend color based on index
            />
            <span className={styles.legendName}>{item.name}</span>
            <span className={styles.legendValue}>{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCard;
