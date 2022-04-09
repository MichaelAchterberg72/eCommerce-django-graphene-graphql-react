import {gql, useMutation} from '@apollo/client';

export const LoginMutation = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
          id
      },
      access,
      refresh
    }
  }
`;

export const RegisterMutation = gql`
mutation RegisterMutation($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
  registerUser(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
    message
  }
}
`;