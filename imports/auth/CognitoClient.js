import fetch from 'isomorphic-fetch';
import {Session} from 'meteor/session';
import sessionKeys from './sessionKeys';

const config = {
    clientId: undefined,
    region: undefined,
    subdomain: undefined
};

const baseUrl = () =>
    `https://${config.subdomain}.auth.${config.region}.amazoncognito.com`;

const mapToQuery = (struct) =>
    Object.entries(struct)
        .map(kv => `${kv[0]}=${kv[1]}`)
        .join('&');

const ownUrl = () => window.location.origin;

const tokenRequest = bodyOptions =>
    fetch(`${baseUrl()}/oauth2/token`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: mapToQuery({
            client_id: config.clientId,
            ...bodyOptions
        })
    });

const tokenForCode = code =>
    tokenRequest({
        redirect_uri: ownUrl(),
        grant_type: 'authorization_code',
        code
    });

const tokenForRefreshToken = token =>
    tokenRequest({
        grant_type: 'refresh_token',
        refresh_token: token
    });

const logError = error => console.log('Error:', error);

class CognitoClient {
    constructor ({apiSubDomain, awsRegion, cognitoClientId}) {
        config.subdomain = apiSubDomain;
        config.region = awsRegion;
        config.clientId = cognitoClientId;
        this.receiveTokens = this.receiveTokens.bind(this);
        this.receiveTokensResponse = this.receiveTokensResponse.bind(this);
        this.login = this.login.bind(this);
    }

    loginUrl() {
        const query = mapToQuery({
            response_type: 'code',
            client_id: config.clientId,
            redirect_uri: ownUrl()
        });
        return `${baseUrl()}/login?${query}`;
    }

    logInByCode = code => code ? tokenForCode(code) : Promise.reject();

    refresh = token => token ? tokenForRefreshToken(token) : Promise.reject();

    fetchUserInfo = token =>
        fetch(`${baseUrl()}/oauth2/userInfo`, {
            headers: new Headers({
                Authorization: `Bearer ${token}`
            })
        })

    logoutUrl = () => {
        const query = mapToQuery({
            client_id: config.clientId,
            logout_uri: ownUrl()
        });
        return `${baseUrl()}/logout?${query}`;
    }

    receiveTokensResponse(resp) {
        resp.json().then(this.receiveTokens, logError);
    }

    receiveTokens(tokens) {
        Session.set(sessionKeys.tokens, tokens);
        this.fetchUserInfo(tokens.access_token)
            .then(resp => resp.json(), logError)
            .then(
                value => {
                    this.userInfo = value;
                    Session.set(sessionKeys.userInfo, value);
                },
                logError
            );
    }

    login = code => {
        Session.set(sessionKeys.cognitoCode, code);
        this.logInByCode(code).then(this.receiveTokensResponse, logError);
    }

    codeFromUrl = () => new URL(window.location).searchParams.get('code');

    removeCodeFromUrl = () =>
        window.history.replaceState({}, window.title, window.location.origin);

    tryLogin() {
        if (Session.get(sessionKeys.userInfo)) {return;}

        const code = this.codeFromUrl();
        if (code) {
            this.removeCodeFromUrl();
            this.login(code);
        }
        else {
            window.location = this.loginUrl();
        }
    }

    loggedIn = () => Boolean(Session.get(sessionKeys.userInfo));

    authenticate = component => this.loggedIn() ? component : null;
}

const cognitoClient = new CognitoClient({
    apiSubDomain: 'solvegeo-texture',
    awsRegion: 'ap-southeast-2',
    cognitoClientId: '508hq6t5cqmqccv55t49vi4eit'
});

export default cognitoClient;
