import React, {Component} from 'react';
import {Session} from 'meteor/session';
import {Tracker} from 'meteor/tracker';
import sessionKeys from '../auth/sessionKeys';
import cognitoClient from '../auth/CognitoClient';

import styled from 'styled-components'

const DivRight = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`;

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid palevioletred;
  margin: 0em 1em;
  color: red;
`;

const LogoutButton = ({email}) =>
    <DivRight>
        {email ? `Logged in as ${email}` : ''}
        <Button onClick={() => cognitoClient.logout()}>Log out</Button>
    </DivRight>;

const withLogoutButton = WrappedComponent =>
    class LogoutButtonWrapper extends Component {
        constructor(props) {
            super(props);
            this.state = {email: ''};
            this.updateState = this.updateState.bind(this);
        }

        updateState() {
            const userInfo = Session.get(sessionKeys.userInfo) || {email: ''};
            this.setState({email: userInfo.email});
        }

        componentDidMount() {
            Tracker.autorun(this.updateState);
        }

        render() {
            return (
                <div>
                    <LogoutButton email={this.state.email}/>
                    <WrappedComponent {...this.props}/>
                </div>
            );
        }
    };

export default withLogoutButton;
