"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Button, Image, Modal, Input, Select, Table, Dropdown } from "antd";
import Swal from "sweetalert2";
import { DELETE_RENTABLE_CAR, UPDATE_RENTABLE_CAR } from "@/graphql/mutations/rentable-cars";
import { GET_RENTABLE_CARS } from "@/graphql/queries/rentable-cars";
import { RentableCarInput } from "@/interfaces/rentable-car";
import { DownOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./list-rentable-cars.module.css";

const ListRentableCars: React.FC = () => {
  const [selectedRentableCar, setSelectedRentableCar] = useState<RentableCarInput | null>(null);
  const [pricePerDay, setPricePerDay] = useState<number | null>(null);
  const [availableQuantity, setAvailableQuantity] = useState<number | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_RENTABLE_CARS);
  const [deleteRentableCar] = useMutation(DELETE_RENTABLE_CAR, {
    onCompleted: () => refetch(),
    onError: (err) => Swal.fire("Error!", err.message, "error"),
  });
  const [updateRentableCar] = useMutation(UPDATE_RENTABLE_CAR, {
    onCompleted: () => {
      Swal.fire("Success!", "Car updated successfully.", "success");
      refetch();
      setSelectedRentableCar(null);
    },
    onError: (err) => Swal.fire("Error!", err.message, "error"),
  });

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d9534f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRentableCar({ variables: { id } });
        Swal.fire("Deleted!", "The car has been deleted.", "success");
      }
    });
  };

  const handleEditRentableCar = (car: RentableCarInput) => {
    setSelectedRentableCar(car);
    setPricePerDay(car.pricePerDay);
    setAvailableQuantity(car.availableQuantity);
  };

  const handleUpdateRentableCar = () => {
    if (selectedRentableCar && pricePerDay && availableQuantity) {
      updateRentableCar({
        variables: {
          id: selectedRentableCar.id,
          input: { pricePerDay, availableQuantity },
        },
      });
    } else {
      Swal.fire("Error!", "Please provide both price per day and available quantity.", "error");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: ["car", "primaryImageUrl"],
      key: "primaryImageUrl",
      render: (text: string) => <Image width={100} src={text} alt="Car Image" />,
    },
    {
      title: "Name",
      dataIndex: ["car", "name"],
      key: "name",
    },
    {
      title: "Manufacturer Name",
      dataIndex: ["car", "manufacturer", "name"],
      key: "manufacturer",
    },
    {
      title: "Available Quantity",
      dataIndex: "availableQuantity",
      key: "availableQuantity",
    },
    {
      title: "Price per Day",
      dataIndex: "pricePerDay",
      key: "pricePerDay",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: RentableCarInput) => {
        const menuItems = [
          {
            key: "edit",
            label: "Edit Car",
            icon: <EditOutlined />,
            onClick: () => handleEditRentableCar(record),
          },
          {
            key: "delete",
            label: "Delete Car",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete(record.id),
          },
        ];

        return (
          <Dropdown menu={{ items: menuItems }}>
            <Button>
              Actions <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  if (loading) return <p>Loading rentable cars...</p>;
  if (error) return <p>Error loading rentable cars: {error.message}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Rentable Cars List</h1>
      <div className={styles.tableContainer}>
        <Table columns={columns} dataSource={data?.getRentableCars} rowKey="id" />
      </div>

      {/* Rentable Car Update Modal */}
      <Modal
        title={`Edit ${selectedRentableCar?.car.name || ""}`}
        open={Boolean(selectedRentableCar)}
        onCancel={() => setSelectedRentableCar(null)}
        onOk={handleUpdateRentableCar}
        centered
      >
        <div className={styles.modalBody}>
          <div>
            <label htmlFor="quantity" style={{ fontWeight: "600" }}>Available Quantity</label>
            <Select
              id="quantity"
              value={availableQuantity}
              onChange={setAvailableQuantity}
              style={{ width: "100%" }}
              placeholder="Select quantity"
            >
              {Array.from({ length: selectedRentableCar?.car.quantity || 0 }).map((_, index) => (
                <Select.Option key={index + 1} value={index + 1}>
                  {index + 1}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div style={{ marginTop: "20px" }}>
            <label htmlFor="price" style={{ fontWeight: "600" }}>Price per Day</label>
            <Input
              id="price"
              type="number"
              value={pricePerDay || ""}
              onChange={(e) => setPricePerDay(Number(e.target.value))}
              placeholder="Enter price"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ListRentableCars;
