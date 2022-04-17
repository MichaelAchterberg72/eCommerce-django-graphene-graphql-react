import {gql, useMutation} from '@apollo/client';

export const LoginMutation = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      access
      refresh
      user {
          id
          firstName
          lastName
          userBusiness {
            name
            id
          }
      }
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

export const meQuery = gql`
  query meQuery {
    me {
      id
      firstName
      lastName
      userBusiness {
        name
        id
      }
    }
  }
`;

export const getAccessMutation = gql`
  mutation getAccessMutation($refresh: String!) {
    getAccess(refresh: $refresh) {
      access
    }
  }
`;

export const createBusinessMutation = gql`
  mutation createBusinessMutation($name: String!) {
    createBusiness(name: $name) {
      business {
        id
      }
    }
  }
`;

export const uploadImageMutation = gql`
  mutation uploadImageMutation($image: Upload!) {
    imageUpload(image: $image) {
      image {
        id
        image
      }
    }
  }
`;

export const categoryQuery = gql`
  query categoryQuery($name: String!) {
    categories(name: $name) {
      id
      name
      count
    }
  }
`;

export const createProductMutation = gql`
  mutation createProductMutation(
    $images: [ProductImageInput],
    $productData: ProductInput!,
    $totalCount: Int!
  ) {
    createProduct(
      images: $images,
      productData: $productData,
      totalCount: $totalCount
    ) {
      product {
        id
      }
    }
  }
`;