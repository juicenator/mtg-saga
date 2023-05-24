import Card from './Card';

export type TabletopOutput = {
    "ObjectStates": DeckBox[]
}

export type DeckBox = {
    "Name": "DeckCustom",
    "ContainedObjects": TabletopObject[],
    "DeckIDs": number[],
    "CustomDeck": { [key: number]: TabletopCard },
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
    Sideboard = "sideboard"
}

export enum CardType {
    Default = "default",
    Additional = "additional",
    Commander = "commander",
    Sideboard = "sideboard",
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
        case DeckType.Sideboard: {
            posX = 0;
            posZ = -4;
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

export function generateTabletopOutput(cards: Card[], hasAdditional: boolean, hasCommander: boolean, hasSideboard: boolean): TabletopOutput {
    let deckTypes = [DeckType.Default];
    // Prepare deckboxes
    let deckBoxes: { [key in DeckType]?: DeckBox; } = {};
    deckBoxes[DeckType.Default] = getDeckBox(DeckType.Default);

    if (hasAdditional) {
        deckBoxes[DeckType.Additional] = getDeckBox(DeckType.Additional);
        deckTypes.push(DeckType.Additional);
    }

    if (hasCommander) {
        deckBoxes[DeckType.Commander] = getDeckBox(DeckType.Commander);
        deckTypes.push(DeckType.Commander);
    }

    if (hasSideboard) {
        deckBoxes[DeckType.Sideboard] = getDeckBox(DeckType.Sideboard);
        deckTypes.push(DeckType.Sideboard);
    }

    console.log("Building JSON");
    let cardIds: { [key in DeckType]: number; } = {
        [DeckType.Default]: 1,
        [DeckType.Additional]: 1,
        [DeckType.Commander]: 1,
        [DeckType.Sideboard]: 1
    };
    let cardOffsets = 0;

    deckTypes.forEach((deckType) => {
        const deckboxes = deckBoxes[deckType];
        // Typescript guard. Bit weird but this is needed.
        if(!deckboxes){
            return;
        }

        console.log("Handle deck type: " + deckType);

        // select cards from one of the decktypes
        cards.filter((c) => {
            return (c.cardType.toString() === deckType);
        }).forEach((card: Card) => {
            // insert multiple copies of a card
            for (let i = 0; i < card.numInstances; i++) {
                let tmpCardId = cardIds[deckType] * 100 + cardOffsets;
                card.setId(tmpCardId);

                // register card ID
                deckboxes.DeckIDs.push(tmpCardId);

                // register card object
                deckboxes.ContainedObjects.push(card.getCardObject());

                // register card visual object
                deckboxes.CustomDeck[cardIds[deckType]] = card.getTabletopCard();
                cardIds[deckType] += 1;
            }
        });

        // Padding if needed
        if (cardIds[deckType] <= 2) {
            let tmpCardId = cardIds[deckType] * 100 + cardOffsets;
            let tmpCard = new Card("Padding", 1, CardType.Default);
            tmpCard.setId(tmpCardId);
            deckboxes.DeckIDs.unshift(tmpCardId);
            deckboxes.ContainedObjects.unshift(tmpCard.getCardObject());
            deckboxes.CustomDeck[cardIds[deckType]] = tmpCard.getTabletopCard();
        }
        // Offset for different stack ids
        cardOffsets += 1;
    });
    
    let objectStates = [deckBoxes[DeckType.Default]];
    if (hasAdditional && deckBoxes[DeckType.Additional]) objectStates.push(deckBoxes[DeckType.Additional]);
    if (hasCommander && deckBoxes[DeckType.Commander]) objectStates.push(deckBoxes[DeckType.Commander]);
    if (hasSideboard && deckBoxes[DeckType.Sideboard]) objectStates.push(deckBoxes[DeckType.Sideboard]);

    return {
        "ObjectStates": objectStates
    }
}