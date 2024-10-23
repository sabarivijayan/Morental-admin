"use client";
import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Table, Spin, Result, Button, Tag, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import styles from "./bookings-list.module.css";
import { FETCH_ALL_BOOKINGS } from "@/graphql/queries/bookings";
import { BOOKING_DELIVERY } from "@/graphql/mutations/bookings";

const BookingsList: React.FC = () => {
  const token = Cookies.get("adminToken");
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [fetchAllBookings, { loading, data, error }] = useLazyQuery(FETCH_ALL_BOOKINGS, {
    onCompleted: (data) => {
      if (!data.fetchAllBookings.status) {
        setFetchError(data.fetchAllBookings.message);
      } else {
        setFetchError(null);
      }
    },
    onError: (error) => {
      console.error("GraphQL error:", error);
      setFetchError(error.message);
    },
  });

  const [bookingDelivery] = useMutation(BOOKING_DELIVERY);

  useEffect(() => {
    if (token) {
      fetchAllBookings({
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    } else {
      setFetchError("No admin token found. Please log in again.");
    }
  }, [token, fetchAllBookings]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <Result
        status="error"
        title="Failed to fetch bookings"
        subTitle={fetchError}
        extra={[
          <Button key="retry" onClick={() => fetchAllBookings()}>
            Try Again
          </Button>,
        ]}
      />
    );
  }

  const bookings = data?.fetchAllBookings?.data || [];

  if (bookings.length === 0) {
    return (
      <Result
        status="info"
        title="No Bookings Found"
        subTitle="It seems there are no bookings available at the moment."
      />
    );
  }

  const handleBookingDelivery = async (bookingId: string) => {
    try {
      const response = await bookingDelivery({
        variables: { id: bookingId },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
      if (response.data.bookingDelivery.status) {
        fetchAllBookings({
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
      } else {
        console.error("Booking delivery failed:", response.data.bookingDelivery.message);
      }
    } catch (error) {
      console.error("Error during booking delivery: ", error);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">Last 30 days</Menu.Item>
      <Menu.Item key="2">Last 3 months</Menu.Item>
      <Menu.Item key="3">Last 6 months</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Car Name',
      dataIndex: ['rentable','car', 'name'],
      key: 'carName',
      render: (name: string) => name || 'N/A',  // Fallback for missing names
    },
    {
      title: 'Car Image',
      dataIndex: ['rentable','car', 'primaryImageUrl'],
      key: 'carImage',
      render: (imageUrl: string) => (
        imageUrl ? (
          <img
            src={imageUrl}
            alt="Car"
            style={{ width: 100, height: 60, objectFit: "cover" }}
          />
        ) : 'No Image Available'  // Fallback for missing images
      ),
    },    
    {
      title: 'Pickup Date',
      dataIndex: 'pickUpDate',
      key: 'pickupDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Dropoff Date',
      dataIndex: 'dropOffDate',
      key: 'dropoffDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => `₹${price}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === "delivered" ? "green" : "orange"}>
          {status === "delivered" ? "Delivered" : "Pending"}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button 
          onClick={() => handleBookingDelivery(record.id)}
          disabled={record.status === "delivered"}
        >
          Mark as Delivered
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.bookingList}>
      <Table
        className={styles.table}
        columns={columns}
        dataSource={bookings}
        rowKey={(record: any) => record.id}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default BookingsList;
