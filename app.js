import { vdom } from "./vdom.js"
import { Deck, ButtonRow, Button } from "./components.js";
import { Collection } from "./collection.js";
import { stylingUtil } from "./styling-util.js";


export const testCollection = new Collection({ elementsList: ['a', 'a', 'b', 'c', 'd'] });
export let state = {
  decks: { [testCollection.id]: testCollection }
};

const container = document.getElementById('app');
export const { vtree, handlers, node, render } = vdom(container)

export function setState(newState) {
  state = { ...state, ...newState };
  renderApp();
}

const handleAddCard = () => {
  const oldDeck = state.decks[testCollection.id];
  console.log('deck id:', oldDeck.id);
  const oldElems = oldDeck.listCollectionElements();
  const newDeck = new Collection({ elementsList: [...oldElems, 'x'], id: oldDeck.id });
  setState({ decks: { ...state.decks, [oldDeck.id]: newDeck } });
};

const handleDeleteCard = () => {
  const oldDeck = state.decks[testCollection.id];
  if (!oldDeck.listCollectionElements().includes('x')) { return }
  const newElems = oldDeck.removeElement('x');
  const newDeck = new Collection({ elementsList: newElems, id: oldDeck.id });
  setState({ decks: { ...state.decks, [oldDeck.id]: newDeck } });
};

function renderApp() {
  const vtree = node('div', { class: 'root' }, [
    node('div', { class: 'title' }, ['Deck calculator']),
    ButtonRow('div', { class: 'buttonRow' }, [
      Button('button', {
        onClick: handleAddCard
      }, ['Add Card']),
      Button('button', {
        onClick: handleDeleteCard
      }, ['Delete Card'])
    ]),
    Deck('div', { collection: state.decks[testCollection.id] })
  ]);
  render(vtree);


  stylingUtil();
  console.log('handlers', handlers)
  console.log('state ', state)
}

// Initial render
renderApp();
console.log('init render app')