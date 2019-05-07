import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { gql } from "apollo-boost";
import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql"
});



client
  .query({
    query: gql`
      { games { id } }
    `
  })
  .then(result => console.log(result));



ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
