import Card from '../Card';
import {CardType} from "../Tabletop";

it('can be constructed', () => {
    const card = new Card("Saltblast", 2, CardType.Default);
    expect(card.name).toEqual('Saltblast');
    expect(card.numInstances).toEqual(2);
});