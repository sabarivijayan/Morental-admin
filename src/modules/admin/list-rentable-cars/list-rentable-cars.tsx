"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Button, Image, Modal, Input, Table, Dropdown, Select } from "antd";
import Swal from "sweetalert2";
import { DELETE_RENTABLE_CAR, UPDATE_RENTABLE_CAR } from "@/graphql/mutations/rentable-cars";
import { GET_RENTABLE_CARS } from "@/graphql/queries/rentable-cars";
import { RentableCarInput } from "@/interfaces/rentable-car";
import { DownOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import styles from "./list-rentable-cars.module.css";
import { searchCars } from "@/lib/typesense";
import { useAddCarToTypesense } from "@/services/rentable-cars-typesense";

const ListRentableCars: React.FC = () => {
  const [selectedRentableCar, setSelectedRentableCar] = useState<RentableCarInput | null>(null);
  const [pricePerDay, setPricePerDay] = useState<number | null>(null);
  const [availableQuantity, setAvailableQuantity] = useState<number | null>(null);

  // State for Price Filter
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // State for search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_RENTABLE_CARS);
  const { addCars } = useAddCarToTypesense();

  // Mutation handlers
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

  // Real-time search handler with price filter
  const handleSearch = async (query: string, minPrice?: number, maxPrice?: number) => {
    setIsSearching(true);
    setSearchQuery(query);

    try {
      const results = await searchCars(query, undefined, undefined, undefined, undefined, minPrice, maxPrice);
      setSearchResults(results);
    } catch (error) {
      Swal.fire("Error!", "Failed to search cars", "error");
    } finally {
      setIsSearching(false);
    }
  };

  // Effect to sync data with Typesense
  useEffect(() => {
    if (data?.getRentableCars) {
      addCars(data.getRentableCars).catch(console.error);
    }
  }, [data?.getRentableCars]);

  // Effect for automatic price filtering
  useEffect(() => {
    handleSearch(searchQuery, minPrice, maxPrice);
  }, [minPrice, maxPrice, searchQuery]);

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
      sorter: (a: any, b: any) => a.pricePerDay - b.pricePerDay,
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

      {/* Search Section */}
      <div className={styles.searchSection}>
        <Input
          placeholder="Search cars..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: "100%" }}
        />
        {/* Price Filter Section */}
        <div style={{ display: "flex", marginTop: "10px" }}>
          <Input
            placeholder="Min Price"
            type="number"
            value={minPrice || ""}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            style={{ marginRight: "10px" }}
          />
          <Input
            placeholder="Max Price"
            type="number"
            value={maxPrice || ""}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        <Table 
          columns={columns} 
          dataSource={searchResults.length > 0 ? searchResults : data?.getRentableCars} 
          rowKey="id" 
        />
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
