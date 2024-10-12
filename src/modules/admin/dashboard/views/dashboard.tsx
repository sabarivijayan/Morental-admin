import React from 'react';
import { useQuery } from '@apollo/client';
import DashboardCard from '../components/chart-card/chart-card';
import { GET_MANUFACTURERS } from '@/graphql/queries/manufacture';
import { GET_CARS } from '@/graphql/queries/cars';
import styles from './dashboard.module.css';

const Dashboard: React.FC = () => {
  const { data: manufacturersData } = useQuery(GET_MANUFACTURERS);
  const { data: carsData } = useQuery(GET_CARS);

  const manufacturersChartData = manufacturersData?.getManufacturers.map((m: any) => ({
    name: m.name,
    value: carsData?.getCars.filter((c: any) => c.manufacturer.name === m.name).length || 0,
  })) || [];

  const carTypesChartData = carsData?.getCars.reduce((acc: any, car: any) => {
    acc[car.type] = (acc[car.type] || 0) + 1;
    return acc;
  }, {}) || {};

  const fuelTypesChartData = carsData?.getCars.reduce((acc: any, car: any) => {
    acc[car.fuelType] = (acc[car.fuelType] || 0) + 1;
    return acc;
  }, {}) || {};

  const bookedCarsChartData = carsData?.getCars.reduce((acc: any, car: any) => {
    acc[car.type] = (acc[car.type] || 0) + (car.quantity > 0 ? 1 : 0);
    return acc;
  }, {}) || {};

  return (
    <div className={styles.dashboard}>
      <DashboardCard
        title="Available Car Manufacturers"
        total={manufacturersData?.getManufacturers.length || 0}
        data={manufacturersChartData}
      />
      <DashboardCard
        title="Available Car Types"
        total={carsData?.getCars.length || 0}
        data={Object.entries(carTypesChartData).map(([name, value]) => ({ name, value }))}
      />
      <DashboardCard
        title="Fuel Types"
        total={carsData?.getCars.length || 0}
        data={Object.entries(fuelTypesChartData).map(([name, value]) => ({ name, value }))}
      />
      <DashboardCard
        title="Booked Cars"
        total={carsData?.getCars.filter((c: any) => c.quantity > 0).length || 0}
        data={Object.entries(bookedCarsChartData).map(([name, value]) => ({ name, value }))}
      />
    </div>
  );
};

export default Dashboard;