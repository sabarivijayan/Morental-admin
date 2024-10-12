
export interface Manufacturer {
    id: string;
    name: string;
    country: string;
    count: number;
  }


  export interface FormData {
    name: string;
    type: string;
    description: string;
    transmissionType:string;
    numberOfSeats:string;
    fuelType:string;
    primaryImage: ImageFile | null; // This can be an ImageFile object or null
    secondaryImages: ImageFile[];
    quantity: string;
    manufacturerId: string;
    year: string;
  }
  
  export interface ImageFile {
    id: string;  
    file: File | null;  
    name: string | null; 
    preview: string | null; 
  }
  
  export interface GetManufacturersResponse {
    getManufacturers: Manufacturer[];
  }

  export interface EditManufacturerProps{
    visible: boolean;
    onClose: () => void;
    manufacturer: Manufacturer;
  }