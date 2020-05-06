import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Icon from '@material-ui/core/Icon';
import AppleIcon from '@material-ui/icons/Apple';
import LaptopWindowsIcon from '@material-ui/icons/LaptopWindows';

import download from './DeckBuilder';
import useStyles from './Styles';

import step1 from './images/step-1.svg' // relative path to image
import step2 from './images/step-2.svg' // relative path to image
import step3 from './images/step-3.svg' // relative path to image
import { FormGroup, Switch, FormControlLabel, Tooltip, SvgIcon, Paper } from '@material-ui/core';

export default function InfoForm() {
    const classes = useStyles();
    const [form, setForm] = useState({ "commander": "", "partner": "", "decklist": "", "sideboard": "" });
    const [disabled, setDisabled] = useState(false);
    const [sideboardEnabled, setSideboardEnabled] = useState(false);
    const [errors, setErrors] = useState("");
    const [checked, setChecked] = useState(false);

    return (
        <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
                Deck Information
            </Typography>
            <Grid item container direction="row" spacing={1}>
                <Grid item xs={1}>
                    <Icon>
                        <img className={"Step"} src={step1} alt="step-1" />
                    </Icon>
                </Grid>
                <Grid item xs={11}>
                    <Typography variant="h6">
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
                                setForm({ ...form, "partner": "" });
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

                <Grid item container direction="row" spacing={1}>
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
                        You can also directly paste a URL to a deck from:
                        &nbsp;
                        <Tooltip title="Format: https://mtggoldfish.com/deck/1234567" arrow>
                            <Typography variant="caption">
                                <u>mtggoldfish</u>,
                        </Typography>
                        </Tooltip>
                    &nbsp;
                    <Tooltip title="Format: https://deckstats.net/decks/12345/1234567-my-awesome-deck/en" arrow>
                            <Typography variant="caption">
                                <u>deckstats</u>,
                        </Typography>
                        </Tooltip>
                    &nbsp;
                    <Tooltip title="Format: http://tappedout.net/mtg-decks/my-awesome-deck/" arrow>
                            <Typography variant="caption">
                                <u>tappedout</u>,
                        </Typography>
                        </Tooltip>
                    &nbsp;
                        <Tooltip title="Format: https://manastack.com/builder/123456 (downloads mainboard only)." arrow>
                            <Typography variant="caption">
                                <u>manastack</u>.
                        </Typography>
                        </Tooltip>
                    </Typography>
                    <Grid item container>
                        <Grid container item xs={12}>
                            <TextField
                                id="decklist"
                                name="decklist"
                                label="Decklist"
                                value={form.decklist}
                                onChange={(e) => {
                                    setForm({ ...form, "decklist": e.target.value });
                                }}
                                InputLabelProps={{ shrink: true }}
                                placeholder={"https://mtggoldfish.com/deck/1234567 (hover sites^ to see URL format)\n" +
                                    "OR\n" +
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
                        <Grid container item xs={12}>
                            <span style={{ flex: 1 }}></span>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Switch disabled={form.decklist === "" || form.decklist.includes("http")}
                                            checked={sideboardEnabled && form.decklist !== ""}
                                            onChange={(e) => {
                                                setSideboardEnabled(e.target.checked);
                                                setForm({ ...form, "sideboard": "" });
                                            }}
                                            name="sideboard-switch"
                                            size="small" />
                                    }
                                    label="Sideboard"
                                />
                            </FormGroup>
                        </Grid>
                        {/* Sideboard */}
                        {sideboardEnabled && form.decklist !== "" ? <Grid container item xs={12}>
                            <TextField
                                id="sideboard"
                                name="sideboard"
                                label="Sideboard"
                                value={form.sideboard}
                                onChange={(e) => {
                                    setForm({ ...form, "sideboard": e.target.value })
                                }}
                                InputLabelProps={{ shrink: true }}
                                placeholder={
                                    "1 Stolen by the Fae\n" +
                                    "1 Prismite\n" +
                                    "6 Plains\n" +
                                    "...."}
                                fullWidth
                                multiline
                                rows={4}
                                variant={"outlined"}
                            />
                        </Grid> : null}
                    </Grid>
                </Grid>
                {/* Step 2.5 */}
                <Grid item container direction="row" spacing={1}>
                    <Grid item xs={1}>
                    </Grid>
                    <Grid item xs={11}>
                        <Typography variant="caption">
                            Save the output file in the Tabletop Simulator folder:
                    </Typography>
                    </Grid>
                </Grid>
                <Grid item container direction="row" spacing={1}>
                    <Grid item xs={1}>
                        <Typography variant="caption">
                            <SvgIcon>
                                <LaptopWindowsIcon aria-label="windows"></LaptopWindowsIcon>
                            </SvgIcon>
                        </Typography>
                    </Grid>
                    <Grid item xs={11}>
                        <Typography variant="caption" className={"Wrap"}>
                            C:\Users\YOUR_NAME\Documents\My Games\Tabletop Simulator\Saves\Saved Objects\
                    </Typography>
                    </Grid>
                </Grid>
                <Grid item container direction="row" spacing={1}>
                    <Grid item xs={1}>
                        <SvgIcon>
                            <AppleIcon aria-label="mac"></AppleIcon>
                        </SvgIcon>
                    </Grid>
                    <Grid item xs={11}>
                        <Typography variant="caption" className={"Wrap"}>
                            ~/Library/Tabletop Simulator/Saves/Saved Objects/
                    </Typography>
                    </Grid>
                </Grid>
                {/* Step 3 */}
                <Grid item container spacing={1} className={classes.spacing}>
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
        </Paper>
    );
}
