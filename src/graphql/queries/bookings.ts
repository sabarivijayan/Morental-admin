import { gql } from '@apollo/client';

export const FETCH_ALL_BOOKINGS = gql`
  query FetchAllBookings($page: Int, $limit: Int) {
    fetchAllBookings(page: $page, limit: $limit) {
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
            id
            name
            type
            numberOfSeats
            fuelType
            transmissionType
            description
            quantity
            manufacturer {
              id
              name
              country
            }
            primaryImageUrl
            secondaryImagesUrls
            year
          }
        }
      }
      pagination {
        total
        currentPage
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;