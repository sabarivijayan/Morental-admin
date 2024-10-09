// graphql/vehicles.js
import { gql } from '@apollo/client';

export const ADD_CAR = gql`
  mutation addCar($input: VehicleInput!) {
    addRentableCars(input: $input) {
      id
      name
      description
      price
      primaryImage
      secondaryImages
      quantity
      manufacturerId
    }
  }
`;

export const GET_VEHICLES = gql`
  query getVehicles {
    getVehicles {
      id
      name
      description
      price
      primaryImage
      otherImages
      quantity
      manufacturerId
    }
  }
`;

export const DELETE_CAR = gql`
  mutation deleteVehicle($id: ID!) {
    deleteVehicle(id: $id)
  }
`;
