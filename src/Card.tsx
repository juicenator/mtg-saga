const SCRYFALL_CARD_BACK_IMAGE_URL = "https://img.scryfall.com/errors/missing.jpg";
const SCRYFALL_API_URL = "https://api.scryfall.com/cards/named?fuzzy=";

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
    failed: boolean;

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
        this.failed = false;
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
        // handle failure
        if (!body.name) {
            this.failed = true;
            return;
        }
        this.name = body.name;

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
    }

    async getCardPromise() {
        // if uri, do not query but directly get from uri
        let query = this.uri ? this.uri : this.query;
        try {
            const res = await window.fetch(query);
            const json = await res.json();
            this.parseResults(json);
        } catch (err) {
            console.log("ER1: Failed to get: "+this.name)
            this.failed = true;
        }


        // return window.fetch(query).then((response: any) => {
        //     return response.json().then((res: any) => {
        //         this.parseResults(res);
        //     })
        // }).catch((err:any) => {
        //     console.log("ER1: Failed to get: "+this.name)
        //     this.failed = true;
        // })
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