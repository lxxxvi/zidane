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

class App extends React.Component {
  render() {
    return(
    <ApolloProvider client={client}>
      <div>
        <div className="app-name">tippkick</div>
      </div>
      <div>
        <h2>My first Apollo ap!!!!!!!</h2>
      </div>
      <div>
        <h2>Games</h2>
      </div>
      <Games />
    </ApolloProvider>
    )
  };
}

const Game = (game) => (
  return
        <div className="game">
          <dl>
            <div>
              <dt className="inline text-crimson-light mr-3 text-xs">ID</dt>
              <dd className="inline">{game.id}</dd>
            </div>
            <div>
              <dt className="inline text-crimson-light mr-3 text-xs">Tournament stage</dt>
              <dd className="inline">{game.tournamentStage}</dd>
            </div>
            <div>
              <dt className="inline text-crimson-light mr-3 text-xs">Kickoff at</dt>
              <dd className="inline">{game.kickoffAt}</dd>
            </div>
            <div>
              <dt className="inline text-crimson-light mr-3 text-xs">Left team</dt>
              <dd className="inline">{game.leftTeam}</dd>
            </div>
            <div>
              <dt className="inline text-crimson-light mr-3 text-xs">Right team</dt>
              <dd className="inline">{game.rightTeam}</dd>
            </div>
            <div>
              <dt className="inline text-crimson-light mr-3 text-xs">Left team score</dt>
              <dd className="inline">{game.leftTeamScore}</dd>
            </div>
            <div>
              <dt className="inline text-crimson-light mr-3 text-xs">Right team score</dt>
              <dd className="inline">{game.rightTeamScore}</dd>
            </div>
          </dl>
        </div>;
);

const Games = () => (
  <Query
    query={gql`
      {
        games {
          id
          tournamentStage
          kickoffAt
          leftTeam
          rightTeam
          leftTeamScore
          rightTeamScore
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error</p>;

      return data.games.map((game) => (
        <Game game={game} />
      ));
    }}
  </Query>
);

render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
