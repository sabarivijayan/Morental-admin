"use client"
import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { Table, Input, Button, Space, message, DatePicker } from "antd";
import { ColumnsType } from "antd/lib/table";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./bookings-list.module.css";
import { GET_ALL_BOOKINGS } from "@/graphql/queries/bookings";

const { RangePicker } = DatePicker;

interface Car {
  name: string;
  manufacturer: {
    name: string;
  };
}

interface Rentable {
  id: string;
  pricePerDay: number;
  availableQuantity: number;
  car: Car;
}

interface User {
  id: string;
  // Remove fields that don't exist in your User type
}

interface Booking {
  id: string;
  carId: string;
  userId: string;
  pickUpDate: string;
  pickUpTime: string;
  dropOffDate: string;
  dropOffTime: string;
  pickUpLocation: string;
  dropOffLocation: string;
  address: string;
  phoneNumber: string;
  totalPrice: number;
  status: string;
  rentable: Rentable;
  user: User;
}

const BookingsPage: React.FC = () => {
  const { loading, data, error } = useQuery(GET_ALL_BOOKINGS, {
    variables: { filters: {} } // Pass an empty filters object
  });
  const [filteredData, setFilteredData] = useState<Booking[]>([]);
  const [carNameFilter, setCarNameFilter] = useState<string>("");
  const [userIdFilter, setUserIdFilter] = useState<string>("");
  const [manufacturerFilter, setManufacturerFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  useEffect(() => {
    if (data && data.getAllBookings && data.getAllBookings.data) {
      setFilteredData(data.getAllBookings.data);
    }
  }, [data]);

  const handleSearch = () => {
    const filtered = data.getAllBookings.data.filter((booking: Booking) => {
      const carName = booking.rentable?.car?.name || "";
      const userId = booking.userId || "";
      const manufacturerName = booking.rentable?.car?.manufacturer?.name || "";
      const pickUpDate = new Date(booking.pickUpDate);
      const dropOffDate = new Date(booking.dropOffDate);

      return (
        carName.toLowerCase().includes(carNameFilter.toLowerCase()) &&
        userId.toLowerCase().includes(userIdFilter.toLowerCase()) &&
        manufacturerName.toLowerCase().includes(manufacturerFilter.toLowerCase()) &&
        (!dateRange || (
          pickUpDate >= new Date(dateRange[0]) &&
          dropOffDate <= new Date(dateRange[1])
        ))
      );
    });
    setFilteredData(filtered);
  };

  const columns: ColumnsType<Booking> = [
    {
      title: "Car Name",
      dataIndex: ["rentable", "car", "name"],
      key: "carName",
    },
    {
      title: "Manufacturer",
      dataIndex: ["rentable", "car", "manufacturer", "name"],
      key: "manufacturerName",
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Pick Up Date",
      dataIndex: "pickUpDate",
      key: "pickUpDate",
    },
    {
      title: "Drop Off Date",
      dataIndex: "dropOffDate",
      key: "dropOffDate",
    },
    {
      title: "Pick Up Location",
      dataIndex: "pickUpLocation",
      key: "pickUpLocation",
    },
    {
      title: "Drop Off Location",
      dataIndex: "dropOffLocation",
      key: "dropOffLocation",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `₹${price}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  if (loading) return <p>Loading bookings...</p>;
  if (error) {
    message.error("Error fetching bookings: " + error.message);
    return <p>Error loading bookings.</p>;
  }

  return (
    <div className={styles.bookingsPage}>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search by Car Name"
          value={carNameFilter}
          onChange={(e) => setCarNameFilter(e.target.value)}
          style={{ width: 200 }}
        />
        <Input
          placeholder="Search by User ID"
          value={userIdFilter}
          onChange={(e) => setUserIdFilter(e.target.value)}
          style={{ width: 200 }}
        />
        <Input
          placeholder="Search by Manufacturer"
          value={manufacturerFilter}
          onChange={(e) => setManufacturerFilter(e.target.value)}
          style={{ width: 200 }}
        />
        <RangePicker
          onChange={(dates) => setDateRange(dates ? [dates[0].toISOString(), dates[1].toISOString()] : null)}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Search
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default BookingsPage;