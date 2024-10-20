export interface Car {
    name: string;
    type: string;
  }
  
  export interface Rentable {
    car: Car;
  }
  
  export interface Booking {
    id: string;
    carId: number;
    userId: number;
    pickUpDate: string;
    dropOffDate: string;
    pickUpTime: string;
    dropOffTime: string;
    pickUpLocation: string;
    dropOffLocation: string;
    status: string;
    totalPrice: number;
    rentable: Rentable;
  }
  
  export interface BookingPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }
  
  export interface BookingsResponse {
    status: boolean;
    message: string;
    data: Booking[];
    pagination: BookingPagination;
  }
  
  export interface BookingFilter {
    status?: string;
    startDate?: string;
    endDate?: string;
  }