export function vdom(container = null) {
  /**
   * @type {HTMLElement} root
   * 
   */
  let root = container;
  let vtree = null;
  let nodeIdCounter = 0;
  /**
  * @typedef {Object} Handler
  * @property {string} eventType - The HTML event type (e.g., 'click', 'mouseenter')
  * @property {function} handlerFunc - The event handler function
  */

  /**
   * @type {Handler[]}
   */
  let handlers = []

  function node(tag, props = {}, children = []) {
    const flatChildren = children.flat().filter(child =>
      child !== null && child !== undefined && child !== false
    );
    const id = nodeIdCounter++
    // add handler to handlers array
    Object.entries(props).filter(([key, val]) => {
      if (key.startsWith('on') && typeof val === 'function') {
      }
      return key.startsWith('on') && typeof val === 'function'
    }).forEach(([key, val]) => {
      const eType = key.slice(2).toLowerCase()
      handlers.push({ eventType: eType, handlerFunc: val, id: id })
    })
    return {
      tag,
      props: { ...props, id },
      children: flatChildren.map(child =>
        typeof child === 'string' || typeof child === 'number'
          ? { type: 'text', value: String(child) }
          : child
      )
    };
  }

  function nodeToHTML(vnode) {
    // Handle text nodes
    if (vnode.type === 'text') {
      return escapeHTML(vnode.value);
    }

    // Handle element nodes
    const { tag, props, children } = vnode;

    const attrs = Object.entries(props || {})
      .filter(([key, value]) => {
        return typeof value !== 'function' &&
          typeof value !== 'object' &&
          value !== undefined &&
          value !== null;
      })
      .map(([key, value]) => {
        const attrName = key;
        return `${attrName}="${escapeHTML(String(value))}"`;
      });

    const attrString = attrs.join(' ');
    const openTag = attrString ? `<${tag} ${attrString}>` : `<${tag}>`;

    // Self-closing tags
    const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    if (voidElements.includes(tag)) {
      return openTag.slice(0, -1) + ' />';
    }

    // Convert children to HTML
    const childrenHTML = (children || [])
      .map(child => nodeToHTML(child))
      .join('');

    return `${openTag}${childrenHTML}</${tag}>`;
  }

  function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function delegateHandlers() {
    handlers.forEach((handler) => {
      const { eventType, handlerFunc } = handler;
      root.addEventListener(eventType, (e) => {
        if (e.target.id == handler.id) {
          handlerFunc()
        }
      })
    })
  }

  function render(newTree) {
    const freshRoot = root.cloneNode(true); // reset root to remove all event handlers on rerenders
    root.parentNode.replaceChild(freshRoot, root); // swap in DOM
    root = freshRoot
    vtree = newTree;
    delegateHandlers()
    root.innerHTML = nodeToHTML(vtree);
    handlers = [] // clear handlers used to make attachments after render
    nodeIdCounter = 0 // reset id counter
  }

  return {
    vtree,
    handlers,
    node,
    render
  }

}