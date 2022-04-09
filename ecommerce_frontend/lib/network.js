import { ApolloClient, InMemoryCache } from '@apollo/client';

const url = "http://127.0.0.1:8000/graphql/";

export const client = new ApolloClient({
    uri: url,
    cache: new InMemoryCache(),
});