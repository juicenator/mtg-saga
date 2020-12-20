## MTG Saga - a Tabletop Simulator Deck generator
This is the code repository for [mtgsa.ga](https://mtgsa.ga).  
Any help is appreciated. See the [issues](https://github.com/antonsteenvoorden/mtg-saga/issues) for features and issues yet to be implemented. 

## Developing
This repository is written in [TypeScript](https://www.typescriptlang.org/) and requires the [Node Package Manager](https://www.npmjs.com/).  
To get started, first install dependencies listed in `package.json` by running `npm install`.  
Start your local development serve with `npm start`.

### Some explanations
Most of the logic is in the DeckBuilder.  
To add a new site, add a URL checker in DeckURL and make sure to add the correct parsing.  
Cards are represented as an object internally, each has the Scryfall API call to find the card.
Then, querying Scryfall is done with promises. We first build a list with all the queries. When executed, they then update the object to have the corresponding front and back images.  
Then, once we have a decklist full of objects we render the Tabletop Simulator object accordingly.

If you have any questions you can contact me at: inquiries (dot) atomic (at) gmail (dot) com 
