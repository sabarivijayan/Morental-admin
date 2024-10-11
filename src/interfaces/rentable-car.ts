import { Car } from "./car";

export interface AddRentableCarsData{
    addRentable: {
        id: string;
        carId: string;
        pricePerDay: number;
        availableQuantity: number;
    };      
}

export interface RentableCarInput{
    carId: string;
    pricePerDay: number;
    availableQuantity: number;
    car: Car;
}