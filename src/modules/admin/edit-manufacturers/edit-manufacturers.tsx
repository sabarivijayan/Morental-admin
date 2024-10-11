"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { EDIT_MANUFACTURER } from "@/graphql/mutations/manufacture";
import { message, Input, Form, Button } from "antd";
import { Manufacturer, EditManufacturerProps } from "@/interfaces/manufacturer";
import styles from "./edit-manufacturers.module.css";

const EditManufacturer: React.FC<EditManufacturerProps> = ({ visible, onClose, manufacturer }) => {
  const [form] = Form.useForm();
  const [editManufacturer] = useMutation(EDIT_MANUFACTURER);

  useEffect(() => {
    if (manufacturer) {
      form.setFieldsValue({
        name: manufacturer.name,
        country: manufacturer.country,
      });
    }
  }, [manufacturer, form]);

  const handleCompletion = async (values: any) => {
    const { name, country } = values;
    try {
      const { data } = await editManufacturer({
        variables: {
          id: manufacturer.id,
          name,
          country,
        },
      });

      if (data.editManufacturer) {
        message.success("Manufacturer has been updated successfully!");
        onClose();
      } else {
        message.error("Failed to update manufacturer.");
      }
    } catch (error: any) {
      message.error(error.message || "An error occurred while trying to update the manufacturer.");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleCompletion} className={styles.editForm}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please insert the manufacturer name!" }]}
        className={styles.formItem}
      >
        <Input className={styles.inputField} />
      </Form.Item>
      <Form.Item
        label="Country"
        name="country"
        rules={[{ required: true, message: "Please insert the country name!" }]}
        className={styles.formItem}
      >
        <Input className={styles.inputField} />
      </Form.Item>
      <Form.Item className={styles.buttonContainer}>
        <Button type="primary" htmlType="submit" className={styles.updateButton}>
          Update Manufacturer
        </Button>
        <Button onClick={onClose} className={styles.cancelButton}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditManufacturer;
