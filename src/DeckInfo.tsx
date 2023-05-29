import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import Icon from '@mui/material/Icon';

import AppleIcon from '@mui/icons-material/Apple';
import LaptopWindowsIcon from '@mui/icons-material/LaptopWindows';

import download from './DeckBuilder';
import useStyles from './Styles';

import step1 from './images/step-1.svg' // relative path to image
import step2 from './images/step-2.svg' // relative path to image
import step3 from './images/step-3.svg' // relative path to image
import { FormGroup, Switch, FormControlLabel, Tooltip, SvgIcon, Paper } from '@mui/material';
import { DEFAULT_CARD_BACK_IMAGE_URL } from "./Card";
import CardBackSelection from './CardBackSelection';

export type FormType = {
    commander: string;
    partner: string;
    decklist: string;
    sideboard: string;
    cardback: string;
}

export type SetFormType = React.Dispatch<React.SetStateAction<FormType>>

export default function InfoForm() {
    const { classes } = useStyles();
    const [form, setForm]: [FormType, SetFormType] = useState({ "commander": "", "partner": "", "decklist": "", "sideboard": "", "cardback": "" });

    const [disabled, setDisabled] = useState(false);
    const [customCardBackDisabled, setCustomCardBackDisabled] = useState(false);
    const [sideboardEnabled, setSideboardEnabled] = useState(false);
    const [errors, setErrors] = useState("");
    const [checked, setChecked] = useState(false);
    const [customCardBackChecked, setCustomCardBackChecked] = useState(false);


    return (
        <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center" style={{ "paddingBottom": "10px" }}>
                Deck Information
            </Typography>
            {/* Main container */}
            <Grid item container direction="row" spacing={1}>

                {/* Step 1: Who is your commander */}
                <Grid container spacing={1}>
                    {/* Icon and Title */}
                    <Grid container item direction="row" alignItems="start" xs={12}>
                        <Grid container item xs={1}>
                            <Icon className={"Step-container"}>
                                <img className={"Step"} src={step1} alt="step-1" />
                            </Icon>
                        </Grid>
                        <Grid container item xs={11}>
                            <Typography variant="h6">
                                Optional: Who is your Commander? <br />
                            </Typography>
                            <Typography variant="caption">
                                Will be spawned next to the deck for convenience!
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Select command and partner */}
                    <Grid xs={12} item container direction="row">
                        <Grid item container xs={1}> </Grid>
                        <Grid item container xs={11} flexDirection="row">
                            <Grid item container flexDirection="row" justifyContent="space-between">
                                <Grid item container xs={8}>
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
                                        fullWidth
                                        variant="standard"
                                    />
                                </Grid>
                                <FormControlLabel
                                    control={<Switch disabled={form.commander === ""} checked={checked} onChange={(e) => {
                                        setChecked(e.target.checked);
                                        setForm({ ...form, "partner": "" });
                                    }} name="partner-switch" size="small" />}
                                    label="Partner"
                                />
                            </Grid>
                            <Grid item container xs={8} style={{ paddingTop: "10px" }}>
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
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item container style={{ "height": "20px" }}> </Grid>

                {/* Step 2: Paste a decklist */}
                <Grid container spacing={1}>
                    {/* Icon and Title */}
                    <Grid container item direction="row" alignItems="start" xs={12}>
                        <Grid container item xs={1}>
                            <Icon className={"Step-container"}>
                                <img className={"Step"} src={step2} alt="step-2" />
                            </Icon>
                        </Grid>
                        <Grid container item xs={11}>
                            <Typography variant="h6">
                                Paste a decklist <br />
                            </Typography>
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
                        </Grid>
                    </Grid>

                    {/* Decklist input */}
                    <Grid xs={12} item container direction="row">
                        <Grid item container xs={1}> </Grid>
                        <Grid item container xs={11} flexDirection="row">
                            <Grid item container xs={10}>
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

                            {/* Switches Sideboard and card back*/}
                            <Grid container item style={{ "paddingLeft": "10px" }}>
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
                                        control={
                                            <Switch checked={customCardBackChecked}
                                                onChange={(e) => {
                                                    setCustomCardBackChecked(e.target.checked);
                                                    if (e.target.checked === false) {
                                                        setCustomCardBackDisabled(false);
                                                        setForm({ ...form, "cardback": "" });
                                                    } else {
                                                        setForm({ ...form, "cardback": DEFAULT_CARD_BACK_IMAGE_URL });
                                                    }
                                                }}
                                                name="cardback-switch"
                                                size="small" />
                                        }
                                        label="Custom Card Back"
                                    />
                                </FormGroup>
                            </Grid>

                            <Grid item container style={{ "height": "20px" }}> </Grid>

                            {/* Sideboard */}
                            {sideboardEnabled ?
                                <Grid item container xs={10}>
                                    <Grid item container style={{ "height": "10px" }}> </Grid>

                                    <Grid container item>
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
                                    </Grid>
                                </Grid> : null}


                            {/* Custom card back */}
                            {customCardBackChecked ?
                                <CardBackSelection form={form} setForm={setForm} setCustomCardBackDisabled={setCustomCardBackDisabled}/>
                                : null}
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item container style={{ "height": "10px" }}> </Grid>

                {/* Step 3: Download and install instructions */}
                <Grid container spacing={1}>
                    {/* Icon and Button */}
                    <Grid container item xs={1}>
                        <Icon className={"Step-container"}>
                            <img className={"Step"} src={step3} alt="step-3" />
                        </Icon>
                    </Grid>
                    <Grid container item xs={11}>
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
                            disabled={ disabled || customCardBackDisabled || (form.commander === "" && form.decklist === "") }
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

                    {/* Installation instructions */}
                    <Grid xs={12} item container direction="row">
                        <Grid item container xs={1}> </Grid>
                        <Grid item container xs={11} flexDirection="row">
                            <Typography variant="caption">
                                Save the output file in the Tabletop Simulator folder:
                            </Typography>
                            <Grid item container direction="row" spacing={1}>
                                <Grid item xs={1}>
                                    <Typography variant="caption">
                                        <SvgIcon>
                                            <LaptopWindowsIcon aria-label="windows" />
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
                                        <AppleIcon aria-label="mac" />
                                    </SvgIcon>
                                </Grid>
                                <Grid item xs={11}>
                                    <Typography variant="caption" className={"Wrap"}>
                                        ~/Library/Tabletop Simulator/Saves/Saved Objects/
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Wicloz is hosting this now */}
                {/* Please donate line */}
                {/* <Grid item xs={12}>
                    <Typography
                        variant={"body2"}>
                        <form id="donate" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                            <input type="hidden" name="cmd" value="_s-xclick" />
                            <input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----" />
                            Please <button type="submit" className={"HoverButton"}
                            ><b><u>donate</u></b></button> to help in covering the server costs.
                        </form>
                    </Typography>
                </Grid> */}


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
