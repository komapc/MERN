import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import Avatar from "../layout/Avatar"
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import tmpBgImg from "../../resources/images/susi.jpeg";
import { makeStyles } from '@material-ui/core/styles';

//#region MyProfileHeader
const useStylesHeader = makeStyles(theme => ({
  alignItemsAndJustifyContent: {
    width: "100%",
    height: theme.spacing(25),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    backgroundImage: `url(${tmpBgImg})`,
    backgroundSize: 'cover'
  },
  empty: {
    height: 64
  }
}))
const MyProfileHeader = () => {
  const classes = useStylesHeader()
  return (
    <React.Fragment>
      <div className={classes.alignItemsAndJustifyContent}>
        <Avatar />
      </div>
      <div className={classes.empty}></div>
    </React.Fragment>
  )
}
//#endregion

//#region MyProfileStats
const useStylesStats = makeStyles(theme => ({
  headerContainer: {
    width: "100%",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    color: "#13A049",
    fontSize: 32,
    fontWeight: "fontWeightBold",
    fontStyle: "italic",
    //fontFamily: "Monospace"
  },
  stat: {
    color: "#13A049",
    fontSize: 16,
    fontWeight: "fontWeightBold",
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  }
}))
const MyProfileStats = ({ name: Name }) => {
  const classes = useStylesStats()
  return (
    <React.Fragment>
      <div className={classes.headerContainer}>
        <h5 className={classes.header}>{Name}</h5>
      </div>
      <div className={classes.headerContainer}>
        <Grid container >
          <Grid item xs={6}><span className={classes.stat}>Followers 0</span></Grid>
          <Grid item xs={6}><span className={classes.stat}>Active meals 0</span></Grid>
          <Grid item xs={6}><span className={classes.stat}>Following 0</span></Grid>
          <Grid item xs={6}><span className={classes.stat}>Meals Created 0</span></Grid>
        </Grid>
      </div>
    </React.Fragment>
  )
}
//#endregion

//#region MyProfileTabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const useStylesTabs = makeStyles(theme => ({
  root: {
    flexGrow: 1, // ?

    color: "#13A049",
    fontSize: 16,
    fontWeight: "fontWeightBold",
    width: "100%",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));
const MyProfileTabs = () => {
  const classes = useStylesTabs();
  const [value, setValue] = React.useState(0); const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <React.Fragment>
      <div className={classes.root}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="simple tabs example" 
          centered 
          indicatorColor='primary'
          TabIndicatorProps={{
            style: {
              backgroundColor: "primary"
          }}}>
          <Tab label="Kitchen" {...a11yProps(0)} />
          <Tab label="Gallery" {...a11yProps(1)} />
        </Tabs>
      </div>
      <TabPanel value={value} index={0} >
         <Button variant="contained" color="primary" href="/logout">Log Out</Button>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Under Construction
      </TabPanel>
    </React.Fragment>
  )
}
//#endregion

class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.auth.user.name,
      email: this.props.auth.user.email,
      address: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
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

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      address: this.state.address,
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <React.Fragment>
        <MyProfileHeader />
        <MyProfileStats name={this.state.name} />
        <MyProfileTabs />

        {false ? (
          <div className="row main">
            <div className="col s8 offset-s2">
              <form noValidate onSubmit={this.onSubmit} display="none" disabled={true}>
                <div className="input-field col s12">
                  <input
                    onChange={this.onChange}
                    value={this.state.name}
                    error={errors.name}
                    id="name"
                    type="text"
                    className={classnames("", {
                      invalid: errors.name
                    })}
                  />
                  <label htmlFor="name">Name</label>
                  <span className="red-text">{errors.name}</span>
                </div>
                <div className="input-field col s12">
                  <input
                    onChange={this.onChange}
                    value={this.state.email}
                    error={errors.email}
                    id="email"
                    type="email"
                    className={classnames("", {
                      invalid: errors.email
                    })}
                  />
                  <label htmlFor="email">Email</label>
                  <span className="red-text">{errors.email}</span>
                </div>

                <div className="input-field col s12">
                  <input
                    onChange={this.onChange}
                    value={this.state.address}
                    error={errors.address}
                    id="address"
                    type="address"
                    className={classnames("", {
                      invalid: errors.address
                    })}
                  />
                  <label htmlFor="address">Address</label>
                  <span className="red-text">{errors.address}</span>
                </div>
                <div>
                  More params to come: cousine, images, visit history and more.
              </div>
                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                  <button
                    type="submit"
                    className="button waves-effect waves-light hoverable accent-3" >
                    Save
                </button>
                </div>
              </form>
            </div>
          </div>) : ""}
      </React.Fragment>
    );
  }
}

MyProfile.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(MyProfile));
