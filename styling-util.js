export function stylingUtil(config = { useDarkerHues: 0 }) {
  // Define warm and cool colors grouped into high contrast categories
  const warmColors = [
    '#f79256', '#f56d4e', '#f92f3a',  // Reds
    '#fcb1a6', '#ff6a00', '#f3b14c',  // Oranges
    '#e47b40', '#e7b268', '#f5b56f',  // Browns
    '#fa4a8c', '#f76492', '#f1c3b1',  // Pinks
  ];

  const coolColors = [
    '#00b2ca', '#1d4e89', '#3792b2',  // Blues
    '#7dcfb6', '#00aaff', '#5e99b2',  // Greens
    '#4682b4', '#7fbdc1', '#739ec7',  // Purples
    '#4c8c9e', '#3f7c87', '#00bfae',  // Teals
  ];

  // Function to generate a color with configurable darkness
  const getColor = (hex, darkenFactor) => {
    // For simplicity, use hex directly
    return hex;
  };

  // Get all cards
  const cards = document.querySelectorAll('.cards-container .card');

  // Group cards by part-group-<id> class
  const partGroups = {};
  cards.forEach(card => {
    const partGroupClass = Array.from(card.classList).find(cls => cls.startsWith('part-group-'));
    if (partGroupClass) {
      const groupName = partGroupClass; // e.g., part-group-1
      if (!partGroups[groupName]) {
        partGroups[groupName] = [];
      }
      partGroups[groupName].push(card);
    }
  });

  // Apply border styles to each card and card-header
  let colorSwitch = true; // Start with a warm color (true for warm, false for cool)
  let warmIndex = 0;
  let coolIndex = 0;

  Object.keys(partGroups).forEach((groupName, index) => {
    const cardsInGroup = partGroups[groupName];

    // Alternating between high-contrast warm and cool colors
    let color;
    if (colorSwitch) {
      color = warmColors[warmIndex % warmColors.length];
      warmIndex++; // Move to the next warm color
    } else {
      color = coolColors[coolIndex % coolColors.length];
      coolIndex++; // Move to the next cool color
    }

    // Switch the flag to alternate for the next group
    colorSwitch = !colorSwitch;

    // Get the color for the group with optional darkness adjustment
    const groupColor = getColor(color, config.useDarkerHues);

    // Apply solid color border to each card
    cardsInGroup.forEach(card => {
      card.style.border = `3px solid ${groupColor}`;  // Solid border color for the card
      card.style.backgroundColor = `${groupColor}`;  // Solid border color for the card
    });

    // Apply solid color border to each card-header
    cardsInGroup.forEach(card => {
      const cardHeader = card.querySelector('.card-header');
      if (cardHeader) {
        cardHeader.style.borderBottom = `3px solid ${groupColor}`;  // Solid border for the header
      }
    });
  });

  // Add hex value inside each .card for visibility
  cards.forEach((card, index) => {
    // Create a span element to hold the hex value
    const hexDisplay = document.createElement('span');

    // Set the hex value text
    const color = index % 2 === 0 ? warmColors[index % warmColors.length] : coolColors[index % coolColors.length];
    hexDisplay.textContent = color;  // Set text to hex value

    // Optionally style the span to make it visible on the card
    hexDisplay.style.position = 'absolute';
    hexDisplay.style.bottom = '10px';
    hexDisplay.style.right = '10px';
    hexDisplay.style.backgroundColor = 'white';
    hexDisplay.style.padding = '2px 5px';
    hexDisplay.style.borderRadius = '4px';
    hexDisplay.style.fontSize = '12px';

    // Append the span to the card
    card.appendChild(hexDisplay);
  });
}
