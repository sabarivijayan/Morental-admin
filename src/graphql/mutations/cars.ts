import { gql } from "@apollo/client";

export const ADD_CARS = gql`
    mutation AddCar(
        $name: String!
        $type: String!
        $numberOfSeats: Int!
        $fuelType: String!
        $transmissionType: String!
        $description: String!
        $quantity: Int!
        $manufacturerId: String!
        $primaryImage: Upload!
        $secondaryImages: [Upload!]!
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
            primaryImage
            secondaryImages
        }
    }
`;
