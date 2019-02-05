import React, {Component} from 'react';
import {Session} from 'meteor/session';
import {Tracker} from 'meteor/tracker';

import cognitoClient from './CognitoClient';
import sessionKeys from './sessionKeys';


class AuthComp extends Component {
    constructor() {
        super();
        this.state = {loggedIn: Boolean(Session.get(sessionKeys.userInfo))};
        this.updateState = this.updateState.bind(this);
    }

    updateState() {
        this.setState({loggedIn: Boolean(Session.get(sessionKeys.userInfo))});
    }

    componentDidMount() {
        cognitoClient.tryLogin();
        Tracker.autorun(this.updateState);
    }

    render() {
        if (this.state.loggedIn) {
            const children = React.Children.map(
                this.props.children,
                (child) => React.cloneElement(child, {...this.props})
            );
            return <div>{ children }</div>;
        }
        return <div></div>;
    }
}

const authenticate = (Comp) => () => <AuthComp><Comp /></AuthComp>;
export default authenticate;
