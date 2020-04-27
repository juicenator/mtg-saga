import React, { useState }  from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import download from './DeckBox';
import useStyles from './Styles';

export default function InfoForm() {
    const classes = useStyles();
    // const [form, setForm] = useState({"commander":"", "decklist":""});
    const [form, setForm] = useState({"commander":"", "decklist":"alela, artful provocateur"});
    let disabled = false;

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                {/*<pre>{JSON.stringify(form, null, 2)}</pre>*/}
                <Typography variant="h6" gutterBottom>
                    Optional: Enter Commander name
                </Typography>
                <Typography>
                    (and do not exclude it in the decklist)
                </Typography>
                <TextField
                    id="commander"
                    name="commander"
                    label="Commander"
                    value={form.commander}
                    onChange={(e)=>{setForm({...form, "commander":e.target.value})}}
                    InputLabelProps={{shrink: true}}
                    fullWidth
                    placeholder={"Alela, Artful Provocateur"}
                    helperText="The commander will be kept separate from the deck,
                        so you do not have to search for it"
                />
            </Grid>
            <Typography variant="h6" gutterBottom>
                Paste a decklist {/* or mtggoldfish url below */}
            </Typography>
            <Grid item xs={12}>
                <TextField
                    id="decklist"
                    name="decklist"
                    label="Decklist"
                    value={form.decklist}
                    onChange={(e)=>{setForm({...form, "decklist":e.target.value})}}
                    InputLabelProps={{shrink: true}}
                    placeholder={"1 Admiral's Order\n" +
                    "1 Aether Hub\n" +
                    "1 Anointed Procession\n" +
                    "1 Arcane Signet\n" +
                    "1 Arcanist's Owl\n" +
                    "1 As Foretold\n" +
                    "...."}
                    fullWidth
                    multiline
                    rows={7}
                    variant={"outlined"}
                />
            </Grid>
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    console.log("TODO: Disable button and re enable later")
                    download(form);
                }}
                className={classes.button}
                aria-label="download tabletop JSON"
                disabled={disabled}
            >
                Download
            </Button>
        </Grid>
    );
}