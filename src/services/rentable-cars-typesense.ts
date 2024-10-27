import { useMutation } from '@apollo/client';
import { ADD_CAR_TO_TYPESENSE } from '@/graphql/mutations/typesense';

// Custom hook to manage adding cars to Typesense
export const useAddCarToTypesense = () => {
  // Define the mutation for adding a car to Typesense
  const [addcarToTypesense] = useMutation(ADD_CAR_TO_TYPESENSE);

  // Function to add multiple cars to Typesense
  const addCars = async (cars: any[]) => {
    // Iterate over each car in the input array
    for (const car of cars) {
      // Construct the document to be added to Typesense
      const document = {
        id: car.id, // Unique identifier for the car
        name: car.car.name, // Car name
        type: car.car.type, // Type of the car
        pricePerDay: car.pricePerDay, // Price per day for renting the car
        transmissionType: car.car.transmissionType, // Transmission type (e.g., automatic, manual)
        fuelType: car.car.fuelType, // Fuel type (e.g., petrol, diesel)
        year: car.car.year, // Year of manufacture
        availableQuantity: car.availableQuantity, // Quantity available for rent
        primaryImageUrl: car.car.primaryImageUrl, // URL for the primary image of the car
        manufacturer: car.car.manufacturer.name, // Name of the manufacturer
        numberOfSeats: car.car.numberOfSeats, // Number of seats in the car
        description: car.car.description, // Description of the car
      };

      try {
        // Call the mutation to add the car document to Typesense
        await addcarToTypesense({ variables: { car: document } });
      } catch (error) {
        // Log an error if the mutation fails
        console.error(`Error adding car ${car.car.name} to Typesense:`, error);
        // Throw a new error to inform that adding the car failed
        throw new Error(`Failed to add car ${car.car.name} to Typesense.`);
      }
    }
  };

  // Return the addCars function for use in other components
  return { addCars };
};
