import { vdom } from "./vdom.js"
import { Deck, ButtonRow, Button, DeckContainer } from "./components.js";
import { Collection } from "./collection.js";
import { stylingUtil } from "./styling-util.js";

// Initialize test collection and state with an active deck
export const testCollection = new Collection({ elementsList: ['a', 'a', 'b', 'c', 'd'] });
export let state = {
  decks: { [testCollection.id]: testCollection },
  activeDeckId: testCollection.id // Keep track of the active deck
};

const container = document.getElementById('app');
export const { vtree, handlers, node, render } = vdom(container);

// Set state function to update the state and re-render the app
export function setState(newState) {
  state = { ...state, ...newState };
  renderApp();
}

// Handle creating a new unique card and adding it to the deck
const handleNewUniqueCard = (activeDeck) => {
  const newElemList = activeDeck.addNewRandomElement();
  const newDeck = new Collection({ elementsList: [...newElemList], id: activeDeck.id, name: activeDeck.name });
  setState({ decks: { ...state.decks, [activeDeck.id]: newDeck } });
};

const handleActiveSelectActiveDeck = (deckId) => {
  setState({ activeDeckId: deckId });
  console.log('here at id ', deckId)
};

const handleNewDeck = () => {
  const newDeckIndex = Object.keys(state.decks).length + 1;
  const newDeckName = `Deck ${newDeckIndex}`;

  // Create a new deck with default name and an empty collection
  const newDeck = new Collection({ elementsList: [], name: `deck-${newDeckIndex}` });

  // Update state with the new deck
  setState({
    decks: {
      ...state.decks,
      [newDeck.id]: newDeck
    },
    activeDeckId: newDeck.id // Optionally set the new deck as active
  });
};

function renderApp() {
  const activeDeck = state.decks[state.activeDeckId]; // Get the active deck
  const decks = state.decks
  const vtree = node('div', { class: 'root' }, [
    node('div', { class: 'title' }, ['Deck calculator']),
    DeckContainer('div', { decks: decks, handleActiveDeckSelection: handleActiveSelectActiveDeck, handleNewDeck: handleNewDeck }),
    // Render the selected active deck
    Deck('div', { collection: activeDeck }, [
      ButtonRow('div', {}, [
        Button('button', {
          onClick: () => handleNewUniqueCard(activeDeck),
          class: 'card-button add-new-button'
        }, ['Add New Card'])
      ]),
    ])
  ]);

  render(vtree);
  stylingUtil();
  console.log('handlers', handlers)
  console.log('state ', state)
}

// Initial render
renderApp();
