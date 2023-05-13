import React from 'react';
import { CssBaseline, AppBar, Toolbar, Button, Link, Typography } from '@mui/material';
import DeckInfo from './DeckInfo';
import useStyles from './Styles';
import { Router, RouteComponentProps } from "@reach/router";
import './App.css';


const RouterPage = (
  props: { pageComponent: JSX.Element } & RouteComponentProps
) => props.pageComponent;

function Copyright() {
  return (
    <Typography variant="caption" color="textSecondary" align="center">
      {'Copyright © Anton Steenvoorden - '}
      {new Date().getFullYear()}
      {'. Made possible by '}
      <Link color="inherit" href="https://scryfall.com/">
        scryfall.com
      </Link>
    </Typography>
  );
}


function App() {
  const { classes } = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />

      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar>
          <img src="./mtgsaga.png" className="App-logo" alt="MTG Saga Logo" />
          <Link href="/" style={{ textDecoration: 'none' }} color="inherit">
            <Typography variant="h6" color="inherit" noWrap align={"center"}>
              MTG Saga - a Tabletop Simulator Deck Generator
            </Typography>
          </Link>
          <span style={{ flex: 1 }}></span>

          <form id="donate" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----" />
            <Button
              type="submit"
              name="submit"
              variant="contained"
              color="secondary"
              aria-label="donate to MTG Saga"
            >
              Donate
            </Button>
          </form>
        </Toolbar>
      </AppBar>
      <main className={classes.layout}>
        <Router>
          <RouterPage path="/" pageComponent={<DeckInfo />} />
        </Router>
        <Copyright />
      </main>
    </React.Fragment>
  );
}

export default App;
