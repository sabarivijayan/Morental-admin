import { useMutation, gql } from '@apollo/client';

export const ADD_CAR_TO_TYPESENSE = gql`
  mutation AddcarToTypesense($car: CarInput!) {
    addcarToTypesense(car: $car)
  }
`;

interface CarData {
  id: string;
  name: string;
  year: string;
  type: string;
  description: string;
  numberOfSeats: string;
  transmissionType: string;
  fuelType: string;
  primaryImageUrl: string;
  manufacturer: string;
  pricePerDay: number;
  availableQuantity: number;
}

export const useAddCarToTypesense = () => {
  const [addCarToTypesenseMutation] = useMutation(ADD_CAR_TO_TYPESENSE);

  const addCars = async (cars: CarData[]) => {
    for (const carData of cars) {
      const document = {
        id: carData.id,
        pricePerDay: carData.pricePerDay,
        availableQuantity: carData.availableQuantity,
        car: {
          name: carData.name,
          year: carData.year,
          type: carData.type,
          description: carData.description,
          numberOfSeats: carData.numberOfSeats,
          transmissionType: carData.transmissionType,
          fuelType: carData.fuelType,
          primaryImageUrl: carData.primaryImageUrl,
          manufacturer: {
            name: carData.manufacturer
          }
        }
      };

      try {
        await addCarToTypesenseMutation({
          variables: { car: document }
        });
        console.log(`Car ${carData.name} added to Typesense!`);
      } catch (error) {
        console.error(`Error adding car ${carData.name} to Typesense:`, error);
        throw new Error(`Failed to add car ${carData.name} to Typesense.`);
      }
    }
  };

  return { addCars };
};