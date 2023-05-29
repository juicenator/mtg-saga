import Card, { DEFAULT_CARD_BACK_IMAGE_URL } from './Card';
import { CardType, generateTabletopOutput } from './Tabletop';
import { getDeckFromURL } from './DeckURL';
import { downloadPrompt } from './Utils';
import { isValidHttpUrl } from './Utils';

const DEFAULT_RESPONSE = "";
const COMMANDER_INDICATORS = ["!Commander"];

async function performQueries(promises: any[]) {
    return Promise.all(promises);
}

function isLineEmpty(line: string) {
    return line === "" || line.startsWith("//") || line.startsWith("#");
}

function cleanLine(line: string) {
    return line.split("#")[0].trim();
}

async function download(form: any): Promise<string> {
    // single forms
    let commander: string = form.commander;
    let partner: string = form.partner;
    let cardBack: string = form.cardback.trim();
    if (!isValidHttpUrl(cardBack)) {
        cardBack = DEFAULT_CARD_BACK_IMAGE_URL;
    }

    // multiline forms
    let decklistForm: string = form.decklist;
    let sideboardForm: string = form.sideboard;

    // keep track of cards and commanders
    let commanderIndices: number[] = [];
    let promises: any[] = [];
    let cards: Card[] = [];
    let commandersFromForm: Card[] = [];

    // final checks
    if (commander === "" && decklistForm === "") {
        return DEFAULT_RESPONSE;
    }
    let hasSideboard = sideboardForm !== "";

    // start parsing
    let decklist: string[] = decklistForm.split("\n");
    let sideboard: string[] = sideboardForm.split("\n");

    // Handle URLs
    if (isValidHttpUrl(decklist[0])) {
        decklist = await getDeckFromURL(decklist[0]);
    }

    // Process but do not commit commanders
    [commander, partner].forEach((line: string, index: number) => {
        if (isLineEmpty(line)) return;
        let tmpCard = Card.fromLine(cleanLine(line));
        tmpCard.setBackUrl(cardBack);
        tmpCard.setCardType(CardType.Commander);
        commandersFromForm.push(tmpCard);
    });

    // Build decklist with queries
    decklist.forEach((line: string, index: number) => {
        if (isLineEmpty(line)) return;
        let tmpCard = Card.fromLine(cleanLine(line));
        tmpCard.setBackUrl(cardBack);
        let isCommander = false;

        // replace processed commanders when relevant
        commandersFromForm = commandersFromForm.filter((commander: Card) => {
            if (commander.name !== tmpCard.name) {
                return true;
            } else {
                isCommander = true;
                return false;
            }
        });

        // process special commander flags
        for (const indicator of COMMANDER_INDICATORS) {
            if (line.includes(indicator)) {
                isCommander = true;
                break;
            }
        }

        cards.push(tmpCard);
        promises.push(tmpCard.getCardPromise());
        if (isCommander) {
            tmpCard.setCardType(CardType.Commander);
            commanderIndices.push(index);
        }
    });

    // Commit remaining commanders
    commandersFromForm.forEach((commander: Card) => {
        cards.push(commander);
        promises.push(commander.getCardPromise());
        commanderIndices.push(cards.length);
    });

    // Parse sideboard
    sideboard.forEach((line: string, index: number) => {
        if (isLineEmpty(line)) return;
        let tmpCard = Card.fromLine(cleanLine(line));
        tmpCard.setBackUrl(cardBack);
        tmpCard.setCardType(CardType.Sideboard);

        cards.push(tmpCard);
        promises.push(tmpCard.getCardPromise());
    });

    // collect
    await performQueries(promises);

    // Postprocess tokens, flip and additional cards
    let postPromises: any[] = [];
    let tokens: { [key: string]: boolean } = {};
    let flips: { [key: string]: boolean } = {};

    cards.forEach(card => {
        // Handle tokens
        if (card.tokens.length !== 0) {
            card.tokens.forEach((token: any) => {
                // if this token is already present in the list.
                if (token.uri in tokens) {
                    return;
                }
                tokens[token.uri] = true;
                let tmpCard = new Card("", 1, CardType.Additional);
                tmpCard.setUri(token.uri);
                cards.push(tmpCard);
                postPromises.push(tmpCard.getCardPromise());
            })
        }
        // Handle flip cards
        if (card.cardType === CardType.Flip) {
            // if we already have a double backed token for this card we just modify this one to go in the main deck.
            if (card.name in flips) {
                card.setCardType(CardType.Default);
                card.setBackUrl("");
                return;
            }

            let tmpCard = new Card(card.name, card.numInstances, card.cardType);
            Object.assign(tmpCard, card);
            tmpCard.setBackUrl(cardBack); // reset to cardback
            tmpCard.setCardType(CardType.Default); // add a copy with hidden back to main deck
            cards.push(tmpCard);

            // make sure 1 double faced card gets put in the token stack
            card.setCardType(CardType.Additional);
            card.setNumInstances(1);
            flips[card.name] = true;
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
    // Return before download prompt
    if (errors.length > 0) {
        return errors.join("\n")
    }

    // Build JSON structure
    let hasCommander = commanderIndices.length > 0;
    let hasAdditional = Object.keys(tokens).length > 0;
    let tabletopOutput = generateTabletopOutput(cards, hasAdditional, hasCommander, hasSideboard);
    let fileName = "";

    if (hasCommander) {
        fileName = commanderIndices.map((index: number) => {
            return cards[index].name;
        }).join(" ⋅ ") + ".json";
    } else {
        fileName = cards[0].name + ".json";
    }

    downloadPrompt(fileName, tabletopOutput);
    return DEFAULT_RESPONSE;
}

export default download
