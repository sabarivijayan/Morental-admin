"use client"
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_MANUFACTURERS } from "@/graphql/queries/manufacture";
import { ADD_CARS, ADD_CAR_BY_EXCEL } from "@/graphql/mutations/cars"; // Import both mutations
import { Input, Button, Select, Form, Upload, message } from "antd";
import { Manufacturer, FormData, GetManufacturersResponse } from "@/interfaces/manufacturer";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import styles from "./add-cars.module.css";
import { useRouter } from "next/navigation";
import { UploadOutlined } from "@ant-design/icons"; // Icon for the upload button

const { Option } = Select;

const AddCars = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const {
    loading: loadingManufacturers,
    error: errorManufacturers,
    data: manufacturersData,
  } = useQuery<GetManufacturersResponse>(GET_MANUFACTURERS);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null); // State for Excel file
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
  ); // List from 1980 to current year

  const [addCar] = useMutation(ADD_CARS, {
    onCompleted: () => {
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
      form.resetFields();
      router.refresh();
    },
    onError: (error) => {
      Swal.fire("Error!", error.message, "error");
    },
  });

  // Mutation for adding cars by Excel
  const [addCarByExcel] = useMutation(ADD_CAR_BY_EXCEL, {
    onCompleted: (data) => {
      const { success, message: responseMessage, addedCarsCount } = data.addCarByExcel;
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

  const handleExcelUpload = async () => {
    if (!file) {
      message.warning("Please select an Excel file to upload.");
      return;
    }

    setLoading(true);
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

  const handleFileChange = (info: any) => {
    const fileList = info.fileList;
    if (fileList.length > 0) {
      setFile(fileList[0].originFileObj); // Store the selected Excel file
    } else {
      setFile(null);
    }
  };

  const handleChange = (value: any, fieldName: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

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

  const handleSubmit = async () => {
    if (!formData.primaryImage || formData.secondaryImages.length === 0) {
      message.warning(
        "Please upload a primary image and at least one secondary image."
      );
      return;
    }

    const { primaryImage, secondaryImages, ...carInput } = formData;

    setLoading(true);
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
      setLoading(false);
    }
  };

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
          onClick={() => router.push("/list-cars")}
        >
          List Cars
        </Button>
      </div>
      <Form layout="vertical" onFinish={handleSubmit} className={styles.form}>
        {/* Existing form fields */}
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

        <Form.Item label="Primary Image" required className={styles.formItem}>
          <Input
            type="file"
            onChange={(e: any) =>
              handleImageChange(e.target.files[0], "primaryImage")
            }
            className={styles.input}
            accept="image/*"
          />
        </Form.Item>

        <Form.Item label="Secondary Images" required className={styles.formItem}>
          <Input
            type="file"
            onChange={(e: any) =>
              handleImageChange(e.target.files[0], "secondaryImages")
            }
            className={styles.input}
            accept="image/*"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className={styles.submitButton}
        >
          {loading ? "Submitting..." : "Add Car"}
        </Button>

        {/* Excel Upload Section */}
        <Form.Item label="Upload Excel File to Add Cars" className={styles.formItem}>
          <Upload
            accept=".xlsx, .xls"
            beforeUpload={() => false}
            onChange={handleFileChange}
            className={styles.uploadButton}
          >
            <Button icon={<UploadOutlined />}>Select Excel File</Button>
          </Upload>
        </Form.Item>

        <Button
          type="primary"
          onClick={handleExcelUpload}
          loading={loading}
          disabled={!file}
          className={styles.submitButton}
        >
          {loading ? "Uploading..." : "Upload and Add Cars via Excel"}
        </Button>
      </Form>
    </div>
  );
};

export default AddCars;
