import { gql } from "@apollo/client";

export const GET_CARS = gql`
  query GetCars {
    getCars {
      id
      name
      type
      description
      transmissionType
      fuelType
      numberOfSeats
      quantity
      primaryImageUrl
      secondaryImagesUrls
      year
      manufacturer {
        name
      }
    }
  }
`;

export const GET_CAR_BY_ID = gql`
  query GetCarById($id: String!) {
    getCarById(id: $id) {
      id
      name
      type
      description
      fuelType
      numberOfSeats
      transmissionType
      quantity
      primaryImageUrl
      secondaryImagesUrls
      year
    }
  }
`;
