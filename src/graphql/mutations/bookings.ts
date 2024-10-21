import { gql } from '@apollo/client';

export const BOOKING_DELIVERY = gql`
  mutation BookingDelivery($id: String!) {
    bookingDelivery(id: $id) {
      status
      message
      updatedBooking {
        id
        status
        deliveryDate
      }
    }
  }
`;
