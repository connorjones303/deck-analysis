
/**
 * @class
 */
class Part {
  constructor({ name, sizeCategory, id }) {
    this.name = name;
    this.sizeCategory = sizeCategory;
    this.id = id;
  }
}
/**
 * @class
 */
class CollectionElement {
  constructor({ name, id, partId, memberId }) {
    this.name = name;
    this.id = id; // primary id
    this.partId = partId; // associated part
    this.memberId = memberId; // [x, outOf] - x out of n
  }
}
/**
 * A collection that manages elements organized into parts with partition-based structure
 * @class
 */
class Collection {
  /**
   * Creates a new Collection instance
   * @param {number[]} [options.partition=null] - Array representing partition structure
   * @param {CollectionElement[string]} [options.elementsList=null] - Array of element names to initialize from
   * @param {string} [options.name=null] - Name of the collection
   */
  constructor({ partition = null, elementsList = null, name = null, id = null } = {}) {
    this.id = id ? id : this.generateUUID(); // create new collection with same id
    this.name = name || 'My Deck';
    this.partition = [0]; // Default partition
    this.size = 0;
    this.elements = {}; // Map of unique primary ids to CollectionElements
    this.parts = {}; // Map of unique ids to Parts

    if (elementsList !== null) {
      this._initCollectionFromCollectionElements(elementsList);
    } else {
      this._initCollectionFromPartition(partition);
    }
  }

  /**
   * Generates a UUID v4 string
   * @returns {string} A randomly generated UUID
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Initializes the collection from a partition array
   * @private
   * @param {number[]} partition - Array where each index represents part size category and value represents count
   * @returns {void}
   */
  _initCollectionFromPartition(partition) {
    if (!partition) return;

    this.parts = {}; // re-init to empty
    this.elements = {}; // re-init to empty
    this.partition = partition;
    let elementId = 0;
    let uniquePartId = 0;

    for (let i = 0; i < partition.length; i++) {
      const partCategory = partition[i];
      const partSizeCategory = i + 1;

      for (let j = 1; j <= partCategory; j++) {
        uniquePartId += 1;
        this.parts[uniquePartId] = new Part({
          name: `unique part ${uniquePartId}`,
          sizeCategory: partSizeCategory,
          id: uniquePartId
        });
        this.size += partSizeCategory;

        for (let partMember = 1; partMember <= partSizeCategory; partMember++) {
          elementId += 1;
          const newElemName = `unique elem ${elementId}`;
          this.elements[elementId] = new CollectionElement({
            name: newElemName,
            id: elementId,
            partId: uniquePartId,
            memberId: [partMember, partSizeCategory] // [x, outOf]
          });
        }
      }
    }
  }

  /**
   * Initializes the collection from a list of element names
   * @private
   * @param {string[]} elementsList - Array of element names (duplicates will be grouped into parts)
   * @returns {void}
   */
  _initCollectionFromCollectionElements(elementsList) {
    const elemDict = {}; // key: elem name, val: number of duplicate elems in list
    let largestDuplicate = 1;

    // Count duplicates
    for (const elemName of elementsList) {
      if (elemName in elemDict) {
        elemDict[elemName] += 1;
        if (elemDict[elemName] > largestDuplicate) {
          largestDuplicate = elemDict[elemName];
        }
      } else {
        elemDict[elemName] = 1;
      }
    }

    const tupleBuilder = new Array(largestDuplicate).fill(0);
    let elemId = 0;
    this.parts = {}; // re-init to empty
    this.elements = {}; // re-init to empty

    let partIndex = 0;
    for (const [elemName, partSizeCategory] of Object.entries(elemDict)) {
      const partId = partIndex + 1;
      this.parts[partId] = new Part({
        name: elemName,
        sizeCategory: partSizeCategory,
        id: partId
      });

      // Generate elements for this part
      for (let j = 1; j <= partSizeCategory; j++) {
        elemId += 1;
        this.elements[elemId] = new CollectionElement({
          id: elemId,
          partId: partId,
          memberId: [j, partSizeCategory], // [x, outOf]
          name: elemName
        });
      }

      tupleBuilder[partSizeCategory - 1] += 1;
      partIndex++;
    }

    this.partition = tupleBuilder.slice(0, largestDuplicate);
    this.size = elementsList.length;
  }

  /**
   * Returns an array of all element names in the collection
   * @returns {string[]} Array containing the names of all elements
   */
  listCollectionElements() {
    const elemList = [];
    const elems = this.elements;
    for (const key in elems) {
      const name = elems[key].name;
      elemList.push(name);
    }
    return elemList;
  }

  /**
   * Adds a new element to the collection
   * @param {string} element - The name of the element to add
   * @returns {void}
   */
  addElement(elementName) {
    // element is (string) of the name of the elem
    const oldElemsList = this.listCollectionElements();
    const newElemsList = [...oldElemsList, elementName];
    return newElemsList
    // avoid changing obj directly for now
    // this._initCollectionFromCollectionElements(newElemsList);
  }

  /**
   * Removes the first occurrence of an element from the collection
   * @param {string} element - The name of the element to remove
   * @returns {void}
   */
  removeElement(elementName) {
    // element is (string) of the name of the elem
    const oldElemsList = this.listCollectionElements();
    const newElemsList = [];
    let found = false;

    for (const elem of oldElemsList) {
      if (!found && elem === elementName) {
        // skip appending new list on first occurrence
        found = true;
      } else {
        newElemsList.push(elem);
      }
    }
    return newElemsList
    // avoid changing obj directly for now
    // this._initCollectionFromCollectionElements(newElemsList);
  }
}

// Export for use in other modules
export { Collection, CollectionElement, Part };

// Test code (comment out when using as module)
/*
console.log();
const deck2 = new Collection({
  elementsList: ['a', 'a', 'b', 'a', 'd', 'd', 'c', 'c', 'e', 'a', 'b', 'f', 'g', 'b']
});
console.log(deck2);
console.log();
deck2.addCollectionElement('x');
console.log(deck2);
console.log();
deck2.addCollectionElement('xx');
console.log(deck2);
console.log();
deck2.addCollectionElement('xxx');
console.log(deck2);
console.log();
deck2.removeCollectionElement('f');
console.log(deck2);
console.log();
*/