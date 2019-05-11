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
      <div className="full flex">
        <div className="w-3/10"></div>
        <div className="w-2/5">
          <div className="text-center">
            <div className="app-name">tippkick</div>
          </div>
          <Tournament />
         </div>
         <div className="w-3/10"></div>
       </div>
    </ApolloProvider>
    )
  };
}


class GamePredictionToggler extends React.Component {
  render() {
    const showPrediction = this.props.showPrediction;

    if (showPrediction) {
      return (<div className="text-center">Close</div>);
    } else {
      return (<div className="text-center">Predict</div>);
    }
  }
}

class GamePrediction extends React.Component {
  render() {

    const showPrediction = this.props.showPrediction;

    if (showPrediction) {
      return (
        <div>
          <div className="game-prediction flex">
            <div className="game-prediction__left-team w-3/10 text-left">
              [CONTROLS]
            </div>
            <div className="game-prediction__score w-2/5 text-center">
              :
            </div>
            <div className="game-prediction__right-team w-3/10 text-right">
              [CONTROLS]
            </div>
          </div>

          <div>
            <GamePredictionToggler showPrediction={showPrediction} />
          </div>
        </div>
      )
    } else {
      return (<GamePredictionToggler showPrediction={showPrediction} />);
    }
  }
}

class Game extends React.Component {
  render() {
    const game = this.props.game;

    return (
        <div className="game">

          <div className="game-meta flex text-xs">
            <div className="w-1/3 text-left">{game.tournamentStage}</div>
            <div className="w-1/3 text-center">{game.id}</div>
            <div className="w-1/3 text-right">{game.kickoffAt}</div>
          </div>

          <div className="actual-game-facts flex text-center">
            <div className="actual-game-facts__left-team w-3/10">
              {game.leftTeam}
            </div>
            <div className="actual-game-facts__score w-2/5">
              {game.leftTeamScore}:{game.rightTeamScore}
            </div>
            <div className="actual-game-facts__right-team w-3/10">
              {game.rightTeam}
            </div>
          </div>

          <GamePrediction showPrediction={this.props.showPrediction} />
        </div>
      );
  }
};

class Games extends React.Component {
  state = {
    showPrediction: true
  };

  render() {
    const games = this.props.games.map((game) => (
      <Game game={game} gamesAreExpanded={this.state.showPrediction} />
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
