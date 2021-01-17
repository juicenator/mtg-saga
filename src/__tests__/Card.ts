import Card from '../Card';
import {CardType} from "../Tabletop";

it('can be constructed', () => {
    const card = new Card("Saltblast", 2, CardType.Default);
    expect(card.name).toEqual('Saltblast');
    expect(card.numInstances).toEqual(2);
});

it('fromLine factory can parse MTGA format, with comma', () => {
   const card = Card.fromLine("1 Animar, Soul of Elements (A25) 196");
   expect(card.name).toEqual('Animar, Soul of Elements');
   expect(card.numInstances).toEqual(1);
   expect(card.setCode).toEqual('A25');
   expect(card.collectorNumber).toEqual("196");
});

it('fromLine factory can parse MTGA format, with comma', () => {
    const card = Card.fromLine("1 Acidic Slime (ZNC) 59");
    expect(card.name).toEqual('Acidic Slime');
    expect(card.numInstances).toEqual(1);
    expect(card.setCode).toEqual('ZNC');
    expect(card.collectorNumber).toEqual("59");
});

it('fromLine factory can parse MTGA format, with promo', () => {
   const card = Card.fromLine("1 Vivien, Monsters' Advocate (PIKO) 175p");
   expect(card.name).toEqual('Vivien, Monsters\' Advocate');
   expect(card.numInstances).toEqual(1);
   expect(card.setCode).toEqual('PIKO');
   expect(card.collectorNumber).toEqual("175p");
});

it('fromLine factory can parse MTGO format', () => {
   const card = Card.fromLine("1 Terastodon");
   expect(card.name).toEqual('Terastodon');
   expect(card.numInstances).toEqual(1);
   expect(card.setCode).toEqual('');
   expect(card.collectorNumber).toEqual('');
});

it('fromLine factory can parse MTGO format, with comma', () => {
   const card = Card.fromLine("1 Vivien, Monsters' Advocate");
   expect(card.name).toEqual('Vivien, Monsters\' Advocate');
   expect(card.numInstances).toEqual(1);
   expect(card.setCode).toEqual('');
   expect(card.collectorNumber).toEqual('');
});

it('fromLine factory will fallback to cardname', () => {
   const card = Card.fromLine("Saltblast");
   expect(card.name).toEqual('Saltblast');
   expect(card.numInstances).toEqual(1);
   expect(card.setCode).toEqual('');
   expect(card.collectorNumber).toEqual('');
});