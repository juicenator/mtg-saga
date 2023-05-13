import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import Icon from '@mui/material/Icon';
// import AppleIcon from '@material-ui/icons/Apple';
// import LaptopWindowsIcon from '@material-ui/icons/LaptopWindows';

import download from './DeckBuilder';
import useStyles from './Styles';

import { isValidHttpUrl } from './Utils';

import step1 from './images/step-1.svg' // relative path to image
import step2 from './images/step-2.svg' // relative path to image
import step3 from './images/step-3.svg' // relative path to image
import { FormGroup, Switch, FormControlLabel, Tooltip, SvgIcon, Paper, CardMedia, Card } from '@mui/material';
import { DEFAULT_CARD_BACK_IMAGE_URL } from "./Card";

export default function InfoForm() {
    const { classes } = useStyles();
    const [form, setForm] = useState({ "commander": "", "partner": "", "decklist": "", "sideboard": "", "cardback": "" });
    const [disabled, setDisabled] = useState(false);
    const [sideboardEnabled, setSideboardEnabled] = useState(false);
    const [errors, setErrors] = useState("");
    const [checked, setChecked] = useState(false);
    const [customCardBackChecked, setCustomCardBackChecked] = useState(false);


    return (
        <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
                Deck Information
            </Typography>
            {/* Main container */}
            <Grid item container direction="row" spacing={1}>

                {/* Step 1: Who is your commander */}
                <Grid container>
                    {/* Icon and Title */}
                    <Grid container direction="row" alignItems="start">
                        <Icon className={"Step-container"}>
                            <img className={"Step"} src={step1} alt="step-1" />
                        </Icon>
                        <Typography variant="h6">
                            Optional: Who is your Commander?
                        </Typography>
                    </Grid>

                    {/* Select command and partner */}
                    <Grid item xs={11} style={{ paddingLeft: "30px" }}>
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
                                    variant="standard"
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
                                variant="standard"
                            /> : null}
                        </FormGroup>
                    </Grid>
                </Grid>

                <Grid item> </Grid>

                {/* Step 2: Paste a decklist */}
                <Grid container>
                    {/* Icon and Title */}
                    <Grid container direction="row" alignItems="start" wrap='nowrap'>
                        <Icon className={"Step-container"}>
                            <img className={"Step"} src={step2} alt="step-2" />
                        </Icon>
                        <Typography variant="h6"
                            className={classes.heading}
                        >
                            Paste a decklist
                        </Typography>
                    </Grid>

                    {/* Decklist input */}
                    <Grid item xs={11} style={{ paddingLeft: "30px" }}>
                        {/* TODO the wrap does not work */}
                        <Typography variant="caption" flexWrap="wrap">
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
                                <Typography variant="caption" className='subHeader'>
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
                                        "6 Island (thb) 251\n" +
                                        "...."}
                                    fullWidth
                                    multiline
                                    rows={6}
                                    variant={"outlined"}
                                />
                            </Grid>
                            <Grid container item xs={12} style={{ paddingLeft: "5px" }}>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Switch disabled={form.decklist.includes("http")}
                                                checked={sideboardEnabled}
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
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Switch checked={customCardBackChecked} onChange={(e) => {
                                            setCustomCardBackChecked(e.target.checked);
                                            setForm({ ...form, "cardback": DEFAULT_CARD_BACK_IMAGE_URL });
                                        }} name="cardback-switch" size="small" />}
                                        label="Custom Card Back"
                                    />
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Sideboard */}
                {sideboardEnabled ? <Grid container item xs={12} style={{ paddingLeft: "30px" }}>
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

                <Grid item> </Grid>

                {/* Step 2.5: Custom card back */}
                <Grid item container direction="row">
                    <Grid item xs={1}>
                    </Grid>
                    <Grid item container xs={11} direction="row">
                        {customCardBackChecked ?
                            <Grid item container xs={11} direction="row">
                                <TextField
                                    id="cardback"
                                    name="cardback"
                                    label="Custom Card Back"
                                    value={form.cardback}
                                    onChange={(e) => {
                                        setForm({ ...form, "cardback": e.target.value })
                                        // test if correct url, if so, set download on OK
                                        if (!isValidHttpUrl(e.target.value)) {
                                            setDisabled(true);
                                        } else {
                                            setDisabled(false);
                                        }
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                    placeholder={DEFAULT_CARD_BACK_IMAGE_URL}
                                    helperText="Paste a URL to a card image with a ratio of 488 × 680"
                                    fullWidth
                                    variant="standard"
                                />
                                <Card className={"CardBack"}>
                                    <CardMedia image={form.cardback} className={"CardBack"}>
                                    </CardMedia>
                                </Card>
                            </Grid>
                            : null}
                    </Grid>
                </Grid>

                <Grid item > </Grid>

                {/* Step 3: Download and install instructions */}
                <Grid container>
                    {/* Icon and Button */}
                    <Grid container direction="row" alignItems="start" wrap='nowrap'>
                        <Icon className={"Step-container"}>
                            <img className={"Step"} src={step3} alt="step-3" />
                        </Icon>
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
                            {/* <Grid item xs={12}> */}
                            {/* <Typography */}
                            {/* variant={"caption"}> */}
                            {/* Downloading may take a couple of seconds. */}
                            {/* </Typography> */}
                            {/* </Grid> */}
                            {/* <br /> */}
                        </Grid>
                    </Grid>

                    {/* Installation */}
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
                                    Windows
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
                                Mac
                            </SvgIcon>
                        </Grid>
                        <Grid item xs={11}>
                            <Typography variant="caption" className={"Wrap"}>
                                ~/Library/Tabletop Simulator/Saves/Saved Objects/
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Please donate line */}
                <Grid item xs={12}>
                    <Typography
                        variant={"body2"}>
                        <form id="donate" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                            <input type="hidden" name="cmd" value="_s-xclick" />
                            <input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----" />
                            Please <button type="submit" className={"HoverButton"}
                            ><b><u>donate</u></b></button> to help in covering the server costs.
                        </form>
                    </Typography>
                </Grid>


                {/*Error display*/}
                <Grid item xs={12} container style={{ paddingTop: "1vmin" }}>
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
