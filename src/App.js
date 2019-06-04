import React from 'react';
import gql from "graphql-tag";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { graphql, Mutation } from "react-apollo";
import gameScoreService from './services/gameScoreService'
import animateCSS from './services/animateCSS'

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

const UPDATE_PREDICTION = gql`
  mutation UpdatePrediction(
    $gameId: ID!,
    $leftTeamScore: Int!,
    $rightTeamScore: Int!
  ) {
    updatePrediction(
      gameId: $gameId,
      leftTeamScore: $leftTeamScore,
      rightTeamScore: $rightTeamScore
    ) {
      prediction {
        game {
          id
        }
        leftTeamScore
        rightTeamScore
        previousScoreChanges {
          score
          from
          to
        }
      }
      errors
    }
  }
`

class GamePredictionToggler extends React.Component {
  render() {
    if (this.props.showGamePrediction) {
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

class GamePredictionScore extends React.Component {
  render() {
    let animationClasses;

    if(this.props.animate) {
      animationClasses = "animate heartBeat";
    }

    return(
      <output
        className={`inline-block ${animationClasses}`}
      >
        {this.props.score}
      </output>
    );
  }
}

class GamePredictionControls extends React.Component {
  state = {
    gameId: this.props.userPrediction.game.id,
    leftTeamScore: this.props.userPrediction.leftTeamScore,
    rightTeamScore: this.props.userPrediction.rightTeamScore,
    animateLeftTeamScore: false,
    animateRightTeamScore: false,
  }

  updateScores = (newLeftTeamScore, newRightTeamScore) => {
    this.setState(
      {
        leftTeamScore: newLeftTeamScore,
        rightTeamScore: newRightTeamScore
      },
      this.savePrediction
    );
  }

  savePrediction = async () => {
    const response = await this.props.updatePrediction(
      {
        variables: {
          gameId: this.state.gameId,
          leftTeamScore: this.state.leftTeamScore,
          rightTeamScore: this.state.rightTeamScore
        }
      }
    );

    const updatedPrediction = response.data
                                      .updatePrediction
                                      .prediction;
    updatedPrediction.previousScoreChanges
                     .map((changedScore) => {
      this.setState(
      {
        [changedScore.score]: changedScore.to
      }
      );
      return null;
    });

    // console.log(changedScores);

    // for (item in changedScores) {
    //   this.setState(
    //   {
    //     [item.score]: item.to
    //   }
    //   );
    // }
    // changedScores.map((item) {
    //   this.setState(
    //   {
    //     [item.score]: item.to
    //   }
    //   );
    // });

    // if (changedScores.includes('left_team_score')) {
    //   this.setState({
    //     animateLeftTeamScore: true
    //   });
    // }

    // if (changedScores.includes('right_team_score')) {
    //   animateCSS('#rightTeamScore', 'heartBeat');
    // }
  }

  handlePredictionChange = (side, modifier) => {
    const newScores = gameScoreService.calculate(
      this.state.leftTeamScore,
      this.state.rightTeamScore,
      side,
      modifier
    );

    this.updateScores(newScores.leftTeamScore, newScores.rightTeamScore);
  }

  updatePrediction = () => {
    this.props.handleUpdatePrediction(
      this.state.gameId,
      this.state.leftTeamScore,
      this.state.rightTeamScore
    );
  }

  render() {
    return (
      <div className="game-prediction-controls flex">
        <div className="game-prediction__left-team w-3/10 text-left">
          <button
            onClick={() => this.handlePredictionChange('left', 'increment')}
          >+</button>
          <button
            onClick={() => this.handlePredictionChange('left', 'decrement')}
          >-</button>
        </div>
        <div className="game-prediction__score w-2/5 text-center text-4xl">
          <GamePredictionScore
            score={this.state.leftTeamScore}
            animate={this.state.animateLeftTeamScore}
          />:
          <output className="inline-block" id="rightTeamScore">
            {this.state.rightTeamScore}
          </output>
        </div>
        <div className="game-prediction__right-team w-3/10 text-right">
          <button
            onClick={() => this.handlePredictionChange('right', 'increment')}
          >+</button>
          <button
            onClick={() => this.handlePredictionChange('right', 'decrement')}
          >-</button>
        </div>
      </div>
    );

  }
}

class GamePrediction extends React.Component {
  render() {
    return (
      <div>
        <Mutation mutation={UPDATE_PREDICTION}>
          {
            (updatePrediction, { data }) => (
                <GamePredictionControls
                  userPrediction={this.props.userPrediction}
                  handleUpdatePrediction={this.props.handleUpdatePrediction}
                  updatePrediction={updatePrediction}
                />
            )
          }
        </Mutation>
      </div>
    )
  }
}

class Game extends React.Component {
  render() {
    const game = this.props.game;
    let gamePrediction;

    if (this.props.showGamePrediction) {
      gamePrediction = <GamePrediction
            onTogglePredictionClick={this.props.onTogglePredictionClick}
            userPrediction={game.userPrediction}
            handleUpdatePrediction={this.props.handleUpdatePrediction}
          />
    }

    return (
        <div className="game">
          <div className="game-meta flex text-xs">
            <div className="w-1/3 text-left">{game.tournamentStage}</div>
            <div className="w-1/3 text-center">{game.id}</div>
            <div className="w-1/3 text-right">
              <Kickoff time={game.kickoffAt} />
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

          {gamePrediction}

           <GamePredictionToggler
            showGamePrediction={this.props.showGamePrediction}
            onTogglePredictionClick={this.props.onTogglePredictionClick}
          />
        </div>
      );
  }
};

class Games extends React.Component {
  state = {
    showGamePrediction: false,
    games: this.props.games
  }

  handleTogglePredictionClick = () => {
    this.setState({ showGamePrediction: !this.state.showGamePrediction });
  }

  handleUpdatePrediction = (gameId, leftTeamScore, rightTeamScore) => {
    console.log('TODO', gameId, leftTeamScore, rightTeamScore);
  }

  render() {
    const games = this.state.games.map((game) => (
      <Game
        game={game}
        showGamePrediction={this.state.showGamePrediction}
        onTogglePredictionClick={this.handleTogglePredictionClick}
        handleUpdatePrediction={this.handleUpdatePrediction}
        key={game.id}
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
