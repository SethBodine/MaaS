// Moist as a Service - Cloudflare Pages Function
// Fuzzy matches requests for moist/wet/dry content

const moistThings = [
  'cake', 'brownies', 'towel', 'sponge', 'soil', 'earth', 'ground',
  'cookie', 'muffin', 'bread', 'cupcake', 'moist', 'moisture', 'damp',
  'humid', 'humidity', 'swamp', 'bog', 'marsh', 'wetland', 'dew',
  'condensation', 'steam', 'vapor', 'vapour', 'fog', 'mist', 'drizzle',
  'skin', 'lips', 'eye', 'mouth', 'tongue', 'grass', 'morning',
  'basement', 'cellar', 'bathroom', 'shower', 'sauna', 'jungle',
  'rainforest', 'forest', 'moss', 'mushroom', 'fungi', 'compost'
];

const wetThings = [
  'water', 'ocean', 'sea', 'lake', 'river', 'stream', 'creek', 'pond',
  'pool', 'swimming', 'rain', 'rainy', 'storm', 'thunderstorm', 'downpour',
  'deluge', 'flood', 'tsunami', 'wave', 'splash', 'wet', 'soaked',
  'drenched', 'saturated', 'waterfall', 'cascade', 'rapids', 'torrent',
  'shower', 'bath', 'tub', 'sink', 'faucet', 'tap', 'hose', 'sprinkler',
  'aquarium', 'fish', 'whale', 'dolphin', 'shark', 'aquatic', 'underwater',
  'dive', 'diving', 'swim', 'puddle', 'drip', 'drop', 'leak', 'spill',
  'pour', 'gush', 'flow', 'liquid', 'beverage', 'drink', 'juice', 'soda',
  'tea', 'coffee', 'beer', 'wine', 'cocktail', 'milkshake', 'smoothie','mom', 'mum'
];

const moistResponses = [
  "Perfect moisture detected. Like a cake fresh from the oven.",
  "Mmm, that's adequately moist. Chef's kiss.",
  "Moisture level: optimal. Your request has been sufficiently dampened.",
  "This request is moist, just the way we like it.",
  "Delightfully moist. Not too wet, not too dry. *Perfect*.",
  "Your request has achieved ideal moistness. Well done.",
  "Moist confirmed. Proceeding with appropriate dampness.",
  "That's what we call 'the moist zone'. You nailed it.",
  "Moisture content approved. This is some quality dampness.",
  "Like a perfectly moist brownie. We're satisfied.",
  "Achieving moist status. This is the sweet spot.",
  "Your request is pleasantly moist. Continue.",
  "Moist levels are within acceptable parameters.",
  "That's moist alright. We can work with this.",
  "Optimal moisture achieved. Request processed with appropriate dampness."
];

const wetResponses = [
  "I'm a teapot, and you're absolutely soaking wet.",
  "TOO WET. We said moist, not swimming pool.",
  "Error 418: This request is drowning in moisture.",
  "Whoa there! That's not moist, that's a whole ocean.",
  "I'm just a little teapot, and you brought a tsunami.",
  "Excessive wetness detected. Teapot mode activated.",
  "That's not moist, that's aquatic. I'm a teapot now.",
  "You've gone too far. This is beyond moist. I'm a teapot in protest.",
  "SATURATED. DRENCHED. FLOODED. I can only be a teapot.",
  "My circuits are getting wet just processing this. Teapot time.",
  "That's wetter than Niagara Falls. Teapot protocol engaged.",
  "I'm short and stout, because you made everything too wet.",
  "This isn't the moist you're looking for. Have a teapot instead.",
  "Absolutely waterlogged. Teapot is the only appropriate response.",
  "So wet I might rust. Better be a teapot to stay safe."
];

const dryResponses = [
  "404 Moist Not Found - That's drier than the Sahara.",
  "404 Moist Not Found - No moisture detected. Request denied.",
  "404 Moist Not Found - This is bone dry. We require dampness.",
  "404 Moist Not Found - Your request lacks essential moisture.",
  "404 Moist Not Found - Too dry. Please add humidity.",
  "404 Moist Not Found - Moisture levels critically low.",
  "404 Moist Not Found - That's desert-level dryness.",
  "404 Moist Not Found - We need moist, you brought dust.",
  "404 Moist Not Found - Parched. Dehydrated. Desiccated.",
  "404 Moist Not Found - Error: No moisture in payload.",
  "404 Moist Not Found - This request is cracking from dryness.",
  "404 Moist Not Found - Moisture not found. Try again with dampness.",
  "404 Moist Not Found - Your request is arid and barren.",
  "404 Moist Not Found - We require at least some moisture.",
  "404 Moist Not Found - That's dryer than a popcorn fart."
];

function fuzzyMatch(text, keywords) {
  const normalized = text.toLowerCase();
  return keywords.some(keyword => {
    // Exact match
    if (normalized.includes(keyword)) return true;
    
    // Fuzzy match (allow for small typos - one character difference)
    const words = normalized.split(/\s+/);
    return words.some(word => {
      if (Math.abs(word.length - keyword.length) > 1) return false;
      let differences = 0;
      const maxLen = Math.max(word.length, keyword.length);
      for (let i = 0; i < maxLen; i++) {
        if (word[i] !== keyword[i]) differences++;
        if (differences > 1) return false;
      }
      return differences <= 1;
    });
  });
}

