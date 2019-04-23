import React, {Component} from 'react';
import {Session} from 'meteor/session';
import {Tracker} from 'meteor/tracker';

import cognitoClient from './CognitoClient';
import sessionKeys from './sessionKeys';


const authenticate = WrappedComponent =>
    class AuthComp extends Component {
        constructor(props) {
            super(props);
            this.state = {loggedIn: Boolean(Session.get(sessionKeys.userInfo))};
            this.updateState = this.updateState.bind(this);
        }

        updateState() {
            this.setState({loggedIn:
                Boolean(Session.get(sessionKeys.userInfo))});
        }

        componentDidMount() {
            // cognitoClient.tryLogin();
            // Tracker.autorun(this.updateState);
        }

        render() {
            return <WrappedComponent {...this.props} />;
            // if (this.state.loggedIn)
            //     return <WrappedComponent {...this.props} />;
            // return <div></div>;
        }
    };

export default authenticate;
