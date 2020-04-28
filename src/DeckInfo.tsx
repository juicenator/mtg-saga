import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Icon from '@material-ui/core/Icon';
import download from './DeckBox';
import useStyles from './Styles';

import step1 from './images/step-1.svg' // relative path to image
import step2 from './images/step-2.svg' // relative path to image
import step3 from './images/step-3.svg' // relative path to image

export default function InfoForm() {
    const classes = useStyles();
    const [form, setForm] = useState({"commander": "", "decklist": ""});
    const [disabled, setDisabled] = useState(false);

    return (
        <Grid container spacing={1}>
            <Grid item xs={1}>
                <Icon>
                    <img className={"Step"} src={step1} alt="step-1"/>
                </Icon>
            </Grid>
            <Grid item xs={11}>
                <Typography variant="h6"
                >
                    Optional: Who is your Commander?
                </Typography>
                <Grid item xs={11} container justify="center">
                    <TextField
                        id="commander"
                        name="commander"
                        label="Commander"
                        value={form.commander}
                        onChange={(e) => {
                            setForm({...form, "commander": e.target.value})
                        }}
                        InputLabelProps={{shrink: true}}
                        fullWidth
                        placeholder={"Alela, Artful Provocateur"}
                        helperText="It will be spawned next to the deck,
                        so you don't have to search for it!"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={1}>
                <Grid item xs={1}>
                    <Icon>
                        <img className={"Step"} src={step2} alt="step-2"/>
                    </Icon>
                </Grid>
                <Typography variant="h6"
                            className={classes.heading}
                >
                    Paste a decklist {/* or mtggoldfish url below */}
                </Typography>
                <Typography></Typography>
                <Grid item xs={1}>
                </Grid>
                <Grid item xs={12} container justify="center">
                    <TextField
                        id="decklist"
                        name="decklist"
                        label="Decklist"
                        value={form.decklist}
                        onChange={(e) => {
                            setForm({...form, "decklist": e.target.value})
                        }}
                        InputLabelProps={{shrink: true}}
                        placeholder={"1 Admiral's Order\n" +
                        "1 Aether Hub\n" +
                        "1 Anointed Procession\n" +
                        "1 Arcanist's Owl\n" +
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
                    <br/>
                    Save the output file in the Tabletop Simulator folder:
                    <pre className={"Wrap"}>
                    On windows:<br/>
                    C:\Users\YOUR_NAME\Documents\My Games\Tabletop Simulator\Saves\Saved Objects\</pre>
                    <pre className={"Wrap"}>
                    On mac:<br/>
                    ~/Library/Tabletop Simulator/Saves/Saved Objects/</pre>
                </Grid>
            </Grid>
            <Grid container spacing={1}>
                <Grid item xs={1}>
                    <Icon>
                        <img className={"Step"} src={step3} alt="step-3"/>
                    </Icon>
                </Grid>
                <Grid item xs={11}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={async function () {
                            setDisabled(true);
                            await download(form);
                            setDisabled(false);
                        }}
                        aria-label="download tabletop JSON"
                        disabled={disabled}
                    >
                        Download Tabletop Simulator file
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
}