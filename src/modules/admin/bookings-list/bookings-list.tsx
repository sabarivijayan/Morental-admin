"use client";
import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { Table, Spin, Result, Button, Tag, message } from "antd";
import Cookies from "js-cookie";
import styles from "./bookings-list.module.css";
import { FETCH_ALL_BOOKINGS } from "@/graphql/queries/bookings";
import { BOOKING_DELIVERY, EXPORT_BOOKINGS_EXCEL, EXPORT_BOOKINGS_PDF } from "@/graphql/mutations/bookings";


const BookingsList: React.FC = () => {
  const token = Cookies.get("adminToken");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [fetchAllBookings, { loading, data, error }] = useLazyQuery(FETCH_ALL_BOOKINGS, {
    variables: {
      page: currentPage,
      limit: pageSize
    },
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

  const [exportToExcel] = useMutation(EXPORT_BOOKINGS_EXCEL);

  const [exportToPDF] = useMutation(EXPORT_BOOKINGS_PDF);

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
        extra={[<Button key="retry" onClick={() => fetchAllBookings()}>Try Again</Button>]}
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

  // Function to handle marking a booking as delivered
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

  const handlePDFExport = async () => {
    try {
      const { data } = await exportToPDF({
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      if (data.exportBookingsPDF.status) {
        const buffer = Buffer.from(data.exportBookingsPDF.data.buffer, 'base64');
        const blob = new Blob([buffer], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = data.exportBookingsPDF.data.filename;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        message.error('Export failed: ' + data.exportBookingsPDF.message);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      message.error('Failed to export PDF');
    }
  };

  const handleExcelExport = async () => {
    try {
      const { data } = await exportToExcel({
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
  
      if (data.exportBookingsExcel.status) {
        const buffer = Buffer.from(data.exportBookingsExcel.data.buffer, 'base64');
        const blob = new Blob([buffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = data.exportBookingsExcel.data.filename;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Export failed:', data.exportBookingsExcel.message);
      }
    } catch (error) {
      console.error('Error exporting Excel:', error);
    }
  };

  const columns = [
    {
      title: 'Car Name',
      dataIndex: ['rentable', 'car', 'name'],
      key: 'carName',
      render: (name: string) => name || 'N/A',  // Fallback for missing names
    },
    {
      title: 'Car Image',
      dataIndex: ['rentable', 'car', 'primaryImageUrl'],
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
      <Button className={styles.pdfButton} type="primary" onClick={handlePDFExport}>
        Download PDF
      </Button>
      <Button type="primary" onClick={handleExcelExport}>
        Download Excel
      </Button>
      <Table
        className={styles.table}
        columns={columns}
        dataSource={data?.fetchAllBookings?.data || []}
        rowKey={(record: any) => record.id}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data?.fetchAllBookings?.pagination?.total || 0,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
            fetchAllBookings({
              variables: {
                page,
                limit: pageSize
              },
              context: {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            });
          },
        }}
      />
    </div>
  );
};

export default BookingsList;
