import Card from './Card';

const punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]/g;
const DEFAULT_RESPONSE = "";


const delay = (ms: number) =>
    new Promise(resolve => {
        setTimeout(resolve, ms);
    });

function iterateSerialAsync(array: Promise<any>[], ms: number) {
    let delayT = 0
    return array.map(function (p, index) {
        delayT += ms;
        return delay(delayT).then(() => p);
    });
}

function getDeckRepresentation(additional: boolean): any {
    return {
        "Name": "DeckCustom",
        "ContainedObjects": [],
        "DeckIDs": [],
        "CustomDeck": {},
        "Transform": {
            "posX": additional ? -4 : 0,
            "posY": 1,
            "posZ": 0,
            "rotX": 0,
            "rotY": 180,
            "rotZ": 0,
            "scaleX": 1,
            "scaleY": 1,
            "scaleZ": 1
        }
    }
}

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
        return separated.slice(1,).join(" ");
    }
    return line;
}

async function performQueries(promises: any[]) {
    return Promise.all(promises).then(results => {
        // do something with results.
        console.log("Done");
    });
}

function getCardObject(id: number, name: string): any {
    return {
        "CardID": id,
        "Name": "Card",
        "Nickname": name,
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

async function download(form: any) {
    let commander = form.commander;
    let decklist = form.decklist.split("\n");
    let commanderIndex = -1;

    // console.log(commander);
    // console.log(decklist);
    if (commander === "" && form.decklist === "") {
        return DEFAULT_RESPONSE;
    }
    let promises: any[] = [];
    let cards: any[] = [];
    let mainDeck = getDeckRepresentation(false);
    let additionalDeck = getDeckRepresentation(true);

    // Build decklist with queries
    decklist.forEach((line: string) => {
        if (line === "" || line.startsWith("//")) {
            return;
        }
        line = line.trim();
        let numInstances = getNumInstances(line);
        let name = getName(line);
        let tmpCard = new Card(name, numInstances, false);
        cards.push(tmpCard);
        promises.push(tmpCard.getCardPromise());
    });

    // Add commander if present
    if (commander !== "") {
        let tmpCommander = "" + commander;
        tmpCommander = tmpCommander.toLowerCase();
        tmpCommander = tmpCommander.replace(punctRE, '');

        // See if commander already present in list
        let alreadyPresent = false;
        cards.forEach((c: any, index:number) => {
            if (alreadyPresent) {
                return;
            }
            let tmpStripped = "" + c.name;
            tmpStripped = tmpStripped.replace(punctRE, '');
            tmpStripped = tmpStripped.toLowerCase();
            if (tmpStripped === tmpCommander) {
                c.num_instances = 1;
                c.additional = true;
                c.commander = true;
                alreadyPresent = true;
                commanderIndex = index;
            }
        })

        if (!alreadyPresent) {
            let tmpCard = new Card(commander, 1, true);
            commanderIndex = cards.length;
            cards.push(tmpCard);
        }
    }

    // collect
    // await iterateSerialAsync(promises, 1000)
    await performQueries(promises);

    // Postprocess tokens, flip and additional cards
    let postPromises: any[] = [];
    cards.forEach(r => {
        // Handle tokens
        if (r.tokens.length !== 0) {
            r.tokens.forEach((token: any) => {
                let tmpCard = new Card("", 1, true);
                tmpCard.setUri(token);
                cards.push(tmpCard);
                postPromises.push(tmpCard.getCardPromise());
            })
        }
        // Handle flip cards
        if (r.flip) {
            let tmpCard = Object.create(r);
            tmpCard.setBackUrl(""); // reset to cardback
            tmpCard.additional = false;
            cards.push(tmpCard);
        }
    });

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
    console.log("Building JSON")

    // Handle normal cards
    console.log("Handle normal cards")
    let cardId = 1;
    cards.filter((c) => {
        return !c.additional;
    }).forEach((card: any) => {
        for (let i = 0; i < card.num_instances; i++) {
            let tmpCardId = cardId * 100;
            // register card ID
            mainDeck.DeckIDs.push(tmpCardId);

            // register card object
            mainDeck.ContainedObjects.push(getCardObject(tmpCardId, card.name))

            // register card visual object
            mainDeck.CustomDeck[String(cardId)] = card.getTabletopCard();
            cardId += 1;
        }
    });

    //Handle additional cards
    console.log("Handle additional cards")
    let additionalId = 1;
    cards.filter((c) => {
        return c.additional && !c.commander;
    }).forEach((card: any) => {
        for (let i = 0; i < card.num_instances; i++) {
            let tmpId = additionalId * 100 + 1;
            // register card ID
            additionalDeck.DeckIDs.push(tmpId);

            // register card object
            additionalDeck.ContainedObjects.push(getCardObject(tmpId, card.name))

            // register card visual object
            additionalDeck.CustomDeck[String(additionalId)] = card.getTabletopCard();
            additionalId += 1;
        }
    });

    // Handle commander, put on top of stack
    if (commanderIndex !== -1) {
        console.log("Handle commander");
        let tmpCard = cards[commanderIndex];
        let tmpId = additionalId * 100 + 1;
        // register card ID
        additionalDeck.DeckIDs.push(tmpId);

        // register card object
        additionalDeck.ContainedObjects.push(getCardObject(tmpId, tmpCard.name));

        // register card visual object
        additionalDeck.CustomDeck[String(additionalId)] = tmpCard.getTabletopCard();
    }

    // console.log(mainDeck);
    // console.log(additionalDeck);

    let Output = {
        "ObjectStates": [
            mainDeck
        ]
    }
    // Padding
    if (cardId > 1) {
        if (mainDeck.DeckIDs.length === 1) {
            let tmpId = cardId * 100 + 9;
            let tmpCard = new Card("Padding", 1, false);
            mainDeck.DeckIDs.unshift(tmpId)
            mainDeck.ContainedObjects.unshift(getCardObject(tmpId, tmpCard.name))
            mainDeck.CustomDeck[String(tmpId)] = tmpCard.getTabletopCard();
        }
        Output.ObjectStates = [mainDeck];
    }
    if (additionalId > 1) {
        if (additionalDeck.DeckIDs.length === 1) {
            let tmpId = additionalId * 100 + 8;
            let tmpCard = new Card("Padding", 1, false);
            additionalDeck.DeckIDs.unshift(tmpId);
            additionalDeck.ContainedObjects.unshift(getCardObject(tmpId, tmpCard.name));
            additionalDeck.CustomDeck[String(tmpId)] = tmpCard.getTabletopCard();
        }
        Output.ObjectStates.push(additionalDeck);
    }


    // Download prompt
    var jsonse = JSON.stringify(Output);
    var blob = new Blob([jsonse], {type: "application/json"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    let fileName = "";
    if (commanderIndex !== -1) {
        fileName = cards[commanderIndex].name + ".json";
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
