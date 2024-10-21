import Typesense from 'typesense';

const typesenseClient = new Typesense.Client({
    nodes:[
        {
            host: '43gi25mdsbj89cqrp-1.a1.typesense.net',
            port: 443,
            protocol: 'https',
        },
    ],
    apiKey: 'hgnXF3dYPa3Pumq8G06vRA0lWND1YNbY',
    connectionTimeoutSeconds: 2,
});

export const searchCars = async (
    query: string,
    type?: string, 
    transmissionType?: string,
    fuelType?: string,
    numberOfSeats?: string,
    priceSorting: "asc" | "desc" = "asc"
    
)=>{
    try {
        const filters: string[] = ['pricePerDay:=[1...2000'];
        console.log("Search Parameters: ", { query, transmissionType, fuelType, numberOfSeats, priceSorting, type });

    // Add filters conditionally based on provided arguments
    if (transmissionType) {
      filters.push(`car.transmissionType:=${transmissionType}`);
    }
    if (type) {
        filters.push(`car.type:=${type}`);
    }
    if (fuelType) {
      filters.push(`car.fuelType:=${fuelType}`);
    }
    if (numberOfSeats !== undefined && numberOfSeats !== null) { // Check for undefined as well
      filters.push(`car.numberOfSeats:=${numberOfSeats}`);
    }

    console.log("Filters being used: ", filters.join(" && "));

    const searchResults = await typesenseClient.collections("cars").documents().search({
      q: query,
      query_by: "car.name,car.manufacturer.name,car.transmissionType,car.fuelType,car.type",
      filter_by: filters.join(" && "), // Ensure correct formatting
      sort_by: `pricePerDay:${priceSorting}`, // Sort by price
    });

    console.log("Search Results: ", searchResults); // Log the raw search results
    return searchResults?.hits?.map((hit: any) => hit.document) || [];
  } catch (error) {
    console.error("Search error: ", error); // Log the error
    throw new Error("Error fetching cars");
  }
};
