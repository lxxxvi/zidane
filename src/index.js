import React from 'react';
import { render } from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { gql } from "apollo-boost";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Query } from "react-apollo";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql"
});

client
  .query({
    query: gql`{ games { id } }`
  })
  .then(result => console.log(result));


class App extends React.Component {
  render() {
    return(
    <ApolloProvider client={client}>
      <div>
        <div className="app-name">tippkick</div>
      </div>
      <div>
        <h2>My first Apollo app 🚀</h2>
      </div>
      <div>
        <h2>Games</h2>
      </div>
      <Games />
    </ApolloProvider>
    )
  };
}

const Games = () => (
  <Query
    query={gql`
      { games { id } }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error</p>;

      return data.games.map((game) => (
        <p>Game: {game.id}</p>
      ));
    }}
  </Query>
);

render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
