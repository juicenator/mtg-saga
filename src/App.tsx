import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import DeckInfo from './DeckInfo';
import useStyles from './Styles';
import './App.css';

function Copyright() {
  return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © Anton Steenvoorden - '}
        {new Date().getFullYear()}
        {'. Made possible by '}
        <Link color="inherit" href="https://scryfall.com/">
          Scryfall.com
        </Link>{' '}
      </Typography>
  );
}


function App() {
  const classes = useStyles();

  return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="absolute" color="default" className={classes.appBar}>
          <Toolbar>
            <img src="mtgsaga.png" className="App-logo" alt="MTG Saga Logo" />
            <Typography variant="h6" color="inherit" noWrap>
              MTG Saga - a Tabletop Simulator Deck Generator
            </Typography>
            <span style={{ flex: 1 }}></span>
            <Button
                    variant="contained"
                    color="secondary"
                    // onClick={download}
                    // className={classes.button}
                    aria-label="donate to MTG Saga"
            >
              Donate
            </Button>
          </Toolbar>
        </AppBar>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              Deck Information
            </Typography>
            <DeckInfo /> {/* Form */}
          </Paper>
          <Copyright />
        </main>
      </React.Fragment>
  );
}

export default App;
