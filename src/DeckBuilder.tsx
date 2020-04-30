import Card from './Card';
import { CardType, generateTabletopOutput } from './Tabletop';

const punctRE = /[\\'!"#$%&()*+,\-.:;<=>?@[\]^_`{|}~]/g;
const DEFAULT_RESPONSE = "";


function getNumInstances(line: string) {
    let numInstances = Number(line.split(" ")[0])
    if (isNaN(numInstances)) {
        return 1;
    }
    return numInstances;
}

function getName(line: string) {
    // Starts with number
    if (line.match(/^\d/)) {
        let separated = line.split(" ");
        return separated.slice(1).join(" ").trim().toLowerCase().replace(punctRE, '');
    }
    return line;
}

// Perhaps build in a delay here to prevent Scryfall from overloading.
async function performQueries(promises: any[]) {
    return Promise.all(promises);
}

function compareToCommanders(commanders: string[], cardName: string) {
    let isEqual = false;
    for(let commander of commanders) {
        if (commander === cardName) {
            isEqual = true;
        }
    };
    return isEqual;
}

const NUMBER_PATTERN = /\d+/g;
const MTGGOLDFISH = "mtggoldfish";
const createGoldfishUrl = (url:string) => {
    let deckId = url.match(NUMBER_PATTERN);
    let extractedId = deckId?.join('');
    return "https://www.mtggoldfish.com/deck/download/"+extractedId;
}

const DECKSTATS = "deckstats";
const createDeckstatsUrl = (url:string) => {
    var deckUrl = new URL(url);
    deckUrl.searchParams.set('export_txt', "1");
    return deckUrl.toString();
}

async function getProxyUrl(url:string): Promise<string> {
    const res = await window.fetch('/proxy.php', {
        headers: {
            'X-Proxy-URL': url
        }
    })
    const deckFromUrl = await res.text();
    return deckFromUrl;
}


async function getDeckFromURL(url:string) : Promise<string[]> {
    let deck:string[] = [""];
    if (url.includes(MTGGOLDFISH)) {
        let deckUrl = createGoldfishUrl(url);
        let deckFromUrl = await getProxyUrl(deckUrl);
        console.log(deckFromUrl);
        deck = deckFromUrl.split("\n");        
    } else if (url.includes(DECKSTATS)) {
        let deckUrl = createDeckstatsUrl(url);
        let deckFromUrl = await getProxyUrl(deckUrl);
       /*
        Main
        1 Kelsien, the Plague # !Commander
        1 [KLD] Demolition Stomper

        Some others
        1 [KLD] Metalwork Colossus 

        */
       for(let card of deckFromUrl.split("\n")) {
            // skip if empty line
            if(card === "") {
                continue;
            }
            // skip if no number
            let numInstances = Number(card.split(" ")[0])
            if (isNaN(numInstances)) {
                continue;
            }            
            if(card.includes('[')){
                // remove set tag
                let tmpCard = card.split(" ")
                tmpCard.splice(1, 1)
                card = tmpCard.join(" ");
            }
            deck.push(card);
       }
    }
    return deck;
}

function isValidHttpUrl(str:string): boolean {
    let url;
  
    try {
      url = new URL(str);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
  }

async function download(form: any): Promise<string> {
    let commander: string = form.commander;
    let partner: string = form.partner;
    let decklistForm: string = form.decklist;

    if (commander === "" && decklistForm === "") {
        return DEFAULT_RESPONSE;
    }
    
    let decklist: string[] = decklistForm.split("\n");
    // Handle URLs
    if (isValidHttpUrl(decklist[0])) {
        decklist = await getDeckFromURL(decklist[0]);
    }

    let hasCommander = commander !== "";
    if (partner !== "") {
        commander += "\n"+partner;
    }
    let commanders = commander.split("\n")
        .filter((c: string) => { return c.trim() !== "" })
        .map((c: string) => { return getName(c)});

    let commanderIndices: number[] = [];

    let promises: any[] = [];
    let cards: Card[] = [];


    // Build decklist with queries
    decklist.forEach((line: string, index: number) => {
        if (line === "" || line.startsWith("//")) {
            return;
        }
        line = line.trim();
        let numInstances = getNumInstances(line);
        let name = getName(line);
        let tmpCard = new Card(name, numInstances, CardType.Default);

        if (hasCommander) {
            let isCommander = compareToCommanders(commanders, name);
            if (isCommander) {
                tmpCard.setType(CardType.Commander);
                commanderIndices.push(index);
            }
        }
        cards.push(tmpCard);
        promises.push(tmpCard.getCardPromise());
    });

    // Add commander if not present in main deck
    if (hasCommander && commanderIndices.length === 0) {
        commanders.forEach((line) => {
            if (line === "" || line.startsWith("//")) {
                return;
            }
            line = line.trim();
            let name = getName(line);
            let tmpCard = new Card(name, 1, CardType.Commander);
            commanderIndices.push(cards.length);
            cards.push(tmpCard);
            promises.push(tmpCard.getCardPromise());
        })
    }

    // collect
    await performQueries(promises);

    // Postprocess tokens, flip and additional cards
    let postPromises: any[] = [];
    cards.forEach(r => {
        // Handle tokens
        if (r.tokens.length !== 0) {
            r.tokens.forEach((token: any) => {
                let tmpCard = new Card("", 1, CardType.Additional);
                tmpCard.setUri(token);
                cards.push(tmpCard);
                postPromises.push(tmpCard.getCardPromise());
            })
        }
        // Handle flip cards
        if (r.cardType === CardType.Flip) {
            let tmpCard = Object.create(r);
            tmpCard.setBackUrl(""); // reset to cardback
            tmpCard.cardType = CardType.Default; // add a copy with hidden back to main deck
            cards.push(tmpCard);
            // make sure the double faced card gets put in the token stack
            r.cardType = CardType.Additional;
        }
    });

    let hasAdditional = postPromises.length > 0;

    // collect
    await performQueries(postPromises);

    // Error building
    let errors: string[] = [];
    cards.forEach((card: any) => {
        if (card.failed) {
            errors.push(card.name);
        }
    });
    if (errors.length > 0) {
        return errors.join("\n")
    }

    // Build JSON structure
    let output = generateTabletopOutput(cards, hasAdditional, hasCommander)

    // Download prompt
    var jsonse = JSON.stringify(output);
    var blob = new Blob([jsonse], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    let fileName = "";
    if (commanderIndices.length !== 0) {
        fileName = cards[commanderIndices[0]].name + ".json";
    } else {
        fileName = cards[0].name + ".json";
    }

    document.body.appendChild(a);
    a.href = url;
    a.download = fileName;
    a.click();

    //Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    return DEFAULT_RESPONSE;
}

export default download
