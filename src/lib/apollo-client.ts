import { BACKEND_URL } from '@/config/config';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';


const uploadLink = createUploadLink({
  uri: `${BACKEND_URL}/graphql`,
  credentials: 'same-origin',
});

const client = new ApolloClient({
  link: uploadLink,
  uri: `${BACKEND_URL}/graphql`,
  cache: new InMemoryCache(),
});

export default client;
