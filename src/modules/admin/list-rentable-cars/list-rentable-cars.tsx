"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Button,
  Image,
  Modal,
  Input,
  Table,
  Dropdown,
  Select,
  Row,
  Col,
  Space,
} from "antd";
import Swal from "sweetalert2";
import {
  DELETE_RENTABLE_CAR,
  UPDATE_RENTABLE_CAR,
} from "@/graphql/mutations/rentable-cars";
import { GET_RENTABLE_CARS } from "@/graphql/queries/rentable-cars";
import { RentableCarInput } from "@/interfaces/rentable-car";
import {
  DownOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import styles from "./list-rentable-cars.module.css";
import { searchCars } from "@/lib/typesense";
import { useAddCarToTypesense } from "@/services/rentable-cars-typesense";
import type { ColumnType } from "antd/es/table";

const ListRentableCars: React.FC = () => {
  const [selectedRentableCar, setSelectedRentableCar] =
    useState<RentableCarInput | null>(null);
  const [pricePerDay, setPricePerDay] = useState<number | null>(null);
  const [availableQuantity, setAvailableQuantity] = useState<number | null>(
    null
  );

  // State for Price Filter
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  // State for search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const { loading, error, data, refetch } = useQuery(GET_RENTABLE_CARS, {
        variables: {
            offset: (currentPage - 1) * pageSize,
            limit: pageSize
        }
    });
  const { addCars } = useAddCarToTypesense();

  // Mutation handlers for deleting and updating rentable cars
  const [deleteRentableCar] = useMutation(DELETE_RENTABLE_CAR, {
    onCompleted: () => {
      refetch(); // Refetch cars after deletion
      Swal.fire("Deleted!", "The car has been deleted.", "success");
    },
    onError: (err) => Swal.fire("Error!", err.message, "error"),
  });

  const [updateRentableCar] = useMutation(UPDATE_RENTABLE_CAR, {
    onCompleted: () => {
      refetch();
      Swal.fire("Success!", "Car updated successfully.", "success");
      refetch(); // Refetch cars after updating
      setSelectedRentableCar(null); // Reset selected car
    },
    onError: (err) => Swal.fire("Error!", err.message, "error"),
  });

  
  // Search handler independent of the price filter
  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);

    try {
      const results = await searchCars(query); // Perform search using Typesense
      setSearchResults(results);
    } catch (error) {
      Swal.fire("Error!", "Failed to search cars", "error");
    } finally {
      setIsSearching(false);
    }
  };

  // Price filter handler
  const handlePriceFilter = async (minPrice?: number, maxPrice?: number) => {
    setIsSearching(true);

    try {
      const results = await searchCars(
        searchQuery,
        undefined,
        undefined,
        undefined,
        undefined,
        minPrice,
        maxPrice
      ); // Filter based on price
      setSearchResults(results);
    } catch (error) {
      Swal.fire("Error!", "Failed to filter cars by price", "error");
    } finally {
      setIsSearching(false);
    }
  };

  // Effect to sync data with Typesense whenever new cars are fetched
  // Effect to sync data with Typesense whenever new cars are fetched
useEffect(() => {
  if (data?.getRentableCars?.rentableCars) {
    addCars(data.getRentableCars.rentableCars).catch(console.error);
  }
}, [data?.getRentableCars]);

  

  // Function to confirm deletion of a car
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
        deleteRentableCar({ variables: { id } }); // Delete car
        Swal.fire("Deleted!", "The car has been deleted.", "success");
      }
    });
  };

  // Prepare for editing a selected rentable car
  const handleEditRentableCar = (car: RentableCarInput) => {
    setSelectedRentableCar(car);
    setPricePerDay(car.pricePerDay);
    setAvailableQuantity(car.availableQuantity);
  };

  // Update the selected rentable car with new values
  const handleUpdateRentableCar = () => {
    if (selectedRentableCar && pricePerDay && availableQuantity) {
      updateRentableCar({
        variables: {
          id: selectedRentableCar.id,
          input: { pricePerDay, availableQuantity },
        },
      });
    } else {
      Swal.fire(
        "Error!",
        "Please provide both price per day and available quantity.",
        "error"
      );
    }
  };

  // Columns with updated type
  const columns: ColumnType<RentableCarInput>[] = [
    {
      title: "Image",
      dataIndex: ["car", "primaryImageUrl"],
      key: "primaryImageUrl",
      render: (_: any, record: RentableCarInput) => (
        <Image width={100} src={record.car?.primaryImageUrl} alt="Car Image" />
      ),
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
      render: (price: number) => `₹${price.toFixed(2)}`,
      sorter: (a: RentableCarInput, b: RentableCarInput) =>
        a.pricePerDay - b.pricePerDay,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: RentableCarInput) => {
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

  if (loading) return <p>Loading rentable cars...</p>; // Loading state
  if (error) return <p>Error loading rentable cars: {error.message}</p>; // Error state

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Rentable Cars List</h1>

      {/* Search and Filter Section */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={16}>
          <Input
            placeholder="Search cars..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={4}>
          <Input
            placeholder="Min Price"
            type="number"
            value={minPrice ?? ""}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            onBlur={() => handlePriceFilter(minPrice, maxPrice)}
          />
        </Col>
        <Col span={4}>
          <Input
            placeholder="Max Price"
            type="number"
            value={maxPrice ?? ""}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            onBlur={() => handlePriceFilter(minPrice, maxPrice)}
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={
            searchResults.length > 0 
                ? searchResults 
                : data?.getRentableCars.rentableCars
        }
        rowKey="id"
        pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: data?.getRentableCars.totalCount || 0,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false
        }}
    />

      {/* Rentable Car Update Modal */}
      <Modal
        title={`Edit ${selectedRentableCar?.car.name ?? ""}`}
        open={Boolean(selectedRentableCar)}
        onCancel={() => setSelectedRentableCar(null)}
        onOk={handleUpdateRentableCar}
        centered
      >
        <div className={styles.modalBody}>
          <Space direction="vertical" size="large">
            <div>
              <label htmlFor="quantity" style={{ fontWeight: "600" }}>
                Available Quantity
              </label>
              <Select
                id="quantity"
                value={availableQuantity}
                onChange={(value) => setAvailableQuantity(value)}
                style={{ width: "100%" }}
              >
                {[...Array(10).keys()].map((num) => (
                  <Select.Option key={num + 1} value={num + 1}>
                    {num + 1}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div>
              <label htmlFor="price" style={{ fontWeight: "600" }}>
                Price Per Day
              </label>
              <Input
                id="price"
                type="number"
                value={pricePerDay ?? ""}
                onChange={(e) => setPricePerDay(Number(e.target.value))}
              />
            </div>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default ListRentableCars;
