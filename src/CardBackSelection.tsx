import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Card } from '@mui/material';

import imageNotFound from './images/image-not-found.png' // relative path to image

import { isValidHttpUrl } from './Utils';
import { DEFAULT_CARD_BACK_IMAGE_URL } from './Card';
import { FormType, SetFormType } from './DeckInfo';

type ImportType = {
    form: FormType,
    setForm: SetFormType,
    setCustomCardBackDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CardBackSelection({ form, setForm, setCustomCardBackDisabled }: ImportType) {
    const cardbackUrl = form.cardback;
    let previewUrl = cardbackUrl;

    const preselectImages = [{
        "key": 1,
        "url": DEFAULT_CARD_BACK_IMAGE_URL,
        "alt": "dark mode magic the gathering card back"
    }, {
        "key": 2,
        "url": "https://i.imgur.com/Hg8CwwU.jpeg",
        "alt": "default magic the gathering card back"
    }]


    return (
        <Grid item container xs={12}>
            <Grid item container style={{ "height": "10px" }}> </Grid>

            <Grid item container xs={11} direction="row" justifyContent="space-between">
                <Grid> 
                    <TextField
                        id="cardback"
                        name="cardback"
                        label="Custom Card Back"
                        value={cardbackUrl}
                        onChange={(e) => {
                            setForm({ ...form, "cardback": e.target.value })
                            if (isValidHttpUrl(e.target.value)) {
                                setCustomCardBackDisabled(false);
                                previewUrl = e.target.value;
                            } else {
                                setCustomCardBackDisabled(true);
                                previewUrl = '';
                            }
                        }}
                        InputLabelProps={{ shrink: true }}
                        placeholder={DEFAULT_CARD_BACK_IMAGE_URL}
                        helperText="We recommend using an image with a ratio of 488×680"
                        fullWidth
                        variant="standard"
                        style={{ paddingRight: "10px", width: "auto" }}
                    />
                    <Grid item container direction="row"> 
                        {
                            preselectImages.map((image) => (
                                <Card 
                                    key={image.key}
                                    onClick={() => {
                                        setForm({ ...form, "cardback": image.url });
                                        setCustomCardBackDisabled(false);
                                    }}
                                    className={"CardBack"}>
                                    <img
                                        style={{ width: "100%", height: "100%" }}
                                        src={image.url}
                                        alt={image.alt}
                                    >
                                    </img >
                                </Card>
                            ))
                        }
                       
                    </Grid>
                </Grid>
                <Card className={"CardBack"}>
                    <img
                        style={{ width: "100%", height: "100%" }}
                        src={previewUrl}
                        alt="preview of card back"
                        onError={(e) => {
                            setCustomCardBackDisabled(true)
                            if (previewUrl !== imageNotFound) {
                                previewUrl = imageNotFound
                                e.currentTarget.src = previewUrl
                            }
                        }}
                    >
                    </img >
                </Card>
            </Grid>
        </Grid>
    );
}
