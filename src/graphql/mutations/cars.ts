import { gql } from "@apollo/client";

export const ADD_CARS = gql`
    mutation AddCar(
        $name: String!
        $type: String!
        $numberOfSeats: String!
        $fuelType: String!
        $transmissionType: String!
        $description: String!
        $quantity: String!
        $manufacturerId: String!
        $primaryImage: Upload!
        $secondaryImages: [Upload!]!
        $year: String!
    ){
        addCar(
            input:{
                name: $name
                type: $type
                numberOfSeats: $numberOfSeats
                fuelType: $fuelType
                transmissionType: $transmissionType
                description: $description
                quantity: $quantity
                manufacturerId: $manufacturerId
                year: $year
            }
            primaryImage: $primaryImage
            secondaryImages: $secondaryImages
        ){
            id
            name
            type
            numberOfSeats
            fuelType
            transmissionType
            description
            quantity
            manufacturerId
            year
            primaryImageUrl
            secondaryImagesUrls
        }
    }
`;
export const DELETE_CAR = gql`
    mutation DeleteCar($id: String!) {
        deleteCar(id: $id) {
            id
        }
    }
`;

export const UPDATE_CAR = gql`
  mutation UpdateCar($id: String!, $input: EditCarInput!) {
    updateCar(id: $id, input: $input) {
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

export const ADD_CAR_BY_EXCEL = gql`
  mutation addCarByExcel($excelFile: Upload!) {
    addCarByExcel(excelFile: $excelFile) {
      success
      message
      addedCarsCount
    }
  }
`;
