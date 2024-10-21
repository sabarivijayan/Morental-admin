import {gql} from '@apollo/client';

export const ADD_CAR_TO_TYPESENSE = gql`
    mutation AddCarToTypesense($car: CarInput!){
        addcarToTypesense(car: $car)
    }
`