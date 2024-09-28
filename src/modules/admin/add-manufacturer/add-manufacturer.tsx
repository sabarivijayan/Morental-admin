// components/AddManufacturer.tsx
"use client";
import { useState } from "react";
import styles from './add-manufacturer.module.css'; // Import the CSS module

const AddManufacturer = () => {
  const [manufacturerName, setManufacturerName] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carType, setCarType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log({
      manufacturerName,
      carModel,
      carType,
    });
    // Clear form after submission
    setManufacturerName("");
    setCarModel("");
    setCarType("");
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
          <label htmlFor="carModel">Car Model</label>
          <input
            type="text"
            id="carModel"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="carType">Type of Car</label>
          <input
            type="text"
            id="carType"
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <button type="submit" className={styles.button}>Add</button>
      </form>
    </div>
    </div>
  );
};

export default AddManufacturer;
