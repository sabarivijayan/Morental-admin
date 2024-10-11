// graphql/vehicles.js
import { gql } from "@apollo/client";

export const ADD_RENTABLE_CAR = gql`
  mutation AddRentableCar(
    $carId: ID!
    $pricePerDay: Float!
    $availableQuantity: Int!
  ) {
    addRentableCar(
      carId: $carId
      pricePerDay: $pricePerDay
      availableQuantity: $availableQuantity
    ) {
      id
      carId
      pricePerDay
      availableQuantity
    }
  }
`;
export const DELETE_RENTABLE_CAR = gql`
  mutation DeleteRentableCar($id: ID!) {
    deleteRentableCar(id: $id) {
      id
    }
  }
`;
export const UPDATE_RENTABLE_CAR = gql`
  mutation UpdateRentableCar($id: ID!, $input: EditRentableCarInput!) {
    updateRentableCar(id: $id, input: $input) {
      id
      carId
      pricePerDay
      availableQuantity
      car {
        name
        manufacturer {
          name
        }
      }
    }
  }
`;
