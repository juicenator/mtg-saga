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

async function getProxyUrl(url: string): Promise<string> {
    const res = await window.fetch('/proxy.php', {
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