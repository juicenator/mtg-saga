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
import { FormGroup, Switch, FormControlLabel } from '@material-ui/core';

export default function InfoForm() {
    const classes = useStyles();
    const [form, setForm] = useState({ "commander": "", "partner": "", "decklist": "" });
    const [disabled, setDisabled] = useState(false);
    const [errors, setErrors] = useState("");
    const [checked, setChecked] = useState(false);

    return (
        <Grid container spacing={1}>
            <Grid item xs={1}>
                <Icon>
                    <img className={"Step"} src={step1} alt="step-1" />
                </Icon>
            </Grid>
            <Grid item xs={11}>
                <Typography variant="h6"
                >
                    Optional: Who is your Commander?
                </Typography>
                <FormGroup row>
                    <Grid item xs={8} container>
                        <TextField
                            id="commander"
                            name="commander"
                            label="Commander"
                            value={form.commander}
                            onChange={(e) => {
                                setForm({ ...form, "commander": e.target.value })
                            }}
                            InputLabelProps={{ shrink: true }}
                            placeholder={"Alela, Artful Provocateur"}
                            helperText="Will be spawned next to the deck for convenience!"
                            fullWidth
                        />
                    </Grid>
                    <span style={{ flex: 1 }}></span>
                    <FormControlLabel
                        control={<Switch disabled={form.commander === ""} checked={checked} onChange={(e) => {
                            setChecked(e.target.checked);
                        }} name="partner-switch" size="small" />}
                        label="Partner"
                    />
                    {checked ? <TextField
                        id="partner"
                        name="partner"
                        label="Partner"
                        value={form.partner}
                        onChange={(e) => {
                            setForm({ ...form, "partner": e.target.value })
                        }}
                        InputLabelProps={{ shrink: true }}
                        placeholder={"Kydele, Chosen of Kruphix"}
                        fullWidth
                    /> : null}
                </FormGroup>
            </Grid>

            <Grid container spacing={1}>
                <Grid item xs={1}>
                    <Icon>
                        <img className={"Step"} src={step2} alt="step-2" />
                    </Icon>
                </Grid>
                <Typography variant="h6"
                    className={classes.heading}
                >
                    Paste a decklist
                </Typography>
                <Typography variant="caption">
                        You can also directly paste a URL to a deck from: mtggoldfish, deckstats, tappedout and manastack (mainboard only).
                </Typography>
                <Grid item xs={1}>
                </Grid>
                <Grid item xs={12} container justify="center">
                    <TextField
                        id="decklist"
                        name="decklist"
                        label="Decklist"
                        value={form.decklist}
                        onChange={(e) => {
                            setForm({ ...form, "decklist": e.target.value })
                        }}
                        InputLabelProps={{ shrink: true }}
                        placeholder={"https://www.mtggoldfish.com/deck/1234567\n" +
                            "OR\n"+
                            "1 Aether Hub\n" +
                            "1 Anointed Procession\n" +
                            "6 Island\n" +
                            "...."}
                        fullWidth
                        multiline
                        rows={6}
                        variant={"outlined"}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={1}>
                <Grid item xs={1}>
                </Grid>
                <Grid item xs={11}>
                    <br />
                    Save the output file in the Tabletop Simulator folder:
                    <pre className={"Wrap"}>
                        On windows:<br />
                    C:\Users\YOUR_NAME\Documents\My Games\Tabletop Simulator\Saves\Saved Objects\</pre>
                    <pre className={"Wrap"}>
                        On mac:<br />
                    ~/Library/Tabletop Simulator/Saves/Saved Objects/</pre>
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
                        disabled={disabled || (form.commander === "" && form.decklist === "")}
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
                        "Follow the format: <number> <card name>"}
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
    );
}