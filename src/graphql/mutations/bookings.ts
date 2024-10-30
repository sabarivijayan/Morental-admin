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
export const EXPORT_BOOKINGS_EXCEL = gql`
mutation ExportBookingsExcel {
  exportBookingsExcel {
    status
    message
    data {
      buffer
      filename
    }
  }
}
`;

export const EXPORT_BOOKINGS_PDF = gql`
  mutation ExportBookingsPDF {
    exportBookingsPDF {
      status
      message
      data {
        buffer
        filename
      }
    }
  }
`;