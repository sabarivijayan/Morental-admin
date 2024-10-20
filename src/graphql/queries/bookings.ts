import { gql } from "@apollo/client";

export const GET_ALL_BOOKINGS = gql`
  query GetAllBookings($filters: BookingFilterInput) {
    getAllBookings(filters: $filters) {
      status
      message
      data {
        id
        carId
        userId
        pickUpDate
        pickUpTime
        dropOffDate
        dropOffTime
        pickUpLocation
        dropOffLocation
        address
        phoneNumber
        totalPrice
        status
        rentable {
          id
          pricePerDay
          availableQuantity
          car {
            name
            manufacturer {
              name
            }
          }
        }
        user {
          id
        }
      }
    }
  }
`;
