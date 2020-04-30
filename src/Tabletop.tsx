import Card from './Card';

export type TabletopOutput = {
    "ObjectStates": DeckBox[]
}

export type DeckBox = {
    "Name": "DeckCustom",
    "ContainedObjects": TabletopObject[],
    "DeckIDs": number[],
    "CustomDeck": {[key:string]:TabletopCard},
    "Transform": {}
}

export type TabletopCard = {
    "FaceURL": string,
    "BackURL": string,
    "NumHeight": number,
    "NumWidth": number,
    "BackIsHidden": boolean
}

export type TabletopObject = {
    "CardID": number,
    "Name": "Card",
    "Nickname": string,
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

// Default, Additional and Commander strings need to be equal
export enum DeckType {
    Default = "default",
    Additional = "additional",
    Commander = "commander",
}

export enum CardType {
    Default = "default",
    Additional = "additional",
    Commander = "commander",
    Flip = "flip"
}

function getDeckBox(deckType: DeckType): DeckBox {
    let posX = 0;
    let posZ = 0;

    switch (deckType as DeckType) {
        case DeckType.Additional: {
            posX = 4;
            posZ = 0;
            break;
        }
        case DeckType.Commander: {
            posX = 0;
            posZ = 4;
            break;
        }
    }
    
    return {
        "Name": "DeckCustom",
        "ContainedObjects": [],
        "DeckIDs": [],
        "CustomDeck": {},
        "Transform": {
            "posX": posX,
            "posY": 1,
            "posZ": posZ,
            "rotX": 0,
            "rotY": 180,
            "rotZ": 0,
            "scaleX": 1,
            "scaleY": 1,
            "scaleZ": 1
        }
    }
}

export function generateTabletopOutput(cards: Card[], hasAdditional:boolean, hasCommander:boolean): TabletopOutput {
    let deckTypes = [DeckType.Default];
    // Prepare deckboxes
    let deckBoxes: { [key: string]: DeckBox; } = {};
    deckBoxes[DeckType.Default] = getDeckBox(DeckType.Default);

    if(hasAdditional) {
        deckBoxes[DeckType.Additional] = getDeckBox(DeckType.Additional);
        deckTypes.push(DeckType.Additional);
    }

    if (hasCommander) {
        deckBoxes[DeckType.Commander] = getDeckBox(DeckType.Commander);
        deckTypes.push(DeckType.Commander);
    }

    console.log("Building JSON");
    let cardIds: { [key: string]: number; } = {};
    let cardOffsets = 0;

    deckTypes.forEach((deckType) => {
        console.log("Handle deck type: " + deckType);
        if (!(deckType in cardIds)) cardIds[deckType] = 1;
        cards.filter((c) => {
            return (c.cardType.toString() === deckType);
        }).forEach((card: any) => {
            for (let i = 0; i < card.num_instances; i++) {
                let tmpCardId = cardIds[deckType] * 100 + cardOffsets;
                card.setId(tmpCardId);

                // register card ID
                deckBoxes[deckType].DeckIDs.push(tmpCardId);

                // register card object
                deckBoxes[deckType].ContainedObjects.push(card.getCardObject())

                // register card visual object
                deckBoxes[deckType].CustomDeck[String(cardIds[deckType])] = card.getTabletopCard();
                cardIds[deckType] += 1;
            }
        });

        // Padding if needed
        if (cardIds[deckType] <= 1) {
            let tmpCardId = cardIds[deckType] * 100 + cardOffsets;
            let tmpCard = new Card("Padding", 1, CardType.Default);
            deckBoxes[deckType].DeckIDs.push(tmpCardId);
            deckBoxes[deckType].ContainedObjects.push(tmpCard.getCardObject());
            deckBoxes[deckType].CustomDeck[String(cardIds[deckType])] = tmpCard.getTabletopCard();
            tmpCard.setId(tmpCardId);
        }
        // Offset for different stack ids
        cardOffsets += 1;
    });
    let objectStates = [deckBoxes[DeckType.Default]];
    if (hasAdditional) objectStates.push(deckBoxes[DeckType.Additional]);
    if (hasCommander) objectStates.push(deckBoxes[DeckType.Commander]);

    return {
        "ObjectStates": objectStates
    }
}