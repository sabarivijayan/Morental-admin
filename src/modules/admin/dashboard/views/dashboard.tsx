import React from 'react';
import { useQuery } from '@apollo/client';
import DashboardCard from '../components/chart-card/chart-card';
import { GET_MANUFACTURERS } from '@/graphql/queries/manufacture';
import { GET_CARS } from '@/graphql/queries/cars';
import { FETCH_ALL_BOOKINGS } from '@/graphql/queries/bookings';
import styles from './dashboard.module.css';

interface DataItem {
  name: string;
  value: number;
}

const Dashboard: React.FC = () => {
  const { data: manufacturersData, loading: manufacturersLoading, error: manufacturersError } = useQuery(GET_MANUFACTURERS);
  const { data: carsData, loading: carsLoading, error: carsError } = useQuery(GET_CARS);
  const { data: bookingsData, loading: bookingsLoading, error: bookingsError } = useQuery(FETCH_ALL_BOOKINGS, {
    variables: { page: 1, limit: 100 } // Adjust limit as needed for pagination or use logic to handle large datasets.
  });

  if (manufacturersLoading || carsLoading || bookingsLoading) return <div>Loading...</div>;
  if (manufacturersError || carsError || bookingsError) return <div>Error loading data</div>;

  const manufacturersChartData: DataItem[] = Array.isArray(manufacturersData?.getManufacturers?.manufacturers)
    ? manufacturersData.getManufacturers.manufacturers.map((m: any) => ({
        name: m.name,
        value: Array.isArray(carsData?.getCars?.cars)
          ? carsData.getCars.cars.filter((c: any) => c.manufacturer.name === m.name).length
          : 0,
      }))
    : [];

  const carTypesChartData = Array.isArray(carsData?.getCars?.cars)
    ? carsData.getCars.cars.reduce((acc: any, car: any) => {
        acc[car.type] = (acc[car.type] || 0) + 1;
        return acc;
      }, {})
    : {};

  const fuelTypesChartData = Array.isArray(carsData?.getCars?.cars)
    ? carsData.getCars.cars.reduce((acc: any, car: any) => {
        acc[car.fuelType] = (acc[car.fuelType] || 0) + 1;
        return acc;
      }, {})
    : {};

  // Count bookings by car type based on bookingsData
  const bookedCarsChartData: DataItem[] = Array.isArray(bookingsData?.fetchAllBookings?.data)
    ? bookingsData.fetchAllBookings.data.reduce((acc: any, booking: any) => {
        const carType = booking.rentable.car.type;
        acc[carType] = (acc[carType] || 0) + 1;
        return acc;
      }, {})
    : {};

  return (
    <div className={styles.dashboard}>
      <DashboardCard
        title="Available Car Manufacturers"
        total={manufacturersData?.getManufacturers?.manufacturers?.length || 0}
        data={manufacturersChartData}
      />
      <DashboardCard
        title="Available Car Types"
        total={carsData?.getCars?.cars?.length || 0}
        data={Object.entries(carTypesChartData).map(([name, value]) => ({ name, value: value as number }))}
      />
      <DashboardCard
        title="Fuel Types"
        total={carsData?.getCars?.cars?.length || 0}
        data={Object.entries(fuelTypesChartData).map(([name, value]) => ({ name, value: value as number }))}
      />
      <DashboardCard
        title="Booked Cars"
        total={bookingsData?.fetchAllBookings?.data?.length || 0}
        data={Object.entries(bookedCarsChartData).map(([name, value]) => ({ name, value: value as number }))}
      />
    </div>
  );
};

export default Dashboard;
