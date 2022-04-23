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
          userWish {
            products {
              id
            }
          }
          userCarts {
            id
            quantity
            product {
              id
              totalAvailable
            }
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
      userWish {
        products {
          id
        }
      }
      userCarts {
        id
        quantity
        product {
          id
          totalAvailable
        }
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

export const productsQuery = gql`
  query productsQuery(
    $search: String,
    $minPrice: Float,
    $maxPrice: Float,
    $category: String,
    $business: String,
    $sortBy: String,
    $isAsc: Boolean,
  ) {
    products(
      search: $search,
      minPrice: $minPrice,
      maxPrice: $maxPrice,
      category: $category,
      business: $business,
      sortBy: $sortBy,
      isAsc: $isAsc,
    ) {
      total
      size
      current
      hasNext
      hasPrev
      results {
        id
        name
        price
        totalAvailable
        description
        productImages {
          isCover
          image {
            image
          }
        }
      }
    }
  }
`;

export const singleProductQuery = gql`
  query singleProductQuery($id: ID!) {
    product(id:$id){
      category{
        name
      }
      business {
        name
      }
      name
      price
      totalAvailable
      description
      productImages {
        image {
          image
        }
        isCover
      }
      productComments {
        comment
        createdAt
      }
    }
  }
`;

export const toggleWish = gql`
  mutation toggleWish(
    $productId: ID!
  ) {
    handleWishList(
      productId: $productId
      ) {
      status
    }
  }
`;

export const createCartMutation = gql`
  mutation createCartMutation ($productId: ID!, $quantity: Int){
    createCartItem(productId: $productId, quantity: $quantity){
      cartItem {
        quantity
        id
        product {
          id
          totalCount
        }
      }
    }
  }
`;

export const updateCartMutation = gql`
  mutation updateCartMutation ($cartId: ID!, $quantity: Int!){
    updateCartItem(cartId: $cartId, quantity: $quantity){
      cartItem {
        quantity
        id
        quantity
        product {
          id
          totalCount
        }
      }
    }
  }
`;

export const deleteCartMutation = gql`
  mutation deleteCartMutation(
    $cartId: ID!
  ) {
    handleWishList(
      cartId: $cartId
      ) {
      status
    }
  }
`;