import React, { useState, Component } from 'react';
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
import { FormGroup, Switch, FormControlLabel, Paper, FormControl, InputLabel } from '@material-ui/core';
import { SetComponent } from './SealedGenerator';


export default function InfoForm() {
    const classes = useStyles();
    const [form, setForm] = useState({ "commander": "", "partner": "", "decklist": "" });
    const [disabled, setDisabled] = useState(false);
    const [errors, setErrors] = useState("");
    const [checked, setChecked] = useState(false);

    return (
        <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
                Sealed Selection
            </Typography>

            <Grid container spacing={1}>
                <Grid item xs={1}>
                    <Icon>
                        <img className={"Step"} src={step1} alt="step-1" />
                    </Icon>
                </Grid>
                <Grid item xs={11}>
                    <Typography variant="h6"
                    >
                        Select the set to play
                </Typography>
                    <form>
                        <SetComponent />
                    </form>
                </Grid>

                <Grid container spacing={1}>
                    <Grid item xs={1}>
                        <Icon>
                            <img className={"Step"} src={step2} alt="step-2" />
                        </Icon>
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
        </Paper>
    );
}