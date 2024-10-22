import Typesense from "typesense";

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: "43gi25mdsbj89cqrp-1.a1.typesense.net",
      port: 443,
      protocol: "https",
    },
  ],
  apiKey: "hgnXF3dYPa3Pumq8G06vRA0lWND1YNbY",
  connectionTimeoutSeconds: 2,
});

export const searchCars = async (
  query: string,
  transmissionType?: string,
  type?: string,
  fuelType?: string,
  numberOfSeats?: string,
  minPrice?: number,
  maxPrice?: number
) => {
  try {
    const filters: string[] = [];

    // Convert minPrice and maxPrice to integers, and apply only if they are valid integers
    if (minPrice !== undefined) minPrice = Math.floor(minPrice);
    if (maxPrice !== undefined) maxPrice = Math.floor(maxPrice);

    // Adding pricePerDay filter dynamically if minPrice or maxPrice is provided
    if (minPrice !== undefined && maxPrice !== undefined) {
      filters.push(`pricePerDay:>=${minPrice} && pricePerDay:<=${maxPrice}`);
    } else if (minPrice !== undefined) {
      filters.push(`pricePerDay:>=${minPrice}`);
    } else if (maxPrice !== undefined) {
      filters.push(`pricePerDay:<=${maxPrice}`);
    }

    // Adding other filters conditionally
    if (transmissionType) {
      filters.push(`car.transmissionType:=${transmissionType}`);
    }
    if (type) {
      filters.push(`car.type:=${type}`);
    }
    if (fuelType) {
      filters.push(`car.fuelType:=${fuelType}`);
    }
    if (numberOfSeats) {
      filters.push(`car.numberOfSeats:=${numberOfSeats}`);
    }

    // Perform the search with dynamic filters
    const searchResults = await typesenseClient
      .collections("cars")
      .documents()
      .search({
        q: query,
        query_by:
          "car.name, car.manufacturer.name, car.transmissionType, car.fuelType, car.numberOfSeats, car.type",
        filter_by: filters.join(" && "),
        sort_by: `_text_match:desc`, // Optional sorting by relevance, you can change this as needed
      });

    // Return the search results
    return searchResults?.hits?.map((hit: any) => hit.document) || [];
  } catch (error) {
    console.error("Search error: ", error);
    throw new Error("Error fetching cars");
  }
};
