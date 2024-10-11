import { gql } from "@apollo/client";


export const GET_RENTABLE_CARS = gql`
  query GetRentableCars {
    getRentableCars {
      id
      carId
      pricePerDay
      availableQuantity
      car {           
        id
        name
        type
        description
        year
        transmissionType
        fuelType
        numberOfSeats
        primaryImageUrl
        manufacturer {
          id
          name
          country
        }
      }
    }
  }
`;
