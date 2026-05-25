import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { createRoot } from "react-dom/client";
import App from "./App";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:8080/graphql",
  }),

  cache: new InMemoryCache(),
});

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
  );
}
