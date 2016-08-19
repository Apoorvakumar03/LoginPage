import React, { PropTypes, Component } from 'react';

class GoogleLogin extends Component {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    clientId: PropTypes.string.isRequired,
    loginText: PropTypes.string,
    logoutText: PropTypes.string,
    offline: PropTypes.bool,
    scope: PropTypes.string,
    cssClass: PropTypes.string,
    redirectUri: PropTypes.string,
    cookiePolicy: PropTypes.string,
    loginHint: PropTypes.string,
    children: React.PropTypes.node,
  };

  static defaultProps = {
    loginText: 'Login with Google',
    logoutText: 'Logout with Google',
    scope: 'profile email',
    redirectUri: 'postmessage',
    cookiePolicy: 'single_host_origin',
  };

  constructor(props) {
    super(props);
    this.onLoginClick = this.onLoginClick.bind(this);
    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.state = {
      auth2: {},
      signedIn: false,
    };
  }

  componentDidMount() {
    const { clientId, scope, cookiePolicy, loginHint } = this.props;
    ((d, s, id, cb) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      js = d.createElement(s);
      js.id = id;
      js.src = '//apis.google.com/js/platform.js';
      fjs.parentNode.insertBefore(js, fjs);
      js.onload = cb;
    })(document, 'script', 'google-login', () => {
      const params = {
        client_id: clientId,
        cookiepolicy: cookiePolicy,
        login_hint: loginHint,
        scope,
      };
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init(params)
          .then(() => {
            const auth = window.gapi.auth2.getAuthInstance();
            const user = auth.currentUser.get();
            const loggedin = auth.isSignedIn.get();

            if (loggedin && !user.hasGrantedScopes(scope)) {
              auth.currentUser.get().grant({ scope });
            }

            auth.isSignedIn.listen((event) => this.setState({ signedIn: event }));

            this.setState({
              auth2: auth,
              signedIn: loggedin,
            });
          });
      });
    });
  }

  onLoginClick() {
    const { auth2 } = this.state;
    const { offline, redirectUri, callback } = this.props;

    if (offline) {
      const options = {
        redirect_uri: redirectUri,
      };
      auth2.grantOfflineAccess(options)
        .then((data) => {
          callback(data);
        });
    } else {
      auth2.signIn()
        .then((response) => {
          callback(response);
        });
    }
  }

  onLogoutClick() {
    const { auth2 } = this.state;
    auth2.signOut().then(() => {
      this.setState({ signedIn: false });
    });
  }

  render() {
    const style = {
      display: 'inline-block',
      background: '#d14836',
      color: '#fff',
      width: 190,
      paddingTop: 10,
      paddingBottom: 10,
      borderRadius: 2,
      border: '1px solid transparent',
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Roboto',
    };
    const { cssClass, loginText, logoutText, children } = this.props;
    const { signedIn } = this.state;
    return (
      !signedIn
        ? <button
          className={cssClass}
          onClick={this.onLoginClick}
          style={cssClass ? {} : style}
        >
          { children ? [children, loginText] : loginText }
        </button>
        : <button
          className={cssClass}
          onClick={this.onLogoutClick}
          style={cssClass ? {} : style}
        >
          { children ? [children, logoutText] : logoutText }
        </button>
    );
  }
}

export default GoogleLogin;
