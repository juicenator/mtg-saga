import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Icon from '@material-ui/core/Icon';
import download from './DeckBuilder';
import useStyles from './Styles';

import step1 from './images/step-1.svg' // relative path to image
import step2 from './images/step-2.svg' // relative path to image
import step3 from './images/step-3.svg' // relative path to image
import { Paper, FormControl } from '@material-ui/core';

import preconDecks from './precon/decks.json'
import { Select, MenuItem, FormGroup } from '@material-ui/core';

const SELECT_A_DECK = "Select a deck";

class PreconDeck {
    key!: string;
    set!: string;
    name!: string;
    commanders!: string[];
    decklist!: string[];
}

function selectPreconDeck(decks: PreconDeck[], id: any): PreconDeck {
    let selectedDeck: PreconDeck = new PreconDeck();
    decks.forEach(deck => {
        if (deck.key === id) {
            selectedDeck = deck;
        }
    });
    return selectedDeck;
}

export default function PreconForm() {
    const classes = useStyles();
    const [selectedDeckState, setSelectedDeck] = useState({deck: new PreconDeck()});
    const [form, setForm] = useState({ "commander": "", "partner": "", "decklist": "", "sideboard": "", "cardback": "" });
    const [disabled, setDisabled] = useState(false);
    const [errors, setErrors] = useState("");

    let decks: PreconDeck[] = [];
    preconDecks.decks.forEach(deck => {
        let tmpDeck = Object.assign(new PreconDeck(), deck)
        tmpDeck.key = tmpDeck.set.toLowerCase() + ":" + tmpDeck.name.toLowerCase();
        decks.push(tmpDeck);
    });
    
    return (
        <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
                Download Preconstructed Decks
            </Typography>

            <Grid container spacing={1}>
                <Grid item xs={1}>
                    <Icon>
                        <img className={"Step"} src={step1} alt="step-1" />
                    </Icon>
                </Grid>
                <Grid item xs={11}>
                    <Typography variant="h6">
                        Select the preconstructed deck
                    </Typography>
                    <FormControl>
                        <Select
                            id="set-select"
                            value={selectedDeckState.deck.key}
                            defaultValue={SELECT_A_DECK}
                            fullWidth
                            onChange={e => {
                                // Select the deck from the JSON
                                let selectedKey = Object.assign(new PreconDeck(), e.target.value);
                                selectedKey.key = selectedKey.set.toLowerCase() + ":" + selectedKey.name.toLowerCase();
                                let selectedDeck = selectPreconDeck(decks, selectedKey.key);
                                setSelectedDeck({deck: selectedDeck});
                                let partner: string = "";
                                let commander = selectedDeck.commanders[0];
                                if (selectedDeck.commanders.length > 1) {
                                    partner = selectedDeck.commanders[1];
                                }
                                // Set the deck form
                                setForm({ ...form, commander: commander, partner: partner, decklist: selectedDeck.decklist.join("\n") })
                            }}
                        >
                            {preconDecks.decks.map((deck: any) => <MenuItem key={deck.key} value={deck}>{deck.set + ": " + deck.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={1}>
                    <Icon>
                        <img className={"Step"} src={step2} alt="step-2" />
                    </Icon>
                </Grid>
                <Grid item xs={11}>
                    <Typography variant="h6">
                        Preview deck
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormGroup row>
                        <Grid item xs={12} container>
                            <TextField
                                id="commander"
                                name="commander"
                                label="Commander"
                                value={form.commander}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        </Grid>
                        <span style={{ flex: 1 }}></span>

                        {form.partner !== "" ? <TextField
                            id="partner"
                            name="partner"
                            label="Partner"
                            value={form.partner}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        /> : null}
                    </FormGroup>
                </Grid>

                <Grid item container>
                    <Grid container item xs={12}>
                        <TextField
                            id="decklist"
                            name="decklist"
                            label="Decklist"
                            value={form.decklist}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            multiline
                            rows={12}
                            variant={"outlined"}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid item xs={1}>
                        <Icon>
                            <img className={"Step"} src={step3} alt="step-3" />
                        </Icon>
                    </Grid>
                    <Grid item xs={11}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={async function () {
                                setDisabled(true);
                                let e = await download(form);
                                if (e !== "") {
                                    setErrors(e);
                                }
                                setDisabled(false);
                            }}
                            aria-label="download tabletop JSON"
                            disabled={disabled}
                        >
                            Download Tabletop Simulator file
                    </Button>
                        <Grid item xs={12}>
                            <Typography
                                variant={"caption"}>
                                Downloading may take a couple of seconds.
                    </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                {/*Error display*/}
                <Grid item xs={12} container justify="center" style={{ paddingTop: "1vmin" }}>
                    {(errors === "") ? null : <TextField
                        id="errors"
                        name="errors"
                        label="Failed to get the following card(s)"
                        helperText={"Edit these in the textbox above and try again. " +
                            "Follow the format: <number> <card name> or <number> <card name> (<set>) <collectorNumber>"}
                        value={errors}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        multiline
                        rows={6}
                        variant={"outlined"}
                        error
                        disabled
                    />}
                </Grid>
            </Grid>
        </Paper>
    );
}