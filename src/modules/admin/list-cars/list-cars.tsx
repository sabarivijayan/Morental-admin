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
  const [selectedRentableCar, setSelectedRentableCar] = useState<Car | null>(null); // State to hold selected car for rental
  const [pricePerDay, setPricePerDay] = useState<number | null>(null); // State for price per day
  const [availableQuantity, setAvailableQuantity] = useState<number | null>(null); // State for available quantity

  const { loading, error, data, refetch } = useQuery(GET_CARS); // Fetch cars using GraphQL query
  const [deleteCar] = useMutation(DELETE_CAR, { // Mutation to delete a car
    onCompleted: () => refetch(), // Refetch cars after deletion
    onError: (err) => Swal.fire("Error!", err.message, "error"), // Show error on deletion failure
  });
  
  const [addRentableCar] = useMutation(ADD_RENTABLE_CAR, { // Mutation to add a car to the rentable list
    onCompleted: () => {
      Swal.fire("Success!", "Car added to rentable list.", "success"); // Success message
      setSelectedRentableCar(null); // Reset selected car
    },
    onError: (err) => Swal.fire("Error!", err.message, "error"), // Show error on addition failure
  });

  // Function to handle car deletion with confirmation
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
        deleteCar({ variables: { id } }); // Execute deletion
        Swal.fire("Deleted!", "Your car has been deleted.", "success");
      }
    });
  };

  // Function to set the selected car for rental
  const handleAddRentableCar = (car: Car) => {
    setSelectedRentableCar(car); // Store selected car
  };

  // Function to submit rentable car details
  const handleRentableSubmit = () => {
    if (pricePerDay && availableQuantity && selectedRentableCar) {
      addRentableCar({
        variables: {
          carId: selectedRentableCar.id, // Use selected car ID
          pricePerDay,
          availableQuantity,
        },
      });
    } else {
      Swal.fire("Error!", "Please provide both price per day and available quantity.", "error"); // Error if fields are empty
    }
  };

  // Define columns for the car list table
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
      render: (manufacturerName: string) => manufacturerName || "N/A", // Fallback if manufacturer name is not available
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
      title: "Actions", // Column for action buttons
      key: "actions",
      render: (text: any, record: Car) => {
        const menuItems = [ // Define action menu for each car
          {
            key: "edit",
            label: "Edit Car",
            icon: <EditOutlined />,
            onClick: () => router.push(`/edit-car?car=${record.id}`), // Navigate to edit page
          },
          {
            key: "delete",
            label: "Delete Car",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => handleDelete(record.id), // Delete car on confirmation
          },
          {
            key: "add-rentable",
            label: "Add to Rentable",
            icon: <PlusCircleOutlined />,
            onClick: () => handleAddRentableCar(record), // Add car to rentable list
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
          dataSource={data?.getCars || []} // Provide data to the table
          rowKey="id"
          locale={{ emptyText: "No cars available. Please add new cars!" }} // Empty state message
        />
      </div>

      {/* Rentable Modal */}
      <Modal
        title={`Do you want to add ${selectedRentableCar?.name ?? ""} to Rentable?`}
        open={Boolean(selectedRentableCar)} // Modal visibility based on selected car
        onCancel={() => setSelectedRentableCar(null)} // Close modal
        onOk={handleRentableSubmit} // Handle rental submission
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
              onChange={setAvailableQuantity} // Update quantity state
              style={{ width: "100%" }}
            >
              {Array.from({ length: Number(selectedRentableCar?.quantity ?? 0) }).map((_, index) => (
                <Select.Option key={index + 1} value={index + 1}>
                  {index + 1} // Options based on available quantity
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
              value={pricePerDay ?? ""} // Controlled input for price
              onChange={(e) => setPricePerDay(Number(e.target.value))} // Update price state
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ListCars;
