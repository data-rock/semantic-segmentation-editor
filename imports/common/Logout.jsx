import React from 'react';
import {Session} from 'meteor/session';
import styled from 'styled-components';

import sessionKeys from '../auth/sessionKeys';
import cognitoClient from '../auth/CognitoClient';


const DivRight = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
`;

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid grey;
  margin: 0em 1em;
  color: white;
`;

const LogoutButton = ({email}) =>
    <DivRight>
        {email ? `Logged in as ${email}` : ''}
        <Button onClick={() => cognitoClient.logout()}>Log out</Button>
    </DivRight>;

const withLogoutButton = WrappedComponent => (props) =>
    <div>
        <LogoutButton email={Session.get(sessionKeys.userInfo).email}/>
        <WrappedComponent {...props}/>
    </div>;
export default withLogoutButton;
