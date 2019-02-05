import React, { Component } from 'react';
import { Redirect } from 'react-router';
import authenticate from '../auth/Authentication';


const Home = () => <Redirect to="/browse/0/20/"/>;

export default authenticate(Home);