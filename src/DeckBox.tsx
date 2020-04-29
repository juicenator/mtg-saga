import Card from './Card';
import { CardType, generateTabletopOutput } from './Tabletop';

const punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]/g;
const DEFAULT_RESPONSE = "";


function getNumInstances(line: string) {
    let numInstances = Number(line.split(" ")[0])
    if (isNaN(numInstances)) {
        return 1
    }
    return numInstances;
}

function getName(line: string) {
    // Starts with number
    if (line.match(/^\d/)) {
        let separated = line.split(" ");
        return separated.slice(1).join(" ");
    }
    return line;
}

async function performQueries(promises: any[]) {
    return Promise.all(promises).then(results => {
        // do something with results.
        console.log("Done");
    });
}

function compareToCommanders(commanders: string[], cardName: string) {
    let isEqual = false;
    for(let commander of commanders) {
        if (commander === cardName.trim().toLowerCase().replace(punctRE, '')) {
            isEqual = true;
        }
    };
    return isEqual;
}

async function download(form: any): Promise<string> {
    let commander: string = form.commander;
    let decklist: string[] = form.decklist.split("\n");
    if (commander === "" && form.decklist === "") {
        return DEFAULT_RESPONSE;
    }

    let hasCommander = commander !== "";
    let commanders = commander.split("\n")
        .filter((c: string) => { return c.trim() !== "" })
        .map((c: string) => { return getName(c).trim().toLowerCase().replace(punctRE, '') });

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

    console.log(cards);

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
        if (r.cardType == CardType.Flip) {
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
