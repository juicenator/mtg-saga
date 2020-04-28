import Card from './Card';

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
            "rotZ": 180,
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
        return separated.slice(1, ).join(" ");
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
        "CardID": id * 100,
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
    let promises: any[] = [];
    let cards: any[] = [];
    let mainDeck = getDeckRepresentation(false);
    let additionalDeck = getDeckRepresentation(true);

    // Add commander if present
    if (commander !== "") {
        let tmpCard = new Card(commander, 1, true)
        cards.push(tmpCard);
    }

    // Build decklist with queries
    decklist.forEach((line: string) => {
        if (line === "") {
            return;
        }
        let numInstances = getNumInstances(line);
        let name = getName(line);
        let tmpCard = new Card(name, numInstances, false)
        cards.push(tmpCard);
        promises.push(tmpCard.getCardPromise());
    });

    // collect
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
                postPromises.push(tmpCard.getCardPromise())
            })
        }
        // Handle flip cards
        if (r.flip) {
            let tmpCard = {...r};
            tmpCard.setBackUrl(""); // reset to cardback
            tmpCard.additional = false;
            cards.push(tmpCard);
        }
    });

    // collect
    await performQueries(postPromises);

    // Build JSON structure
    console.log("Building JSON")

    // Handle normal cards
    console.log("Handle normal cards")
    let cardId = 1;
    cards.filter((c) => {
        return !c.additional
    }).forEach((card: any) => {
        for(let i = 0; i < card.num_instances; i++) {
            // register card ID
            mainDeck.DeckIDs.push(cardId * 100);

            // register card object
            mainDeck.ContainedObjects.push(getCardObject(cardId, card.name))

            // register card visual object
            mainDeck.CustomDeck[String(cardId)] = card.getTabletopCard();
            cardId += 1;
        }
    });

    //Handle additional cards
    console.log("Handle additional cards")
    let additionalId = 1;
    cards.filter((c) => {
        return c.additional
    }).forEach((card: any) => {
        for(let i = 1; i < card.num_instances; i++) {
            let tmpId = additionalId * 100 + 1;
            // register card ID
            additionalDeck.DeckIDs.push(tmpId);

            // register card object
            additionalDeck.ContainedObjects.push(getCardObject(tmpId, card.name))

            // register card visual object
            additionalDeck.CustomDeck[String(tmpId)] = card.getTabletopCard();
            additionalId += 1;
        }
    });

    // console.log(mainDeck);
    // console.log(additionalDeck);

    let Output = {
        "ObjectStates": [
            mainDeck
        ]
    }
    if(additionalId > 1) {
        Output.ObjectStates.push(additionalDeck);
    }

    // Download prompt
    var jsonse = JSON.stringify(Output);
    var blob = new Blob([jsonse], {type: "application/json"});
    var url  = URL.createObjectURL(blob);
    var a = document.createElement('a');
    let fileName = "";
    if (commander !== "") {
        fileName = commander +".json";
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
}

export default download
