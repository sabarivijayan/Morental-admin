import { gql } from '@apollo/client';

export const GET_MANUFACTURERS = gql`
  query GetManufacturers($offset: Int, $limit: Int) {
    getManufacturers(offset: $offset, limit: $limit) {
      manufacturers {
        id
        name
        country
      }
      totalCount
    }
  }
`;
