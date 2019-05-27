import React from 'react';
import moment from 'moment';

class Kickoff extends React.Component {
  render() {
    return (
      <time
        dateTime={this.props.time}
      >
        {this.timeUntilKickoff()}
      </time>
    );
  }

  timeUntilKickoff() {
    const kickoff = moment(this.props.time);
    const now = moment();

    return moment.duration(kickoff.diff(now)).humanize(true);
  }
}

export default Kickoff;
