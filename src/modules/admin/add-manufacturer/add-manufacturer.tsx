"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { message, Form, Input, Button, Select } from "antd";
import CountrySelect from "react-select-country-list";
import { ADD_MANUFACTURER } from "@/graphql/mutations/manufacture";
import styles from "./add-manufacturer.module.css";
import { useRouter } from "next/navigation";

interface CountryOption {
  label: string;
  value: string;
}

const AddManufacturerForm: React.FC = () => {
  const [form] = Form.useForm();
  const [country, setCountry] = useState<string>(""); // State to store the selected country
  const [addManufacturer, { loading }] = useMutation(ADD_MANUFACTURER); // Apollo mutation hook
  const router = useRouter();

  const handleFinish = async (values: { name: string }) => {
    const { name } = values;

    if (!country) {
      message.error("Please select a country.");
      return;
    }

    try {
      await addManufacturer({
        variables: {
          name,
          country, // Use selected country
        },
      });

      message.success("Manufacturer added successfully!");
      form.resetFields();
      setCountry("");
    } catch (error: any) {
      message.error(error.message || "Error adding manufacturer.");
    }
  };

  // Generate country options from react-select-country-list
  const countryOptions: CountryOption[] = CountrySelect()
    .getData()
    .map((country) => ({
      label: country.label, // Full country name
      value: country.value, // Country code
    }));

  const handleCountryChange = (value: string) => {
    const selectedCountry = countryOptions.find(
      (option) => option.value === value
    );
    if (selectedCountry) {
      setCountry(selectedCountry.label); // Store the full name of the selected country
    }
  };

  return (
    <div className={styles.addManufacturerFormWrapper}>
      <h1 className={styles.title}>Add Manufacturers</h1>
      <Button
        onClick={() => router.push("/list-manufacturers")}
        className={styles.listButton}
      >
        List Manufacturer
      </Button>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className={styles.addManufacturerForm}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please input the manufacturer name!" },
          ]}
          className={styles.formItem}
        >
          <Input
            placeholder="Enter manufacturer name"
            className={styles.input}
          />
        </Form.Item>

        <Form.Item
          label="Country"
          name="country"
          rules={[{ required: true, message: "Please select a country!" }]}
          className={styles.formItem}
        >
          <Select
            options={countryOptions}
            onChange={handleCountryChange} // Update the country state with the full country name
            placeholder="Select a country"
            showSearch
            className={styles.select}
            filterOption={
              (input, option) =>
                typeof option?.label === "string" &&
                option.label.toLowerCase().includes(input.toLowerCase()) // Ensure option.label is a string
            }
          />
        </Form.Item>

        <Form.Item className={styles.formItem}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className={styles.submitButton}
          >
            {loading ? "Adding..." : "Add Manufacturer"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddManufacturerForm;
