"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useSearchParams, useRouter } from "next/navigation";
import { Form, Input, Select, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import styles from "./edit-cars.module.css";

// GraphQL queries
import { GET_CAR_BY_ID } from "@/graphql/queries/cars";
import { UPDATE_CAR } from "@/graphql/mutations/cars";

const EditCarPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("car");

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]); // Primary image
  const [otherFiles, setOtherFiles] = useState<any[]>([]); // Secondary images

  // Fetch car details by ID
  const { loading, error, data } = useQuery(GET_CAR_BY_ID, {
    variables: { id },
    skip: !id,
  });

  // Mutation for updating the car
  const [updateCar] = useMutation(UPDATE_CAR, {
    onCompleted: () => {
      Swal.fire("Success", "Car updated successfully", "success");
      router.push("/list-cars"); // Redirect after updating
    },
    onError: (err) => {
      console.error("Error updating the car: ", err);
      Swal.fire("Error!", err.message, "error");
    },
  });

  useEffect(() => {
    if (data?.getCarById) {
      form.setFieldsValue(data.getCarById);
      if (data.getCarById.primaryImageUrl) {
        setFileList([{ url: data.getCarById.primaryImageUrl }]);
      }
      if (data.getCarById.secondaryImagesUrls) {
        setOtherFiles(
          data.getCarById.secondaryImagesUrls.map(
            (url: string, index: number) => ({ url, uid: index.toString() })
          )
        );
      }
    }
  }, [data, form]);

  // Years list from 1980 to the current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1979 },
    (_, i) => currentYear - i
  );

  // Handle form submission
  const handleCompletion = (values: any) => {
    const primaryImage = fileList.length > 0 && fileList[0].originFileObj ? fileList[0].originFileObj : null;
  
    const secondaryImages = otherFiles.map(file => file.originFileObj || null).filter(Boolean);
  
    // Prepare the input data with optional images
    const updatedValues = {
      ...values,
      primaryImage, // Send null if no new image is uploaded
      secondaryImages: secondaryImages.length > 0 ? secondaryImages : null, // Send null if no new images
    };
  
    // Call mutation to update the car
    updateCar({
      variables: {
        id,
        input: updatedValues,
      },
    });
  };
  

  // Handle primary image upload (limit to 1)
  const handlePrimaryFileChange = (info: any) => {
    const newFileList = info.fileList.slice(-1); // Restrict to 1 file
    setFileList(newFileList);
  };

  // Handle multiple secondary image uploads (limit to 3)
  const handleOtherFileChange = (info: any) => {
    const newFileList = info.fileList.slice(0, 3); // Restrict to 3 files
    setOtherFiles(newFileList);
  };

  if (loading) return <p>Loading car data...</p>;
  if (error) return <p>Error loading car data: {error.message}</p>;

  return (
    <div className={styles.mainDiv}>
      <h1>Edit Car</h1>
      <Form
        form={form}
        onFinish={handleCompletion}
        layout="vertical"
        className={styles.form}
      >
        <Form.Item name="name" label="Car Name" rules={[{ required: true }]}>
          <Input placeholder="Enter car name" />
        </Form.Item>

        <Form.Item name="type" label="Car Type" rules={[{ required: true }]}>
          <Input placeholder="Enter car type" />
        </Form.Item>

        <Form.Item name="year" label="Year" rules={[{ required: true }]}>
          <Select placeholder="Select year">
            {years.map((year) => (
              <Select.Option key={year} value={year}>
                {year}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} placeholder="Enter description" />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Available Quantity"
          rules={[{ required: true }]}
        >
          <Input type="number" placeholder="Enter available quantity" />
        </Form.Item>

        <Form.Item
          name="transmissionType"
          label="Transmission Type"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select transmission type">
            <Select.Option value="Automatic">Automatic</Select.Option>
            <Select.Option value="Manual">Manual</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="numberOfSeats"
          label="Number of Seats"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select number of seats">
            <Select.Option value="2">2</Select.Option>
            <Select.Option value="3">3</Select.Option>
            <Select.Option value="4">4</Select.Option>
            <Select.Option value="5">5</Select.Option>
            <Select.Option value="7">7</Select.Option>
            <Select.Option value="8">8</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="fuelType"
          label="Fuel Type"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select fuel type">
            <Select.Option value="Petrol">Petrol</Select.Option>
            <Select.Option value="Diesel">Diesel</Select.Option>
            <Select.Option value="Electric">Electric</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Primary Image">
          <Upload
            listType="picture"
            fileList={fileList}
            onChange={handlePrimaryFileChange}
            beforeUpload={() => false} // Prevent automatic upload
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload Primary Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Secondary Images (Max 3)">
          <Upload
            listType="picture"
            fileList={otherFiles}
            onChange={handleOtherFileChange}
            beforeUpload={() => false} // Prevent automatic upload
            multiple
          >
            <Button icon={<UploadOutlined />}>Upload Secondary Images</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditCarPage;
