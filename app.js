// ========= CAMPAIGN CONFIG =========
// Für neue Singles: hier headline/slug/cover/links ändern oder ein zweites Objekt anlegen.
const CAMPAIGN = {
  artist: "UND3R GHO5T5",
  headline: "TH1S M3SS",
  subline: "single",
  status: "READY",

  slug: "und3r-gho5t5-th1s-m3ss",
  description: "Chaos, doubt, momentum — keep moving through the noise.",

  coverUrl: "https://i.scdn.co/image/ab67616d0000b27347ad7da240bca1c5cdc01eb4",

  // Beliebig viele Buttons (füge einfach neue Objekte hinzu)
  links: [
    {
      type: "primary",
      platform: "Spotify",
      top: "Play on",
      bottom: "SPOTIFY",
      icon: "▶",
      url: "https://open.spotify.com/track/1S7YA5JPO7keyhfsLFkeAR"
    },
    {
      type: "secondary",
      platform: "Apple Music",
      top: "Play on",
      bottom: "APPLE",
      icon: "▶",
      url: "https://music.apple.com/us/album/th1s-m3ss/1861223982?i=1861223983&at=1000lHKX&ct=api_http&itsct=odsl_m&itscg=30200&ls=1"
    },
    {
      type: "secondary",
      platform: "Amazon Music",
      top: "Play on",
      bottom: "AMAZON",
      icon: "▶",
      url: "https://music.amazon.com/albums/B0G6W5SMYY?trackAsin=B0G6WMM83S"
    }

    // Beispiel:
    // {
    //   type: "secondary",
    //   platform: "AppleMusic",
    //   top: "Play on",
    //   bottom: "APPLE MUSIC",
    //   icon: "♪",
    //   url: "https://music.apple.com/..."
    // }
  ],

  // Für später: Presave/Newsletter/Merch/Updates etc.
  extras: [
    // { title: "NEWS", body: "Next drop soon." }
  ]
};

// ========= Helpers =========
function withQueryParams(url) {
  const qs = window.location.search || "";
  if (!qs) return url;
  return url.includes("?") ? `${url}&${qs.slice(1)}` : `${url}${qs}`;
}

function track(eventName, params = {}) {
  try {
    if (typeof fbq === "function") fbq("track", eventName, params);
  } catch (_) {}
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// ========= Render =========
function render() {
  document.documentElement.style.setProperty("--cover", `url("${CAMPAIGN.coverUrl}")`);

  const artist = document.getElementById("artist");
  if (artist) {
    artist.textContent = CAMPAIGN.artist;
    artist.setAttribute("data-text", CAMPAIGN.artist);
  }

  const headline = document.getElementById("headline");
  if (headline) headline.textContent = CAMPAIGN.headline;

  const subline = document.getElementById("subline");
  if (subline) subline.textContent = CAMPAIGN.subline;

  const status = document.getElementById("status");
  if (status) status.textContent = CAMPAIGN.status;

  const desc = document.getElementById("description");
  if (desc) desc.textContent = CAMPAIGN.description;

  const cover = document.getElementById("cover");
  if (cover) cover.src = CAMPAIGN.coverUrl;

  // Buttons
  const btnWrap = document.getElementById("buttons");
  btnWrap.innerHTML = "";

  const validLinks = (CAMPAIGN.links || []).filter(l => l.url && l.url.trim().length > 0);
  const primary = validLinks[0];
  const primaryLink = document.getElementById("primaryLink");

  if (primary && primaryLink) {
    primaryLink.href = primary.url;
    primaryLink.addEventListener("click", (e) => outbound(e, primary.platform, primary.url, "Artwork"));
  }

  validLinks.forEach(l => {
    const a = el("a", `btn ${l.type || ""}`);
    a.href = l.url;

    const icon = el("span", "btnIcon", l.icon || "↗");
    const txt = el("span", "btnText");
    const top = el("span", "btnTop", l.top || "");
    const bottom = el("span", "btnBottom mono", l.bottom || "");
    const arrow = el("span", "btnArrow", "↗");

    txt.appendChild(top);
    txt.appendChild(bottom);

    a.appendChild(icon);
    a.appendChild(txt);
    a.appendChild(arrow);

    a.addEventListener("click", (e) => outbound(e, l.platform, l.url, "Button"));
    btnWrap.appendChild(a);
  });

  // Extras (optional)
  const extras = document.getElementById("extras");
  const items = (CAMPAIGN.extras || []).filter(x => x.title || x.body);
  if (extras && items.length) {
    extras.hidden = false;
    extras.innerHTML = "";
    items.forEach(x => {
      const block = el("div", "extraBlock");
      const h = el("div", "extraTitle mono", x.title || "");
      const b = el("div", "extraBody", x.body || "");
      block.appendChild(h);
      block.appendChild(b);
      extras.appendChild(block);
    });
  }

  // Year
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function outbound(e, platform, url, source) {
  e.preventDefault();

  const out = withQueryParams(url);

  // Click tracking
  track("ViewContent", {
    content_name: CAMPAIGN.slug,
    content_type: platform || "Outbound",
    destination: url,
    source: source || "Click"
  });

  setTimeout(() => {
    window.location.href = out;
  }, 120);
}

// Init
render();