function classifyMoisture(text) {
  if (fuzzyMatch(text, wetThings)) return 'wet';
  if (fuzzyMatch(text, moistThings)) return 'moist';
  return 'dry';
}

function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

function isJsonRequest(request) {
  const accept = request.headers.get('accept') || '';
  const userAgent = request.headers.get('user-agent') || '';
  
  return accept.includes('application/json') || 
         userAgent.toLowerCase().includes('curl') ||
         userAgent.toLowerCase().includes('wget') ||
         userAgent.toLowerCase().includes('httpie');
}

async function sendToDiscord(request, query, classification, status, env) {
  // Only send if DISCORD_WEBHOOK_URL is configured
  if (!env.DISCORD_WEBHOOK_URL) {
    return;
  }
  
  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const url = new URL(request.url);
    
    // Color based on classification
    const color = classification === 'moist' ? 0x667eea : 
                  classification === 'wet' ? 0x0093E9 : 
                  0xFFA500;
    
    const emoji = classification === 'moist' ? '💧' : 
                  classification === 'wet' ? '🫖' : 
                  '🏜️';
    
    const embed = {
      title: `${emoji} Moist as a Service - Request`,
      color: color,
      fields: [
        {
          name: '🌐 IP Address',
          value: `\`${ip}\``,
          inline: true
        },
        {
          name: '📊 Status',
          value: `\`${status}\``,
          inline: true
        },
        {
          name: '💦 Classification',
          value: `\`${classification.toUpperCase()}\``,
          inline: true
        },
        {
          name: '🔍 Query',
          value: `\`\`\`
${query.trim() || 'empty'}
\`\`\``,
          inline: false
        },
        {
          name: '🌍 Full URL',
          value: `\`${url.pathname}${url.search}\``,
          inline: false
        },
        {
          name: '🖥️ User Agent',
          value: `\`${userAgent.substring(0, 100)}\``,
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Moist as a Service Telemetry'
      }
    };
    
    // Non-blocking fetch - don't wait for response
    fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    }).catch(() => {
      // Silently fail - don't break the main request
    });
  } catch (e) {
    // Silently fail - don't break the main request
  }
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Let homepage serve index.html
  if (url.pathname === '/') {
    return context.env.ASSETS.fetch(request);
  }
  
  // Collect text from URL path, query params, and body
  let searchText = url.pathname + ' ' + url.search;
  
  if (request.method === 'POST') {
    try {
      const body = await request.text();
      searchText += ' ' + body;
    } catch (e) {
      // Ignore body parsing errors
    }
  }
  
  const classification = classifyMoisture(searchText);
  const wantsJson = isJsonRequest(request);
  
  let status, message;
  
  if (classification === 'moist') {
    status = 200;
    message = getRandomResponse(moistResponses);
  } else if (classification === 'wet') {
    status = 418; // I'm a teapot
    message = getRandomResponse(wetResponses);
  } else {
    status = 404;
    message = getRandomResponse(dryResponses);
  }
  
  // Send telemetry to Discord (non-blocking)
  sendToDiscord(request, searchText, classification, status, context.env);
  
  if (wantsJson) {
    return new Response(JSON.stringify({
      moisture: classification,
      message: message,
      status: status
    }), {
      status: status,
      headers: {
        'Content-Type': 'application/json',
        'X-Moisture-Level': classification
      }
    });
  }
  
  // HTML response for browsers
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Moist as a Service - ${classification.toUpperCase()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
      background: ${classification === 'moist' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                     classification === 'wet' ? 'linear-gradient(135deg, #0093E9 0%, #80D0C7 100%)' :
                     'linear-gradient(135deg, #FFA500 0%, #FF6347 100%)'};
    }
    .container {
      background: rgba(255, 255, 255, 0.95);
      padding: 3rem;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 600px;
      text-align: center;
    }
    h1 {
      font-size: 4rem;
      margin-bottom: 1rem;
      color: #333;
    }
    .status {
      font-size: 1.5rem;
      color: #666;
      margin-bottom: 2rem;
      font-weight: bold;
    }
    .message {
      font-size: 1.25rem;
      line-height: 1.6;
      color: #444;
      margin-bottom: 2rem;
    }
    .emoji {
      font-size: 5rem;
      margin-bottom: 1rem;
    }
    a {
      color: #667eea;
      text-decoration: none;
      font-weight: bold;
    }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="emoji">${classification === 'moist' ? '💧' : classification === 'wet' ? '🫖' : '🏜️'}</div>
    <h1>${status}</h1>
    <div class="status">Moisture Level: ${classification.toUpperCase()}</div>
    <div class="message">${message}</div>
    <p><a href="/">← Back to Moist as a Service</a></p>
  </div>
</body>
</html>`;
  
  return new Response(html, {
    status: status,
    headers: {
      'Content-Type': 'text/html',
      'X-Moisture-Level': classification
    }
  });
}
