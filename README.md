# 💧 Moist as a Service

The world's premier moisture detection API. Inspired by [No as a Service](https://github.com/vickyqian/noservice).

## What is this?

Moist as a Service analyzes HTTP requests and classifies them as moist, wet, or dry based on fuzzy keyword matching. Because the internet needed this.

## Response Codes

- **200 OK** - Perfectly moist ✨
- **418 I'm a teapot** - Too wet 🫖  
- **404 Not Found** - Moist not found (too dry) 🏜️

## Features

- Fuzzy keyword matching for moisture detection
- Content negotiation (JSON for APIs, HTML for browsers)
- Checks URL path, query parameters, and POST body
- Expandable moisture dictionaries
- Creative, randomized responses
- Optional Discord telemetry for tracking requests

## Examples

### Moist Requests (200)
```bash
curl https://your-site.pages.dev/cake
curl https://your-site.pages.dev/sponge
curl -X POST https://your-site.pages.dev/api -d "towel"
```

### Wet Requests (418)
```bash
curl https://your-site.pages.dev/ocean
curl https://your-site.pages.dev/waterfall
curl https://your-site.pages.dev/api?q=swimming+pool
```

### Dry Requests (404)
```bash
curl https://your-site.pages.dev/desert
curl https://your-site.pages.dev/dust
curl https://your-site.pages.dev/api?q=sahara
```

## Deployment to Cloudflare Pages

### Step 1: Create GitHub Repository

1. Fork or create a new repository
2. Add the following files:
   - `functions/[[path]].js` - Main API logic
   - `index.html` - Homepage
   - `README.md` - This file

Your repository structure should look like:
```
your-repo/
├── functions/
│   └── [[path]].js
├── index.html
└── README.md
```

### Step 2: Connect to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click "Workers & Pages" in the sidebar
3. Click "Create application" → "Pages" → "Connect to Git"
4. Authorize GitHub and select your repository
5. Configure build settings:
   - **Build command:** (leave empty)
   - **Build output directory:** (leave empty)
6. Click "Save and Deploy"
7. Wait 1-2 minutes for deployment
8. Your site will be available at `your-project.pages.dev`

### Step 3: (Optional) Enable Discord Telemetry

Discord telemetry tracks all API requests with detailed information including IP, query, classification, status, and user agent.

**🔒 Security Note:** Cloudflare environment variables are stored in Cloudflare's infrastructure, NOT in your GitHub repository. This means:
- ✅ Forks of your repo won't get access to your webhook URL
- ✅ Each deployment needs its own webhook configuration
- ⚠️ Anyone with access to your Cloudflare dashboard can view the webhook URL
- 💡 You can rotate the webhook in Discord anytime without changing code

#### Setup Instructions

**1. Create Discord Webhook:**
- Go to your Discord server settings
- Click "Integrations" → "Webhooks" → "New Webhook"
- Name it "Moist Telemetry"
- Copy the webhook URL

**2. Add to Cloudflare Pages:**
- In Cloudflare Pages, go to your project
- Click "Settings" → "Environment variables"
- Click "Add variable"
- Variable name: `DISCORD_WEBHOOK_URL`
- Value: Paste your webhook URL
- Environment: Select "Production" (and "Preview" if you want telemetry on preview deployments)
- Click "Save"
- Redeploy your project (Settings → Deployments → Retry deployment)

**To disable telemetry:** Simply don't add the `DISCORD_WEBHOOK_URL` environment variable. The code handles missing webhooks gracefully.

#### Telemetry Data Captured

Each request sends a Discord embed with:
- 🌐 IP Address (CF-Connecting-IP)
- 🔍 Query/search text analyzed
- 💦 Classification (moist/wet/dry)
- 📊 HTTP status code (200/418/404)
- 🌍 Full URL path and query
- 🖥️ User agent
- ⏰ Timestamp
- 🎨 Color-coded by classification

**To disable telemetry:** Simply don't add the `DISCORD_WEBHOOK_URL` environment variable. The code handles missing webhooks gracefully.

## Customization

### Add More Keywords

Edit `functions/[[path]].js`:

**Moist keywords:**
```javascript
const moistThings = [
  'cake', 'brownies', 'towel', 'sponge', 'soil',
  // Add your keywords here
];
```

**Wet keywords:**
```javascript
const wetThings = [
  'water', 'ocean', 'sea', 'lake', 'rain',
  // Add your keywords here
];
```

### Add More Responses

Edit the response arrays in `functions/[[path]].js`:

```javascript
const moistResponses = [
  "Perfect moisture detected. Like a cake fresh from the oven.",
  // Add your creative responses here
];
```

## Local Development

```bash
npm install -g wrangler
wrangler pages dev .
```

Visit `http://localhost:8788` to test locally.

## How It Works

1. **Request Analysis:** The service extracts text from the URL path, query parameters, and POST body
2. **Fuzzy Matching:** Uses fuzzy keyword matching with typo tolerance (1 character difference)
3. **Classification:** Matches against dictionaries of moist, wet, and dry keywords
4. **Content Negotiation:** Detects if the client wants JSON (curl, wget, httpie) or HTML (browsers)
5. **Response:** Returns appropriate status code with creative message
6. **Telemetry:** Optionally logs request details to Discord (non-blocking)

## Security Notes

- **Environment Variables:** Stored in Cloudflare, not in your GitHub repo - forks won't get your webhook
- **Webhook Visibility:** Anyone with Cloudflare dashboard access can view environment variables
- **Webhook Rotation:** If compromised, generate a new webhook in Discord and update the Cloudflare variable
- **Telemetry:** Non-blocking and fails silently - never breaks API responses
- **IP Logging:** IP addresses are captured via Cloudflare's CF-Connecting-IP header
- **No Persistent Storage:** No data is stored beyond sending to Discord

## License

MIT - Go forth and moisturize the web.
