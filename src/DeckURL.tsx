const NUMBER_PATTERN = /\d+/g;
const MTGGOLDFISH = "mtggoldfish";
const createGoldfishUrl = (url: string) => {
    let deckId = url.match(NUMBER_PATTERN);
    let extractedId = deckId?.join('');
    return "https://www.mtggoldfish.com/deck/download/" + extractedId;
}

const DECKSTATS = "deckstats";
const createDeckstatsUrl = (url: string) => {
    var deckUrl = new URL(url);
    deckUrl.searchParams.set('export_txt', "1");
    return deckUrl.toString();
}

const TAPPEDOUT = "tappedout";
const createTappedoutUrl = (url: string) => {
    var deckUrl = new URL(url);
    deckUrl.searchParams.set('fmt', "txt");
    return deckUrl.toString();
}
const MANASTACK = "manastack";
const createManastackUrl = (url: string) => {
    let deckId = url.match(NUMBER_PATTERN);
    let extractedId = deckId?.join('');
    return "https://manastack.com/api/decklist?format=simple&id="+extractedId;
}


async function getProxyUrl(url: string): Promise<string> {
    // const res = await window.fetch('/proxy.php', {
    const res = await window.fetch('http://mtgsa.ga/proxy.php', {
        headers: {
            'X-Proxy-URL': url
        }
    })
    const deckFromUrl = await res.text();
    return deckFromUrl;
}


export async function getDeckFromURL(url: string): Promise<string[]> {
    let deck: string[] = [""];
    if (url.includes(MTGGOLDFISH)) {
        let deckUrl = createGoldfishUrl(url);
        let deckFromUrl = await getProxyUrl(deckUrl);
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
        for (let card of deckFromUrl.split("\n")) {
            // skip if empty line
            if (card === "") {
                continue;
            }
            // skip if no number
            let numInstances = Number(card.split(" ")[0])
            if (isNaN(numInstances)) {
                continue;
            }
            if (card.includes('[')) {
                // remove set tag
                let tmpCard = card.split(" ")
                tmpCard.splice(1, 1)
                card = tmpCard.join(" ");
            }
            deck.push(card);
        }
    } else if (url.includes(TAPPEDOUT)) {
        let deckUrl = createTappedoutUrl(url);
        let deckFromUrl = await getProxyUrl(deckUrl);
        deck = deckFromUrl.split("\n");
    } else if (url.includes(MANASTACK)) {
        let deckUrl = createManastackUrl(url);
        let deckFromUrl = await getProxyUrl(deckUrl);
        deck = deckFromUrl.split("\n").map((card:string)=>{return card.toLowerCase()});
        let hasSideboard = deck.indexOf("sideboard");
        if(hasSideboard != -1) {
            deck = deck.slice(0, hasSideboard);
        }
        let tmpDeck: string[] = [];
        for (let card of deckFromUrl.split("\n")) {
            // skip if empty line
            if (card === "") {
                continue;
            }
            // skip if no number
            let numInstances = Number(card.split(" ")[0])
            if (isNaN(numInstances)) {
                continue;
            }
            tmpDeck.push(card);
        }
    }
    return deck;
}

export function isValidHttpUrl(str: string): boolean {
    let url;

    try {
        url = new URL(str);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}