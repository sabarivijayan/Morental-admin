"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_MANUFACTURERS } from "@/graphql/queries/manufacture";
import { ADD_CARS, ADD_CAR_BY_EXCEL } from "@/graphql/mutations/cars";
import { Input, Button, Select, Form, Upload, message } from "antd";
import {
  Manufacturer,
  FormData,
  GetManufacturersResponse,
} from "@/interfaces/manufacturer";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import styles from "./add-cars.module.css";
import { useRouter } from "next/navigation";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddCars = () => {
  const [form] = Form.useForm(); // Form instance for handling form data
  const router = useRouter();
  
  // Query to get manufacturers
  const {
    loading: loadingManufacturers,
    error: errorManufacturers,
    data: manufacturersData,
  } = useQuery<GetManufacturersResponse>(GET_MANUFACTURERS);
  
  const [loading, setLoading] = useState(false); // State for loading indication
  const [file, setFile] = useState<File | null>(null); // State for uploaded Excel file
  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "",
    description: "",
    transmissionType: "",
    numberOfSeats: "",
    fuelType: "",
    primaryImage: null,
    secondaryImages: [],
    quantity: "",
    manufacturerId: "",
    year: "",
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1979 },
    (_, i) => currentYear - i
  ); // List of years from 1980 to current year

  // Mutation for adding a car
  const [addCar] = useMutation(ADD_CARS, {
    onCompleted: () => {
      // Reset form data upon successful submission
      setFormData({
        name: "",
        type: "",
        description: "",
        transmissionType: "",
        numberOfSeats: "",
        fuelType: "",
        primaryImage: null,
        secondaryImages: [],
        quantity: "",
        manufacturerId: "",
        year: "",
      });
      Swal.fire("Success!", "Car has been added successfully.", "success");
      form.resetFields(); // Reset the form fields
      router.refresh(); // Refresh the page
    },
    onError: (error) => {
      Swal.fire("Error!", error.message, "error");
    },
  });

  // Mutation for adding cars via Excel
  const [addCarByExcel] = useMutation(ADD_CAR_BY_EXCEL, {
    onCompleted: (data) => {
      const {
        success,
        message: responseMessage,
        addedCarsCount,
      } = data.addCarByExcel;
      if (success) {
        message.success(`Added ${addedCarsCount} cars successfully.`);
      } else {
        message.error(responseMessage);
      }
      setLoading(false);
    },
    onError: (error) => {
      message.error(`Error: ${error.message}`);
      setLoading(false);
    },
  });

  // Handler for Excel file upload
  const handleExcelUpload = async () => {
    if (!file) {
      message.warning("Please select an Excel file to upload.");
      return;
    }
    setLoading(true); // Set loading state
    try {
      await addCarByExcel({
        variables: {
          excelFile: file,
        },
      });
    } catch (error) {
      console.error("Error uploading Excel file:", error);
      setLoading(false);
    }
  };

  // Handler for file input change
  const handleFileChange = (info: any) => {
    const fileList = info.fileList;
    if (fileList.length > 0) {
      setFile(fileList[0].originFileObj); // Store the selected Excel file
    } else {
      setFile(null);
    }
  };

  // Generic handler for form input changes
  const handleChange = (value: any, fieldName: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Handler for image file changes
  const handleImageChange = (file: File, fieldName: string) => {
    const fileName = file.name;

    if (fieldName === "primaryImage") {
      setFormData((prev) => ({
        ...prev,
        primaryImage: {
          id: uuidv4(),
          file: file,
          name: fileName,
          preview: URL.createObjectURL(file),
        },
      }));
    } else if (fieldName === "secondaryImages") {
      if (formData.secondaryImages.length < 3) {
        const newSecondaryImages = {
          id: uuidv4(),
          file: file,
          name: fileName,
          preview: URL.createObjectURL(file),
        };

        setFormData((prev) => ({
          ...prev,
          secondaryImages: [...prev.secondaryImages, newSecondaryImages],
        }));
      } else {
        message.warning("You can only upload up to 3 secondary images.");
      }
    }
  };

  // Handler for form submission
  const handleSubmit = async () => {
    if (!formData.primaryImage || formData.secondaryImages.length === 0) {
      message.warning(
        "Please upload a primary image and at least one secondary image."
      );
      return;
    }

    const { primaryImage, secondaryImages, ...carInput } = formData;

    setLoading(true); // Set loading state
    try {
      await addCar({
        variables: {
          ...carInput,
          primaryImage: primaryImage?.file,
          secondaryImages: secondaryImages.map((img) => img.file),
        },
      });
    } catch (error) {
      console.error("Error adding car:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Loading and error states for manufacturers
  if (loadingManufacturers) return <p>Loading manufacturers...</p>;
  if (errorManufacturers)
    return <p>Error fetching manufacturers: {errorManufacturers.message}</p>;

  const manufacturers = manufacturersData?.getManufacturers || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add Cars</h1>
        <Button
          className={styles.listButton}
          onClick={() => router.push("/list-cars")} // Navigate to list cars page
        >
          List Cars
        </Button>
      </div>
      <Form layout="vertical" onFinish={handleSubmit} className={styles.form}>
        <Form.Item
          label="Select Manufacturer"
          required
          className={styles.formItem}
        >
          <Select
            onChange={(value) => handleChange(value, "manufacturerId")}
            placeholder="Select Manufacturer"
            className={styles.selectInput}
          >
            {manufacturers.map((manufacturer: Manufacturer) => (
              <Option key={manufacturer.id} value={manufacturer.id}>
                {manufacturer.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Car Name" required className={styles.formItem}>
          <Input
            onChange={(e) => handleChange(e.target.value, "name")}
            placeholder="Car Name"
            className={styles.input}
          />
        </Form.Item>

        <Form.Item label="Car Type" required className={styles.formItem}>
          <Input
            onChange={(e) => handleChange(e.target.value, "type")}
            placeholder="Car Type"
            className={styles.input}
          />
        </Form.Item>

        <Form.Item label="Year" required className={styles.formItem}>
          <Select
            onChange={(value) => handleChange(value.toString(), "year")} // Convert year to string
            placeholder="Select Year"
            className={styles.selectInput}
          >
            {years.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Description" required className={styles.formItem}>
          <Input.TextArea
            onChange={(e) => handleChange(e.target.value, "description")}
            placeholder="Description"
            className={styles.textArea}
          />
        </Form.Item>

        <Form.Item
          label="Available Quantity"
          required
          className={styles.formItem}
        >
          <Input
            type="number"
            onChange={(e) => handleChange(e.target.value, "quantity")}
            placeholder="Available Quantity"
            className={styles.input}
          />
        </Form.Item>

        <Form.Item
          label="Transmission Type"
          required
          className={styles.formItem}
        >
          <Select
            onChange={(value) => handleChange(value, "transmissionType")}
            placeholder="Select Transmission Type"
            className={styles.selectInput}
          >
            <Option value="Automatic">Automatic</Option>
            <Option value="Manual">Manual</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Number of Seats" required className={styles.formItem}>
          <Select
            onChange={(value) => handleChange(value, "numberOfSeats")}
            placeholder="Select Number of Seats"
            className={styles.selectInput}
          >
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
            <Option value="7">7</Option>
            <Option value="8">8</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Fuel Type" required className={styles.formItem}>
          <Select
            onChange={(value) => handleChange(value, "fuelType")}
            placeholder="Select Fuel Type"
            className={styles.selectInput}
          >
            <Option value="Petrol">Petrol</Option>
            <Option value="Diesel">Diesel</Option>
            <Option value="Electric">Electric</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Upload Primary Image"
          required
          className={styles.formItem}
        >
          <Upload
            maxCount={1} // Allow only one primary image
            listType="picture"
            beforeUpload={(file) => {
              handleImageChange(file, "primaryImage");
              return false; // Prevent automatic upload
            }}
            className={styles.uploadButton}
          >
            <Button>Click to Upload Primary Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Upload secondary Images (Up to 3)"
          className={styles.formItem}
        >
          <Upload
            listType="picture"
            multiple // Allow multiple uploads for secondary images
            beforeUpload={(file) => {
              if (formData.secondaryImages.length < 3) {
                handleImageChange(file, "secondaryImages");
                return false; // Prevent automatic upload
              }
              message.warning("You can only upload up to 3 images.");
              return false; // Prevent automatic upload
            }}
            className={styles.uploadButton}
          >
            <Button>Click to Upload secondary Images</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Upload cars via Excel sheet"
          className={styles.formItem}
        >
          <Upload
            listType="picture"
            multiple
            accept=".xlsx, .xls" // Accept only Excel files
            beforeUpload={() => false} // Prevent automatic upload
            onChange={handleFileChange} // Handle file change
            className={styles.uploadButton}
          >
            <Button
              icon={<UploadOutlined />} // Use Ant Design upload icon
              style={{
                backgroundColor: "#217346", // Excel green color
                color: "#fff",
                borderColor: "#217346",
                fontWeight: "bold", // To give the button a solid look
              }}
            >
              Select Excel File
            </Button>
          </Upload>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading} // Disable button while loading
          className={styles.submitButton}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </Form>
    </div>
  );
};

export default AddCars;
