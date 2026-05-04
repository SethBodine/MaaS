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
  'tea', 'coffee', 'beer', 'wine', 'cocktail', 'milkshake', 'smoothie', 'mom', 'mum'

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

const wrongMethodResponses = [
  "405 Method Not Allowed - Only GET requests are moist enough for us. This isn't a POST office.",
  "405 Method Not Allowed - We only speak GET around here. Your method is bone dry.",
  "405 Method Not Allowed - PUT? DELETE? PATCH? None of those pass the moisture test.",
  "405 Method Not Allowed - GET is the only method with the right moisture content.",
  "405 Method Not Allowed - That method has been rejected for insufficient dampness. GET only.",
  "405 Method Not Allowed - We assessed your method and found it critically dehydrated. Try GET.",
  "405 Method Not Allowed - Moisture scan failed. Only GET requests may enter the moist zone.",
  "405 Method Not Allowed - Your method arrived parched. We exclusively accept GET.",
];

// Common security and CORS headers applied to all responses
function getSecurityHeaders(isJson = false) {
  const csp = isJson
    ? "default-src 'none'"
    : "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src 'self'";
  return {
    'Access-Control-Allow-Origin': '*',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': csp,
    'Vary': 'Accept, User-Agent',
  };
}

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
  // Browsers always include text/html in Accept; API clients and CLI tools typically don't
  const accept = request.headers.get('accept') || '';
  return !accept.includes('text/html');
}

async function sendToDiscord(request, query, classification, status, env) {
  try {
    if (!env || !env.DISCORD_WEBHOOK_URL) {
      return Promise.resolve();
    }
    
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
          // Discord embed field values max at 1024 chars; code block uses 8, leave 16 for safety
          value: `\`\`\`\n${(query.trim() || 'empty').substring(0, 1000)}\n\`\`\``,
          inline: false
        },
        {
          name: '🌍 Full URL',
          value: `\`${`${url.pathname}${url.search}`.substring(0, 1020)}\``,
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
    
    const payload = JSON.stringify({ embeds: [embed] });
    
    // Make the request and return the promise
    return fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Discord webhook returned ${response.status}`);
      }
      return response;
    });
  } catch (e) {
    console.error('Discord telemetry error:', e);
    return Promise.reject(e);
  }
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Handle CORS preflight — must come before any other check
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Let homepage and static assets serve normally, injecting security headers
  if (url.pathname === '/' ||
      url.pathname === '/favicon.ico' ||
      url.pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf)$/)) {
    const assetResponse = await env.ASSETS.fetch(request);
    const response = new Response(assetResponse.body, assetResponse);
    Object.entries(getSecurityHeaders(false)).forEach(([k, v]) => response.headers.set(k, v));
    return response;
  }

  // Enforce GET/HEAD only — all other methods get a themed 405
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const message = getRandomResponse(wrongMethodResponses);
    const wantsJson = isJsonRequest(request);
    const secHeaders = getSecurityHeaders(wantsJson);

    if (wantsJson) {
      return new Response(JSON.stringify({
        moisture: 'dry',
        message: message,
        status: 405
      }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Allow': 'GET, HEAD, OPTIONS',
          'X-Moisture-Level': 'dry',
          ...secHeaders
        }
      });
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Moist as a Service - 405</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
      background: linear-gradient(135deg, #FFA500 0%, #FF6347 100%);
    }
    .container {
      background: rgba(255, 255, 255, 0.95);
      padding: 3rem;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 600px;
      text-align: center;
    }
    h1 { font-size: 4rem; margin-bottom: 1rem; color: #333; }
    .status { font-size: 1.5rem; color: #666; margin-bottom: 2rem; font-weight: bold; }
    .message { font-size: 1.25rem; line-height: 1.6; color: #444; margin-bottom: 2rem; }
    .emoji { font-size: 5rem; margin-bottom: 1rem; }
    a { color: #667eea; text-decoration: none; font-weight: bold; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div class="emoji">🏜️</div>
    <h1>405</h1>
    <div class="status">Method Not Allowed</div>
    <div class="message">${message}</div>
    <p><a href="/">← Back to Moist as a Service</a></p>
  </div>
</body>
</html>`;

    return new Response(html, {
      status: 405,
      headers: {
        'Content-Type': 'text/html',
        'Allow': 'GET, HEAD, OPTIONS',
        'X-Moisture-Level': 'dry',
        ...secHeaders
      }
    });
  }

  // Collect text from URL path and query params (GET only — no body)
  const searchText = url.pathname + ' ' + url.search;

  const classification = classifyMoisture(searchText);
  const wantsJson = isJsonRequest(request);
  const secHeaders = getSecurityHeaders(wantsJson);

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

  // Send telemetry to Discord
  if (env.DISCORD_WEBHOOK_URL) {
    const telemetryPromise = sendToDiscord(request, searchText, classification, status, env);
    context.waitUntil(telemetryPromise);
  }

  if (wantsJson) {
    return new Response(JSON.stringify({
      moisture: classification,
      message: message,
      status: status
    }), {
      status: status,
      headers: {
        'Content-Type': 'application/json',
        'X-Moisture-Level': classification,
        ...secHeaders
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
      'X-Moisture-Level': classification,
      ...secHeaders
    }
  });
}
