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
      <Tournament />
    </ApolloProvider>
    )
  };
}

class GameDlProperty extends React.Component {
  render() {
    const propertyName = this.props.propertyName;
    const propertyValue = this.props.propertyValue;
    return (
      <div>
        <dt className="inline text-crimson-light mr-3 text-xs">{propertyName}</dt>
        <dd className="inline">{propertyValue}</dd>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    const game = this.props.game;
    return (
        <div className="game">
          <dl>
            <GameDlProperty propertyName="ID" propertyValue={game.id} />
            <GameDlProperty propertyName="Tournament stage" propertyValue={game.tournamentStage} />
            <GameDlProperty propertyName="Kickoff at" propertyValue={game.kickoffAt} />
            <GameDlProperty propertyName="Left team" propertyValue={game.leftTeam} />
            <GameDlProperty propertyName="Right team" propertyValue={game.rightTeam} />
            <GameDlProperty propertyName="Left team score" propertyValue={game.leftTeamScore} />
            <GameDlProperty propertyName="Right team score" propertyValue={game.rightTeamScore} />
          </dl>
        </div>
      );
  }
};

class Games extends React.Component {
  render() {
    const games = this.props.games.map((game) => (
      <Game game={game} />
    ));

    return(
      <div id="games">
        {games}
      </div>
    );
  }
}

class Tournament extends React.Component {
  render() {
    return (
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

          return <Games games={data.games} />;
        }}
      </Query>
    );
  }
}


render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
