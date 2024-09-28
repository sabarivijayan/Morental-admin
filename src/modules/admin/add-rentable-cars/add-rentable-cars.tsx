// components/RentableCars.tsx
"use client";
import { FC } from "react";
import styles from "./add-rentable-cars.module.css";

const RentableCars: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>Add Rentable Cars</h2>
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="manufacturer">Manufacturer</label>
            <select id="manufacturer" className={styles.input}>
              <option value="">Select Manufacturer</option>
              {/* Add manufacturer options here */}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="model">Car Model</label>
            <input
              type="text"
              id="model"
              className={styles.input}
              placeholder="Enter Car Model"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="type">Type of Car</label>
            <input
              type="text"
              id="type"
              className={styles.input}
              placeholder="Enter Type of Car"
            />
          </div>
          <button type="button" className={styles.button}>
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default RentableCars;
