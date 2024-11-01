import { gql } from "@apollo/client";


export const GET_RENTABLE_CARS = gql`
    query GetRentableCars($offset: Int, $limit: Int) {
        getRentableCars(offset: $offset, limit: $limit) {
            rentableCars {
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
            totalCount
        }
    }
`;