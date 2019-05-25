import React from 'react';
import { gql } from "apollo-boost";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { graphql } from "react-apollo";

import Kickoff from './Kickoff';

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
              userPrediction {
                game {
                  id
                }
                leftTeamScore
                rightTeamScore
              }
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
  state = {
    gameId: this.props.userPrediction.game.id,
    predictedLeftTeamScore: this.props.userPrediction.leftTeamScore,
    predictedRightTeamScore: this.props.userPrediction.rightTeamScore
  }

  increment = (value) => {
    return 1 + Number.parseInt(value);
  }

  decrement = (value) => {
    return -1 + Number.parseInt(value);
  }

  minimumZero = (value) => {
    if (value > 0) {
      return value;
    };

    return 0;
  }

  decrementMinimumZero = (value) => {
    return this.minimumZero(this.decrement(value));
  }

  updateScores = (newLeftTeamScore, newRightTeamScore) => {
    this.setState(
      {
        predictedLeftTeamScore: newLeftTeamScore,
        predictedRightTeamScore: newRightTeamScore
      },
      this.updatePrediction
    );
  }

  incrementScore = (value) => {
    return this.increment(value);
  }

  decrementScore = (value) => {
    return this.decrementMinimumZero(value);
  }

  getScore = (score) => {
    return score || 0;
  }

  modifyScore = (score, modifier = null) => {
    if (modifier === 'increment') {
      return this.incrementScore(score);
    } else if (modifier === 'decrement') {
      return this.decrementScore(score);
    }
  }

  handlePredictionChange = (side, modifier) => {
    const currentLeftTeamScore = this.getScore(this.state.predictedLeftTeamScore);
    const currentRightTeamScore = this.getScore(this.state.predictedRightTeamScore);

    if (side === 'left') {
      this.updateScores(
        this.modifyScore(currentLeftTeamScore, modifier),
        currentRightTeamScore
      );
    } else if (side === 'right') {
      this.updateScores(
        currentLeftTeamScore,
        this.modifyScore(currentRightTeamScore, modifier)
      );
    }
  }

  handleIncrementLeftTeamScore = () => {
    this.handlePredictionChange('left', 'increment');
  }

  handleDecrementLeftTeamScore = () => {
    this.handlePredictionChange('left', 'decrement');
  }

  handleIncrementRightTeamScore = () => {
    this.handlePredictionChange('right', 'increment');
  }

  handleDecrementRightTeamScore = () => {
    this.handlePredictionChange('right', 'decrement');
  }

  updatePrediction = () => {
    this.props.handleUpdatePrediction(
      this.state.gameId,
      this.state.predictedLeftTeamScore,
      this.state.predictedRightTeamScore
    );
  }

  render() {
    if (this.props.showPredictionControls) {
      return (
        <div className="game-prediction-controls flex">
          <div className="game-prediction__left-team w-3/10 text-left">
            <button
              onClick={this.handleIncrementLeftTeamScore}
            >+</button>
            <button
              onClick={this.handleDecrementLeftTeamScore}
            >-</button>
          </div>
          <div className="game-prediction__score w-2/5 text-center">
            <output>
              {this.state.predictedLeftTeamScore}
            </output>:
            <output>
              {this.state.predictedRightTeamScore}
            </output>
          </div>
          <div className="game-prediction__right-team w-3/10 text-right">
            <button
              onClick={this.handleIncrementRightTeamScore}
            >+</button>
            <button
              onClick={this.handleDecrementRightTeamScore}
            >-</button>
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
            userPrediction={this.props.userPrediction}
            handleUpdatePrediction={this.props.handleUpdatePrediction}
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
            <div className="w-1/3 text-right">
              <Kickoff kickoffAt={game.kickoffAt} />
            </div>
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
            userPrediction={game.userPrediction}
            handleUpdatePrediction={this.props.handleUpdatePrediction}
          />
        </div>
      );
  }
};

class Games extends React.Component {
  state = {
    showPredictionControls: true,
    games: this.props.games
  }

  handleTogglePredictionClick = () => {
    this.setState({ showPredictionControls: !this.state.showPredictionControls });
  }

  handleUpdatePrediction = (gameId, leftTeamScore, rightTeamScore) => {
    console.log('TODO', gameId, leftTeamScore, rightTeamScore);
  }

  render() {
    const games = this.state.games.map((game) => (
      <Game
        game={game}
        showPredictionControls={this.state.showPredictionControls}
        onTogglePredictionClick={this.handleTogglePredictionClick}
        handleUpdatePrediction={this.handleUpdatePrediction}
      />
    ));

    return(
      <div id="games">
        {games}
      </div>
    );
  }
}

const GamesList = ({data: {loading, error, games}}) => {
  if (loading) {
    return(<p>Loading</p>);
  }
  if (error) {
    return (<p>Error</p>);
  }

  return(<Games games={games} />)
}

const Tournament = graphql(GET_TOURNAMENT_GAMES)(GamesList);


export default App;


// render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
