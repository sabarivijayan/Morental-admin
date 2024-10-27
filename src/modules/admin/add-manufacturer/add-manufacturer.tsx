"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client"; // Import Apollo mutation hook
import { message, Form, Input, Button, Select } from "antd"; // Import Ant Design components
import CountrySelect from "react-select-country-list"; // Country selection library
import { ADD_MANUFACTURER } from "@/graphql/mutations/manufacture"; // GraphQL mutation for adding a manufacturer
import styles from "./add-manufacturer.module.css"; // Import CSS module for styling
import { useRouter } from "next/navigation"; // Hook for routing

interface CountryOption {
  label: string; // Full name of the country
  value: string; // Country code
}

const AddManufacturerForm: React.FC = () => {
  const [form] = Form.useForm(); // Create a form instance from Ant Design
  const [country, setCountry] = useState<string>(""); // State to store the selected country
  const [addManufacturer, { loading }] = useMutation(ADD_MANUFACTURER); // Apollo mutation hook to add a manufacturer
  const router = useRouter(); // Router instance for navigation

  // Handler for form submission
  const handleFinish = async (values: { name: string }) => {
    const { name } = values;

    // Check if a country has been selected
    if (!country) {
      message.error("Please select a country."); // Show error message if no country is selected
      return;
    }

    try {
      // Execute the mutation to add the manufacturer
      await addManufacturer({
        variables: {
          name,
          country, // Pass the selected country
        },
      });

      message.success("Manufacturer added successfully!"); // Show success message
      form.resetFields(); // Reset form fields after successful submission
      setCountry(""); // Reset country state
    } catch (error: any) {
      message.error(error.message || "Error adding manufacturer."); // Show error message if mutation fails
    }
  };

  // Generate country options from react-select-country-list
  const countryOptions: CountryOption[] = CountrySelect()
    .getData()
    .map((country) => ({
      label: country.label, // Full country name
      value: country.value, // Country code
    }));

  // Handler for country selection
  const handleCountryChange = (value: string) => {
    const selectedCountry = countryOptions.find(
      (option) => option.value === value // Find selected country option
    );
    if (selectedCountry) {
      setCountry(selectedCountry.label); // Store the full name of the selected country
    }
  };

  return (
    <div className={styles.addManufacturerFormWrapper}>
      <h1 className={styles.title}>Add Manufacturers</h1>
      <Button
        onClick={() => router.push("/list-manufacturers")} // Navigate to list manufacturers page
        className={styles.listButton}
      >
        List Manufacturer
      </Button>
      <Form
        form={form} // Bind the form instance to the Ant Design form
        layout="vertical" // Set the layout to vertical
        onFinish={handleFinish} // Bind the form submission handler
        className={styles.addManufacturerForm}
      >
        <Form.Item
          label="Name" // Label for manufacturer name input
          name="name" // Name of the form field
          rules={[{ required: true, message: "Please input the manufacturer name!" }]} // Validation rules
          className={styles.formItem}
        >
          <Input
            placeholder="Enter manufacturer name" // Placeholder for input
            className={styles.input}
          />
        </Form.Item>

        <Form.Item
          label="Country" // Label for country selection
          name="country" // Name of the form field
          rules={[{ required: true, message: "Please select a country!" }]} // Validation rules
          className={styles.formItem}
        >
          <Select
            options={countryOptions} // Options for country selection
            onChange={handleCountryChange} // Update the country state with the selected value
            placeholder="Select a country" // Placeholder for the select
            showSearch // Enable search in the select options
            className={styles.select}
            filterOption={(input, option) =>
              typeof option?.label === "string" &&
              option.label.toLowerCase().includes(input.toLowerCase()) // Ensure option.label is a string and filter options based on input
            }
          />
        </Form.Item>

        <Form.Item className={styles.formItem}>
          <Button
            type="primary" // Button style type
            htmlType="submit" // HTML type for form submission
            loading={loading} // Show loading spinner if loading
            className={styles.submitButton}
          >
            {loading ? "Adding..." : "Add Manufacturer"} // Change button text based on loading state
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddManufacturerForm;
