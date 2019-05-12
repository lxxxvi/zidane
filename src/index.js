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

const GET_TOURNAMENT_GAMES = gql`
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
        `

class GamePredictionToggler extends React.Component {
  render() {
    if (this.props.showPredictionControls) {
      return (
        <div
          className="text-center"
          onClick={this.props.onTogglePredictionClick}
        >
          Close
        </div>
       );
    } else {
      return (
        <div
          className="text-center"
          onClick={this.props.onTogglePredictionClick}
        >
          Predict
        </div>);
    }
  }
}

class GamePredictionControls extends React.Component {
  render() {
    if (this.props.showPredictionControls) {
      return (
        <div className="game-prediction-controls flex">
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
      );
    }

    return (<div></div>);
  }
}

class GamePrediction extends React.Component {
  render() {
    const showPredictionControls = this.props.showPredictionControls;
      return (
        <div>
          <GamePredictionControls
            showPredictionControls={showPredictionControls}
          />
          <GamePredictionToggler
            showPredictionControls={showPredictionControls}
            onTogglePredictionClick={this.props.onTogglePredictionClick}
          />
        </div>
      )
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

          <GamePrediction
            showPredictionControls={this.props.showPredictionControls}
            onTogglePredictionClick={this.props.onTogglePredictionClick}
            onShowPredictionClick={this.props.onShowPredictionClick}
          />
        </div>
      );
  }
};

class Games extends React.Component {
  state = {
    showPredictionControls: true
  }

  handleTogglePredictionClick = () => {
    this.setState({ showPredictionControls: !this.state.showPredictionControls });
  }

  render() {
    const games = this.props.games.map((game) => (
      <Game
        game={game}
        showPredictionControls={this.state.showPredictionControls}
        onTogglePredictionClick={this.handleTogglePredictionClick}
      />
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
      <Query query={GET_TOURNAMENT_GAMES}>
        {({ loading, error, data }) => {
          if (loading) return (<p>Loading...</p>);
          if (error) return (<p>Error</p>);

          return (<Games games={data.games} />);
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
