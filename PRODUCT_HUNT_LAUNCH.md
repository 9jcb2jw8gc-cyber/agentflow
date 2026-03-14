# AgentFlow — Product Hunt Launch Assets

## Submission Details

- **Product name:** AgentFlow
- **Tagline (60 chars):** Visual canvas for building Claude AI agents
- **Description (260 chars):** Build multi-agent Claude AI systems by dragging nodes onto a canvas. Connect coordinators to specialists, toggle tools on/off, and export a portable YAML file any app can import in one line.
- **Topics:** Artificial Intelligence, Developer Tools, No Code, Productivity
- **Makers:** James (add yourself as maker)
- **Website:** https://agentflow.ai

## Assets Checklist

- [x] Product name: AgentFlow
- [x] Tagline (60 chars max): "Visual canvas for building Claude AI agents"
- [x] Description (260 chars)
- [x] Thumbnail: `public/thumbnail-240.png` (240x240, logo on dark background)
- [ ] Gallery images (min 3, max 8):
  - Canvas overview screenshot
  - Inspector panel screenshot
  - YAML export screenshot
  - Dashboard screenshot
- [ ] Video: Loom link (3-5 minutes, shows core workflow)
- [x] First comment (below)
- [x] Makers: add yourself
- [x] Topics: AI, Developer Tools, No Code, Productivity

## First Comment (post immediately after launch goes live)

> Hey PH! I built AgentFlow after spending weeks handwriting Claude Agent SDK configs for my BJJ training app (8BitJJ). Every time I wanted to change an agent's behavior I was digging through Python files. AgentFlow makes it visual — drag agents onto a canvas, connect them, toggle tools on/off, and export a YAML file you can import in one line. Happy to answer any questions!

## Waitlist Email (send day before launch)

**Subject:** AgentFlow launches tomorrow on Product Hunt

Hey [first_name],

AgentFlow launches on Product Hunt tomorrow.

If you've been waiting to try it — tomorrow is the day.

[Launch at 12:01am PST → upvote here]

What's ready:
→ Visual canvas for Claude Agent SDK
→ Drag-and-drop agent builder
→ YAML export (import in one line of code)
→ Free tier: 3 canvases, 5 agents each

See you tomorrow.

James

## Launch Day Sequence

| Time | Action |
|------|--------|
| 12:01am PST | Product Hunt goes live, post first comment immediately |
| 9:00am ET | Post Show HN: "Show HN: AgentFlow — visual canvas for Claude Agent SDK" |
| 9:15am ET | Send waitlist email via Resend |
| 9:30am ET | Post on Twitter/X with demo GIF |
| 10:00am ET | Post in Anthropic Discord #showcase channel |
| All day | Reply to every Product Hunt comment within 30 minutes |

## Custom Domain Setup

1. Buy domain at Namecheap or Cloudflare Registrar
   - Recommended: `agentflow.dev` ($12/yr) or `useagentflow.com` ($12/yr)
   - Premium: `agentflow.ai` (~$70/yr but worth it long term)

2. In Vercel dashboard → Settings → Domains → Add domain
   - Add: `agentflow.ai` (or your chosen domain)
   - Add: `www.agentflow.ai`

3. In your domain registrar DNS settings:
   - A record: `@` → `76.76.21.21`
   - CNAME record: `www` → `cname.vercel-dns.com`

4. Wait 5-15 minutes for DNS propagation
5. Vercel auto-provisions SSL certificate
6. Update `NEXT_PUBLIC_APP_URL` env var to `https://agentflow.ai`
