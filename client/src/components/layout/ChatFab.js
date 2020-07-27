import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1)
        }
    },
    wrapper: {
        position: "absolute",
        top: "10vh",
        right: "5vw"
    }
}));

const ChatFab = () => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <div className={classes.root}>
                <div className={classes.wrapper}>
                    <Fab>
                        test
                    </Fab>
                </div>
            </div>
        </React.Fragment>
    );
}

ChatFab.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(ChatFab);