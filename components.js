import { CollectionElement, Collection } from "./collection.js";
import { node } from "./app.js";

/**
 * @param {CollectionElement} card
 * @returns {node}
 */
export const Card = function (tag, props, children = []) {
  const { card, ...otherProps } = props;
  return node(tag, { ...otherProps }, [
    node('div', { class: 'card-header' }, ['Card']),
    ...children,
    node('div', { class: 'card-details' },
      Object.entries(card).map(([key, val], i) => {
        return node('div', { key: `${card.id}-${key}` }, [`${key}: ${val}`])
      })
    )
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
    ...children,
    node('h3', {}, [collection.name]),
    node('div', { class: 'cards-container' },
      cards.map((card, i) =>
        Card('div', { card: card, key: `card-${card.id}`, class: 'card' })
      )
    )
  ]);
}

export const Button = function (tag, props, children = []) {
  return node(tag, { ...props }, children)
}

export const ButtonRow = function (tag, props, children = []) {
  return node(tag, { ...props }, children)
}