import { gql } from "@apollo/client";

export const USER_LOGIN = gql`
    mutation login($email: String!, $password: String!){
        login(email: $email, password: $password){
            id
            email
            name
        }
    }
`

export const USER_SIGNUP = gql`
    mutation signup($name: String!, $email: String!, $password: String!){
        signup(name: $name, email: $email, password: $password){
            id
            email
            name
        }
    }
`