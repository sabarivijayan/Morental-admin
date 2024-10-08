import { gql } from '@apollo/client'

export const ADD_MANUFACTURER = gql`
    mutation AddManufacturer($name: String!, $country: String!){
        addManufacturer(name: $name, country: $country) {
            id
            name
            country
        }
    }
`
export const EDIT_MANUFACTURER = gql`
    mutation EditManufacturer($id: ID!, $name: String!, $country: String!){
        editManufacturer(id: $id, name: $name, country: $country) {
            id
            name
            country
        }
    }
`
export const DELETE_MANUFACTURER = gql`
    mutation DeleteManufacturer($id: ID!){
        deleteManufacturer(id: $id)
    }
`