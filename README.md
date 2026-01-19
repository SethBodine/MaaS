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

## Examples

### Moist Requests (200)
```bash
curl https://your-site.pages.dev/cake
curl https://your-site.pages.dev/api?q=sponge
curl -X POST https://your-site.pages.dev/api -d "towel"
```

### Wet Requests (418)
```bash
curl https://your-site.pages.dev/ocean
curl https://your-site.pages.dev/api?q=waterfall
```

### Dry Requests (404)
```bash
curl https://your-site.pages.dev/desert
curl https://your-site.pages.dev/api?q=sahara
```

## Deploy to Cloudflare Pages

1. Fork this repository
2. Connect to Cloudflare Pages
3. Deploy!

That's it. No build command needed.

## Add More Moisture

Edit `functions/api/[[route]].js`:

- Add to `moistThings` array for new moist keywords
- Add to `wetThings` array for new wet keywords  
- Add to response arrays for new creative messages

## Local Development

```bash
npm install -g wrangler
wrangler pages dev .
```

## License

MIT - Go forth and moisturize the web.
