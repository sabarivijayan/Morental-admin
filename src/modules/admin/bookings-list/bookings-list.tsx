"use client"
import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Table, Spin, Result, Alert, Button, Tag, Dropdown, Menu } from "antd";
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

  const [dateRange, setDateRange] = useState<[string, string]>(["Aug 20, 2022", "Oct 20, 2022"]);

  useEffect(() => {
    if (token) {
      console.log("Fetching bookings with token:", token);
      fetchAllBookings({
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    } else {
      console.error("No admin token found");
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
        // Refetch the bookings to update the list
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
      title: 'Car',
      dataIndex: ['rentable', 'car', 'primaryImageUrl'],
      key: 'car',
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
      <div className={styles.header}>
        <div className={styles.tabs}>
          <Button type="primary">ALL ({bookings?.length || 0})</Button>
          <Button>RETURN IN TRANSIT</Button>
          <Button>RETURNS RECEIVED</Button>
        </div>
        <div className={styles.actions}>
          <Dropdown overlay={menu}>
            <Button>
              {dateRange[0]} - {dateRange[1]} <DownOutlined />
            </Button>
          </Dropdown>
          <Button type="primary">Request RTO</Button>
        </div>
      </div>
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