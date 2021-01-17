import { CardType, TabletopCard, TabletopObject } from './Tabletop';
import { isValidHttpUrl } from './Utils';

export const SCRYFALL_CARD_BACK_IMAGE_URL = "https://img.scryfall.com/errors/missing.jpg";
const SCRYFALL_API_URL = "https://api.scryfall.com/cards/named?fuzzy=";

const FORMAT_MTGO = /(?<quantity>\d+)\s+(?<card>.*?)\s+\((?<set>.+)\)(\s+(?<number>\d+[ps]?))/;
const FORMAT_MTGA = /(?<quantity>\d+)\s+(?<card>.*)/;

let cardBack = SCRYFALL_CARD_BACK_IMAGE_URL;
function getCardBack() {
    return cardBack;
}
export function setCardBack(tmpCardBack: string) {
    if (tmpCardBack.trim() !== "" && isValidHttpUrl(tmpCardBack)) {
        cardBack = tmpCardBack;
    } else {
        cardBack = SCRYFALL_CARD_BACK_IMAGE_URL;
    }
}

type Token = {
    name: string,
    uri: string
}

export default class Card {
    name: string;
    collectorNumber: string;
    setCode: string;
    numInstances: number;
    cardType: CardType;
    back_url: string;
    front_url: string;
    query: string;
    uri: string;
    tokens: Token[];
    failed: boolean;
    id: number;

    constructor(name: string, num_instances: number, type: CardType) {
        this.name = name;
        this.numInstances = num_instances;
        this.cardType = type;
        this.back_url = SCRYFALL_CARD_BACK_IMAGE_URL;
        this.front_url = SCRYFALL_CARD_BACK_IMAGE_URL;
        this.query = SCRYFALL_API_URL + '"' + name + '"';
        this.uri = "";
        this.tokens = [];
        this.failed = false;
        this.id = -1;
        this.collectorNumber = "";
        this.setCode = "";
    }

    setFrontUrl(url: string) {
        this.front_url = url;
    }

    setBackUrl(url: string) {
        if (url === "") {
            this.back_url = getCardBack();
            return
        }
        this.back_url = url;
    }

    setUri(uri: string) {
        this.uri = uri;
    }

    setCardType(cardType: CardType) {
        this.cardType = cardType;
    }

    setId(id: number) {
        this.id = id;
    }

    setNumInstances(num: number) {
        this.numInstances = num;
    }

    parseResults(body: any) {
        // handle failure
        if (!body.name) {
            this.failed = true;
            return;
        }
        this.name = body.name;

        // if split card, do not use the card_faces but just the normal one
        if (body.card_faces && body.image_uris) {
            this.setFrontUrl(body.image_uris.normal);
        }
        // if flip card
        if (body.card_faces && !body.image_uris) {
            this.setFrontUrl(body.card_faces[0].image_uris.normal);
            this.setBackUrl(body.card_faces[1].image_uris.normal);
            this.cardType = CardType.Flip
        }
        // if normal card
        if (body.image_uris) {
            this.setFrontUrl(body.image_uris.normal);
        }
        // tokens (only if called first time)
        if (!this.uri && body.all_parts) {
            body.all_parts.forEach((c: any) => {
                // There is a related card pointing to itself
                if (c.name === body.name) {
                    return;
                }
                // If this is e.g. a partner card
                if (c.component === "combo_piece") {
                    return;
                }
                this.tokens.push({
                    "name": c.name,
                    "uri": c.uri
                });
            });
        }
    }

    async getCardPromise() {
        // if uri, do not query but directly get from uri
        let query = this.uri ? this.uri : this.query;
        try {
            const res = await window.fetch(query);
            const json = await res.json();
            this.parseResults(json);
        } catch (err) {
            console.log("ER1: Failed to get: " + this.name)
            this.failed = true;
        }
    }

    getTabletopCard(): TabletopCard {
        return {
            "FaceURL": this.front_url,
            "BackURL": this.back_url,
            "NumHeight": 1,
            "NumWidth": 1,
            "BackIsHidden": !(this.cardType === CardType.Flip)
        }
    }

    getCardObject(): TabletopObject {
        if (this.id === -1) {
            throw Error("This card is invalid " + this.name);
        }
        return {
            "CardID": this.id,
            "Name": "Card",
            "Nickname": this.name,
            "Transform": {
                "posX": 0,
                "posY": 0,
                "posZ": 0,
                "rotX": 0,
                "rotY": 180,
                "rotZ": 180,
                "scaleX": 1,
                "scaleY": 1,
                "scaleZ": 1,
            }
        }
    }

    static fromLine(line: string, type: CardType = CardType.Default): Card {
        console.log(FORMAT_MTGO.test(line));
        if (FORMAT_MTGO.test(line)) {
            let m = FORMAT_MTGO.exec(line);
            if (m && m.groups) {
                let card = new Card(m.groups.card, Number(m.groups.quantity), type);
                card.collectorNumber = m.groups.number;
                card.setCode = m.groups.set;

                return card;
            }
        }

        if (FORMAT_MTGA.test(line)) {
            let m = FORMAT_MTGA.exec(line);
            if (m && m.groups) {
                return new Card(m.groups.card, Number(m.groups.quantity), type);
            }
        }

        return new Card(line, 1, type);
    }
}