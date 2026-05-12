export const ECO_KNOWLEDGE_BASE = {
  "water": "Bengaluru faces significant water stress. Rainwater harvesting is mandatory for all new buildings. The city's lakes, like Bellandur and Varthur, are undergoing restoration to improve the water table.",
  "air": "Air quality in Bengaluru is often 'Moderate'. Metro expansion and switching to electric vehicles are key to reducing NO2 and PM2.5 levels from vehicular emissions.",
  "waste": "Segregating waste at source is compulsory in Bengaluru. Use green bins for wet waste, blue for dry, and red for domestic hazardous waste.",
  "metro": "The Namma Metro is a great way to reduce your carbon footprint. The Purple and Green lines connect major parts of the city, reducing road congestion.",
  "trees": "Bengaluru was once the 'Garden City'. We must protect the remaining tree canopy in areas like Cubbon Park and Lalbagh to combat the Urban Heat Island effect.",
  "harvesting": "Rainwater harvesting can provide up to 50% of a household's water needs in Bengaluru during the monsoon. It's a critical climate action for the city.",
  "solar": "Bengaluru gets ample sunlight. Installing solar water heaters and rooftop solar panels can significantly reduce your electricity bills and carbon footprint.",
  "composting": "Home composting of kitchen waste can reduce the load on the city's landfills by up to 60%. It also provides rich organic manure for your garden.",
  "garden": "Bengaluru is the 'Garden City'. You can start your own terrace garden to improve air quality and grow your own food.",
  "energy": "Bengaluru is a tech hub, but we need to save energy. Switching to LED bulbs and using 5-star rated appliances can save up to 30% of your power bill.",
  "plastic": "Single-use plastic is banned in Bengaluru. Always carry your own cloth bag when going to KR Market or local shops.",
  "traffic": "Bengaluru's traffic adds to climate change. Carpooling or using the Namma Metro can reduce your personal carbon emissions by over 50%.",
  "rain_harvest": "Rainwater harvesting isn't just a rule; it's a necessity for Bengaluru's future water security."
};

export const findResponse = (text) => {
  const query = text.toLowerCase();
  
  // Specific phrases
  if (query.includes("plastic") || query.includes("bag")) return ECO_KNOWLEDGE_BASE.plastic;
  if (query.includes("garden") || query.includes("plant")) return ECO_KNOWLEDGE_BASE.garden;
  if (query.includes("energy") || query.includes("electricity") || query.includes("power")) return ECO_KNOWLEDGE_BASE.energy;
  if (query.includes("traffic") || query.includes("car") || query.includes("bike")) return ECO_KNOWLEDGE_BASE.traffic;
  
  // Existing categories
  if (query.includes("water")) return ECO_KNOWLEDGE_BASE.water;
  if (query.includes("air") || query.includes("pollution")) return ECO_KNOWLEDGE_BASE.air;
  if (query.includes("waste") || query.includes("garbage")) return ECO_KNOWLEDGE_BASE.waste;
  if (query.includes("metro") || query.includes("transport") || query.includes("bus")) return ECO_KNOWLEDGE_BASE.metro;
  if (query.includes("tree")) return ECO_KNOWLEDGE_BASE.trees;
  if (query.includes("harvest")) return ECO_KNOWLEDGE_BASE.rain_harvest;
  if (query.includes("solar") || query.includes("sun")) return ECO_KNOWLEDGE_BASE.solar;
  if (query.includes("compost")) return ECO_KNOWLEDGE_BASE.composting;
  
  return "As your Bengaluru eco-assistant, I can help you with local environmental tips. Try asking about water, waste, air quality, or transport!";
};
