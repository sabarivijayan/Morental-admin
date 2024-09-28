"use client"
import React, { useState } from 'react';
import styles from './add-location.module.css';

const AddLocation: React.FC = () => {
  const [locationName, setLocationName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the form submission logic here
    const locationData = {
      name: locationName,
    };
    console.log(locationData);
    // You can add API call here to submit location data
    // Reset the input after submission
    setLocationName('');
  };

  return (
    <div className={styles.container}>
    <div className={styles.formContainer}>
      <h2>Add New Location</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Location Name</label>
        <input
          type="text"
          className={styles.input}
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          required
        />

        <button type="submit" className={styles.button}>
          Add
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddLocation;
