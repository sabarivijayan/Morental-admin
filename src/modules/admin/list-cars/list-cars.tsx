"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Button, Image, Modal, Input, Select, Table, Dropdown } from "antd";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { ADD_RENTABLE_CAR } from "@/graphql/mutations/rentable-cars";
import { DELETE_CAR } from "@/graphql/mutations/cars";
import { Car } from "@/interfaces/car";
import { GET_CARS } from "@/graphql/queries/cars";
import styles from "./list-cars.module.css";

const ListCars: React.FC = () => {
  const router = useRouter();
  const [selectedRentableCar, setSelectedRentableCar] = useState<Car | null>(null);
  const [pricePerDay, setPricePerDay] = useState<number | null>(null);
  const [availableQuantity, setAvailableQuantity] = useState<number | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_CARS);
  const [deleteCar] = useMutation(DELETE_CAR, {
    onCompleted: () => refetch(),
    onError: (err) => Swal.fire("Error!", err.message, "error"),
  });
  const [addRentableCar] = useMutation(ADD_RENTABLE_CAR, {
    onCompleted: () => {
      Swal.fire("Success!", "Car added to rentable list.", "success");
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
        deleteCar({ variables: { id } });
        Swal.fire("Deleted!", "Your car has been deleted.", "success");
      }
    });
  };

  const handleAddRentableCar = (car: Car) => {
    setSelectedRentableCar(car);
  };

  const handleRentableSubmit = () => {
    if (pricePerDay && availableQuantity && selectedRentableCar) {
      addRentableCar({
        variables: {
          carId: selectedRentableCar.id,
          pricePerDay,
          availableQuantity,
        },
      });
    } else {
      Swal.fire("Error!", "Please provide both price per day and available quantity.", "error");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "primaryImageUrl",
      key: "primaryImageUrl",
      render: (text: string) => (
        <Image width={100} src={text} alt="Car Image" />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Manufacturer",
      dataIndex: ["manufacturer", "name"],
      key: "manufacturer",
      render: (manufacturerName: string) => manufacturerName || "N/A",
    },
    {
      title: "Car Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: Car) => {
        const menuItems = [
          {
            key: "edit",
            label: "Edit Car",
            icon: <EditOutlined />,
            onClick: () => router.push(`/edit-car?car=${record.id}`),
          },
          {
            key: "delete",
            label: "Delete Car",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete(record.id),
          },
          {
            key: "add-rentable",
            label: "Add to Rentable",
            icon: <PlusCircleOutlined />,
            onClick: () => handleAddRentableCar(record),
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Car List</h1>
        <Button className={styles.addCarButton} onClick={() => router.push("add-cars")}>
          Add Car
        </Button>
      </div>

      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={data?.getCars || []}
          rowKey="id"
          locale={{ emptyText: "No cars available. Please add new cars!" }}
        />
      </div>

      {/* Rentable Modal */}
      <Modal
        title={`Do you want to add ${selectedRentableCar?.name ?? ""} to Rentable?`}
        open={Boolean(selectedRentableCar)}
        onCancel={() => setSelectedRentableCar(null)}
        onOk={handleRentableSubmit}
        centered
      >
        <div className={styles.modalHeader}>
          <h2 style={{ textAlign: "center", fontWeight: "bold", marginBottom: "10px" }}>
            {selectedRentableCar?.name ?? "New Rentable Car"}
          </h2>
        </div>

        <div className={styles.modalBody} style={{ display: "grid", gap: "20px" }}>
          <div className={styles.selectContainer} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label htmlFor="quantity" style={{ fontWeight: "600" }}>
              Available Quantity
            </label>
            <Select
              id="quantity"
              className={styles.modalSelect}
              placeholder="Select quantity"
              onChange={setAvailableQuantity}
              style={{ width: "100%" }}
            >
              {Array.from({ length: Number(selectedRentableCar?.quantity ?? 0) }).map((_, index) => (
                <Select.Option key={index + 1} value={index + 1}>
                  {index + 1}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div className={styles.inputContainer} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label htmlFor="price" style={{ fontWeight: "600" }}>
              Price per Day
            </label>
            <Input
              id="price"
              className={styles.modalInput}
              type="number"
              placeholder="Enter price"
              value={pricePerDay ?? ""}
              onChange={(e) => setPricePerDay(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ListCars;
