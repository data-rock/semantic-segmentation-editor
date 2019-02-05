import React, { Component } from 'react';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';

import cognitoClient from './CognitoClient';
import sessionKeys from './sessionKeys';


class AuthComp extends Component {
  constructor() {
    super();
    console.log();
    this.state = { loggedIn: Session.get(sessionKeys.userInfo) != null };
    this.updateState = this.updateState.bind(this);
  }

  updateState() {
    this.setState({ loggedIn: Session.get(sessionKeys.userInfo) != null });
  }

  componentWillReceiveProps(props) {
    console.log(props);
  }

  componentDidMount() {
    cognitoClient.tryLogin();
    Tracker.autorun(this.updateState);
  }

  render = () => {
    if (this.state.loggedIn) {
      console.log(this.props);
      const children = React.Children.map(
        this.props.children,
        child =>  React.cloneElement(child, {...this.props})
      );
      return (
          <div>
            { children }
          </div>
      );
    }
    else {
      return <div></div>
    }
  }
}

const authenticate = (Comp) => () =>
  <AuthComp>
    <Comp />
  </AuthComp>

export default authenticate;
