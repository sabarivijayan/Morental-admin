import { useMutation } from '@apollo/client';
import { ADD_CAR_TO_TYPESENSE } from '@/graphql/mutations/typesense';


export const useAddCarToTypesense = () => {
  const [addcarToTypesense] = useMutation(ADD_CAR_TO_TYPESENSE);

  const addCars = async (cars: any[]) => {
    for (const car of cars) {
      const document = {
        id: car.id,
        name: car.car.name,
        type: car.car.type,
        pricePerDay: car.pricePerDay,
        transmissionType: car.car.transmissionType,
        fuelType: car.car.fuelType,
        year: car.car.year,
        availableQuantity: car.availableQuantity,
        primaryImageUrl: car.car.primaryImageUrl,
        manufacturer: car.car.manufacturer.name,
        numberOfSeats: car.car.numberOfSeats,
        description: car.car.description,
      };

      try {
        await addcarToTypesense({ variables: { car: document } });
      } catch (error) {
        console.error(`Error adding car ${car.car.name} to Typesense:`, error);
        throw new Error(`Failed to add car ${car.car.name} to Typesense.`);
      }
    }
  };

  return { addCars };
};
