"use client"
import React, { useState, useEffect } from 'react';
import styles from './add-cars.module.css';

interface Manufacturer {
  id: number;
  name: string;
}

const AddCars: React.FC = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [carModel, setCarModel] = useState('');
  const [carType, setCarType] = useState('');
  const [seats, setSeats] = useState<number>(0);
  const [fuelType, setFuelType] = useState('');
  const [transmissionType, setTransmissionType] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    // Fetch manufacturers from an API or your data source
    setManufacturers([
      { id: 1, name: 'Toyota' },
      { id: 2, name: 'Honda' },
      { id: 3, name: 'Ford' }
    ]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the form submission logic here
    const carData = {
      carModel,
      carType,
      seats,
      fuelType,
      transmissionType,
      description,
      price,
      quantity,
    };
    console.log(carData);
    // You can add API call here to submit car data
  };

  return (
    <div className={styles.container}>
    <div className={styles.formContainer}>
      <h2>Add New Car</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Manufacturer</label>
        <select className={styles.input} required>
          <option value="">Select Manufacturer</option>
          {manufacturers.map((manufacturer) => (
            <option key={manufacturer.id} value={manufacturer.name}>
              {manufacturer.name}
            </option>
          ))}
        </select>

        <label>Car Model</label>
        <input
          type="text"
          className={styles.input}
          value={carModel}
          onChange={(e) => setCarModel(e.target.value)}
          required
        />

        <label>Type of Car</label>
        <input
          type="text"
          className={styles.input}
          value={carType}
          onChange={(e) => setCarType(e.target.value)}
          required
        />

        <label>Seats</label>
        <input
          type="number"
          className={styles.input}
          value={seats}
          onChange={(e) => setSeats(parseInt(e.target.value))}
          required
        />

        <label>Fuel Type</label>
        <select
          className={styles.input}
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
          required
        >
          <option value="">Select Fuel Type</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <label>Transmission Type</label>
        <select
          className={styles.input}
          value={transmissionType}
          onChange={(e) => setTransmissionType(e.target.value)}
          required
        >
          <option value="">Select Transmission</option>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>

        <label>Description</label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Price</label>
        <input
          type="number"
          className={styles.input}
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          required
        />

        <label>Quantity</label>
        <input
          type="number"
          className={styles.input}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
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

export default AddCars;
