"use client";

import React, { useRef, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_MANUFACTURERS } from "@/graphql/queries/manufacture";
import { ADD_CARS } from "@/graphql/mutations/cars";
import { Input, Button, Select, Form, Radio, Upload, message } from "antd";
import { Manufacturer, FormData, GetManufacturersResponse } from "@/interfaces/manufacturer";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import styles from './add-cars.module.css';
import { useRouter } from "next/navigation";

const { Option } = Select;

const AddCars = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { loading: loadingManufacturers, error: errorManufacturers, data: manufacturersData } = useQuery<GetManufacturersResponse>(GET_MANUFACTURERS);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: '',
    description: '',
    transmissionType: '',
    numberOfSeats: '',
    fuelType: '',
    primaryImage: null,
    secondaryImages: [],
    quantity: '',
    manufacturerId: '',
    year: '',
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1979 }, (_, i) => currentYear - i); // List from 1980 to current year


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

  const handleChange = (value: any, fieldName: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleImageChange = (file: File, fieldName: string) => {
    const fileName = file.name;
  
    if (fieldName === 'primaryImage') {
      setFormData(prev => ({
        ...prev,
        primaryImage: {
          id: uuidv4(),
          file: file,
          name: fileName,
          preview: URL.createObjectURL(file),
        },
      }));
    } else if (fieldName === 'secondaryImages') {
      if (formData.secondaryImages.length < 3) {
        const newSecondaryImages = {
          id: uuidv4(),
          file: file,
          name: fileName,
          preview: URL.createObjectURL(file),
        };
  
        setFormData(prev => ({
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
      message.warning("Please upload a primary image and at least one secondary image.");
      return;
    }

    const { primaryImage, secondaryImages, ...carInput } = formData;

    setLoading(true);
    try {
      await addCar({
        variables: {
          ...carInput,
          primaryImage: primaryImage?.file,
          secondaryImages: secondaryImages.map(img => img.file),
        },
      });
    } catch(error){
      console.error("Error adding car:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingManufacturers) return <p>Loading manufacturers...</p>;
  if (errorManufacturers) return <p>Error fetching manufacturers: {errorManufacturers.message}</p>;

  const manufacturers = manufacturersData?.getManufacturers || [];

  return (
    <Form layout="vertical" onFinish={handleSubmit} className={styles.form}>
      <Form.Item label="Select Manufacturer" required className={styles.formItem}>
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
          onChange={(value) => handleChange(value, "year")}
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

      <Form.Item label="Available Quantity" required className={styles.formItem}>
        <Input
          type="number"
          onChange={(e) => handleChange(e.target.value, "quantity")}
          placeholder="Available Quantity"
          className={styles.input}
        />
      </Form.Item>
      
      <Form.Item label="Transmission Type" required className={styles.formItem}>
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

      <Form.Item label="Upload Primary Image" required className={styles.formItem}>
        <Upload
          maxCount={1}
          listType="picture"
          beforeUpload={(file) => {
            handleImageChange(file, "primaryImage");
            return false;
          }}
          className={styles.uploadButton}
        >
          <Button>Click to Upload Primary Image</Button>
        </Upload>
      </Form.Item>

      <Form.Item label="Upload secondary Images (Up to 3)" className={styles.formItem}>
        <Upload
          listType="picture"
          multiple
          beforeUpload={(file) => {
            if (formData.secondaryImages.length < 3) {
              handleImageChange(file, "secondaryImages");
              return false;
            }
            message.warning("You can only upload up to 3 images.");
            return false;
          }}
          className={styles.uploadButton}
        >
          <Button>Click to Upload secondary Images</Button>
        </Upload>
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading} disabled={loading} className={styles.submitButton}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </Form>
  );
};

export default AddCars;
