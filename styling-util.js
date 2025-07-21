export function stylingUtil(config = { useDarkerHues: 0 }) {
  // Define numerical hue values for warm and cool colors
  const warmHues = [0, 30, 60, 90, 120, 150];  // Reds, oranges, yellows
  const coolHues = [180, 210, 240, 270, 300, 330]; // Blues, greens, purples

  // Function to generate HSL color with configurable darkness
  const getColor = (hue, darkenFactor) => {
    const lightness = 70 - darkenFactor;  // Adjust lightness to make color darker or lighter
    return `hsl(${hue}, 60%, ${lightness}%)`;
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
  Object.keys(partGroups).forEach((groupName, index) => {
    const cardsInGroup = partGroups[groupName];
    const isWarmGroup = index % 2 === 0; // Even groups get warm colors, odd get cool
    const colorRange = isWarmGroup ? warmHues : coolHues;

    // Pick a single hue for the entire group based on group index and apply darkness factor
    const hue = colorRange[index % colorRange.length];
    const groupColor = getColor(hue, config.useDarkerHues);

    // Apply solid color border to each card
    cardsInGroup.forEach(card => {
      card.style.border = `3px solid ${groupColor}`;  // Solid border color for the card
    });

    // Apply solid color border to each card-header
    cardsInGroup.forEach(card => {
      const cardHeader = card.querySelector('.card-header');
      if (cardHeader) {
        cardHeader.style.borderBottom = `3px solid ${groupColor}`;  // Solid border for the header
      }
    });
  });
}
