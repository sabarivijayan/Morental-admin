"use client";
import { useState } from "react";
import CountryList from 'react-select-country-list';
import Select from 'react-select';
import styles from './add-manufacturer.module.css'; // Import the CSS module

const AddManufacturer = () => {
  const [manufacturerName, setManufacturerName] = useState("");
  const [country, setCountry] = useState("");

  const options = CountryList().getData(); // Get country options

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log({
      manufacturerName,
      country,
    });
    // Clear form after submission
    setManufacturerName("");
    setCountry("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Add Manufacturer</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="manufacturerName">Manufacturer Name</label>
            <input
              type="text"
              id="manufacturerName"
              value={manufacturerName}
              onChange={(e) => setManufacturerName(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="country">Country</label>
            <Select
              options={options}
              value={options.find(option => option.value === country)}
              onChange={(selectedOption) => setCountry(selectedOption?.value || "")}
              className={styles.select}
              isClearable
            />
          </div>
          <button type="submit" className={styles.button}>Add</button>
        </form>
      </div>
    </div>
  );
};

export default AddManufacturer;