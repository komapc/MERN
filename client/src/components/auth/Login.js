import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import GoogleLogin from 'react-google-login';
import FacebookLoginWithButton from 'react-facebook-login';
//const keys = require("../config/keys");
const googleKey = "AIzaSyBxcuGXRxmHIsiI6tDQDVWIgtGkU-CHZ-4";

const FBcomponentClicked = (data) => {
  console.log( "Clicked!" );
}
const FBLoginButton = ({ facebookResponse }) => (
  <FacebookLoginWithButton
    appId="441252456797282"
    // autoLoad
    fields="name,email,picture"
    onClick={FBcomponentClicked}
    callback={facebookResponse}
    icon="fa-facebook" />
)

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
      user:false
    };
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/Meals");
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  };

  responseGoogle = (response) => {
    console.log(response);
  }

 
  render() {
    const { errors } = this.state;
    return (
      <div className="main">
        <div className="row">
          <div className="col s8 offset-s2">
            <Link to="/Meals" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              the list
            </Link>
            <div className="col s12">
              <h4>
                <b>Login</b> below
              </h4>
              <p className="grey-text text-darken-1">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  id="email"
                  type="email"
                  className={classnames("", {
                    invalid: errors.email || errors.emailnotfound
                  })}
                />
                <label htmlFor="email">Email</label>
                <span className="red-text">
                  {errors.email}
                  {errors.emailnotfound}
                </span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                />
                <label htmlFor="password">Password</label>
                <span className="red-text">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </div>
              <div className="col s12">
                <button
                  type="submit"
                  className="button waves-effect waves-light hoverable accent-3"
                >
                  Login
                </button>
              </div>
            </form>
            {(this.props.match.params.extend)?
            <span>
            <GoogleLogin
              clientId={`${googleKey}`}
              buttonText="Login"
              onSuccess={this.props.responseGoogle}
              onFailure={this.props.responseGoogle}
              cookiePolicy={'single_host_origin'}
            />
            <div style={{ margin: "auto", textAlign: "center", paddingTop: "2em" }}>
              {this.state.user ? <div>{this.state.user}</div> :
                <FBLoginButton facebookResponse={this.facebookResponse} />
              }
            </div></span>:<span/>
            }
          
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
