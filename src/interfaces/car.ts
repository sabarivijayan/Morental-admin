export interface Car  {
    id: string;
    name:string;
    type:string;
    description: string;
    transmissionType: string;
    fuelType: string;
    numberOfSeats: string;
    quantity: string;
    year: string;
    primaryImageUrl ?: string;
    secondaryImagesUrls ?: string[]; 
};

export interface GetCarsData {
    getCars: Car[];
};

export interface DeleteCarData {
    deleteCar: Car;
};
