const SCRYFALL_CARD_BACK_IMAGE_URL = "https://img.scryfall.com/errors/missing.jpg";
const SCRYFALL_API_URL = "http://api.scryfall.com/cards/named?fuzzy=";

export default class Card {
    name: string;
    num_instances: number;
    additional: boolean;
    flip: boolean;
    back_url: string;
    front_url: string;
    query: string;
    uri: string;
    tokens: string[];

    constructor(name: string, num_instances: number, additional: boolean) {
        this.name = name;
        this.num_instances = num_instances;
        this.additional = additional;
        this.back_url = SCRYFALL_CARD_BACK_IMAGE_URL;
        this.front_url = SCRYFALL_CARD_BACK_IMAGE_URL;
        this.query = SCRYFALL_API_URL + '"' + name + '"';
        this.uri = "";
        this.tokens = [];
        this.flip = false;
    }

    setFrontUrl(url: string) {
        this.front_url = url;
    }

    setBackUrl(url: string) {
        if(url === "") {
            this.back_url = SCRYFALL_CARD_BACK_IMAGE_URL;
            return
        }
        this.back_url = url;
    }

    setUri(uri: string) {
        this.uri = uri;
    }

    parseResults(body: any) {
        // if split card
        if (body.card_faces && body.image_uris) {
            this.setFrontUrl(body.image_uris.normal);
        }
        // if flip card
        if (body.card_faces && !body.image_uris){
            this.setFrontUrl(body.card_faces[0].image_uris.normal);
            this.setBackUrl(body.card_faces[1].image_uris.normal);
            this.flip = true;
            this.additional = true;
        }
        // if normal card
        if(body.image_uris){
            this.setFrontUrl(body.image_uris.normal);
        }
        // tokens (only if called first time)
        if(!this.uri && body.all_parts) {
            body.all_parts.forEach((c:any)=> {
               // There is a related card pointing to itself
               if (c.name === body.name) {
                   return;
               }
               this.tokens.push(c.uri);
            });
        }
        this.name = body.name;
    }

    getCardPromise(): any {
        // if uri, do not query but directly get from uri
        let query = this.uri ? this.uri : this.query;
        return window.fetch(query).then((y: any) => {
            return y.text().then((res: any) => {
                // console.log(res);
                let parsed = JSON.parse(res);
                this.parseResults(parsed);
            })
        });
    }

    getTabletopCard(): any {
        return {
            "FaceURL": this.front_url,
            "BackURL": this.back_url,
            "NumHeight": 1,
            "NumWidth": 1,
            "BackIsHidden": !this.flip
        }
    }
}