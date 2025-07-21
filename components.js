import { CollectionElement, Collection } from "./collection.js";
import { node, state, setState, testCollection } from "./app.js";

/**
 * @param {CollectionElement} card 
 */
const handleDeleteCardSelf = (card) => {
  const name = card.name
  const oldDeck = state.decks[testCollection.id];
  if (!oldDeck.listCollectionElements().includes(name)) { return }
  const newElems = oldDeck.removeElement(name);
  const newDeck = new Collection({ elementsList: newElems, id: oldDeck.id });
  setState({ decks: { ...state.decks, [oldDeck.id]: newDeck } });
};

/**
 * @param {CollectionElement} card 
 */
const handleAddCardSelf = (card) => {
  const name = card.name
  const oldDeck = state.decks[testCollection.id];
  if (!oldDeck.listCollectionElements().includes(name)) { return }
  const newElems = oldDeck.addElement(name);
  const newDeck = new Collection({ elementsList: newElems, id: oldDeck.id });
  setState({ decks: { ...state.decks, [oldDeck.id]: newDeck } });
};

/**
 * @param {string} tag - html element tag (e.g <div>)
 * @param {Object} props - any other props
 * @param {CollectionElement} props.card - The card data object
 * @param {Array} [children=[]] - Child elements
 * @returns {node}
 */
export const Card = function (tag, props, children = []) {
  const { card, ...otherProps } = props;
  return node(tag, { ...otherProps }, [
    node('div', { class: 'card-button-container' }, [
      node('button', {
        class: 'card-button add-button',
        onClick: () => handleAddCardSelf(card)
      }, ['Add']),
      node('button', {
        class: 'card-button delete-button',
        onClick: () => handleDeleteCardSelf(card)
      }, ['Remove'])
    ]),
    node('div', { class: 'card-header' }, ['Card']),
    node('div', { class: 'card-details' },
      Object.entries(card).map(([key, val], i) => {
        return node('div', { key: `${card.id}-${key}` }, [`${key}: ${val}`])
      })
    ),
    ...children
  ])
}

/**
 * @param {Object} props
 * @param {Collection} props.collection
 * @param {*} props.otherProps
 */
export const Deck = function (tag, props, children = []) {
  const { collection, ...otherProps } = props;
  const cards = Object.values(collection.elements);

  return node(tag, { class: 'deck-container', ...otherProps }, [
    node('h3', {}, [collection.name]),
    ...children,
    node('div', { class: 'cards-container' },
      cards.map((card, i) =>
        Card('div', { card: card, key: `card-${card.id}`, class: `card part-group-${card.partId}` })
      )
    )
  ]);
}

export const Button = function (tag, props, children = []) {
  return node(tag, { ...props }, children)
}

export const ButtonRow = function (tag, props, children = []) {
  return node(tag, { class: 'buttonRow', ...props }, children)
}

/**
 * @param {string} tag - HTML element tag (e.g <div>)
 * @param {Object} props - Props for the component
 * @param {Object} props.decks - The collection of decks
 * @param {Function} props.handleDeckSelection - The function to handle deck selection
 * @param {Array} [children=[]] - Child elements
 * @returns {node}
 */
export const DeckContainer = function (tag, props, children = []) {
  const { decks, handleActiveDeckSelection, handleNewDeck, ...otherProps } = props;
  console.log('decks that container uses ', decks)

  return node(tag, { class: 'deck-container', ...otherProps }, [
    ...children,
    node('div', { class: 'decks' },
      Object.values(decks).map((deck, i) => {
        console.log(deck.id)
        return (node('button', {
          key: `deck-${deck.id}`,
          class: 'deck-select-button',
          onClick: () => handleActiveDeckSelection(deck.id)
        }, [
          node('h3', {}, [deck.name])
        ]))
      }
      )
    ),
    Button('button', {
      onClick: handleNewDeck, // Calls the function to create a new deck
      class: 'card-button add-new-button'
    }, ['Add New Deck'])
  ]);
};
