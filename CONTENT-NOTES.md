# TEPUNG — bakery & kopi, Bangsar KL

A concept site built as an original re-skin of the layout system used by the
`boolka.framer.website` Framer template. Same structural bones and motion
language; everything else (brand, copy, palette, artwork, photography) is new.

Two pages, plain static HTML. No build step, no dependencies. Open `index.html`
in a browser, or drop the folder on any static host.

```
tepung/
  index.html          home
  menu.html           full menu, 7 categories
  assets/css/style.css
  assets/js/main.js
  assets/img/         photography (jpg)
  assets/svg/sprite.svg   master copy of the icon set (inlined into both pages)
```

---

## ⚠ EVERYTHING BELOW IS INVENTED — confirm before any real use

This is a fictional brand for a mockup. Not one fact here has been verified,
because there is nothing to verify against. If this becomes a real client
project, every line in this section needs replacing with something true.

| Item | Placeholder used | Status |
|---|---|---|
| Brand name | Tepung (Malay for *flour*) | INVENTED — not trademark-checked |
| Address | 12 Jalan Telawi 3, Bangsar Baru, 59100 Kuala Lumpur | INVENTED lot number on a real street |
| Hours | Every day, 7.30am – 7pm | INVENTED |
| Phone / WhatsApp | +60 12-345 6789 | INVENTED, non-working number |
| Free kopi promo | Free Kopi O, 7.30–8.30am daily | INVENTED offer |
| Menu items & prices | 6 on home, 34 on the menu page, RM 4 – RM 32 | INVENTED |
| Nutrition rows | kcal / P / C / F on every menu card | **INVENTED — these are not real figures.** Either replace with lab or recipe data, or delete the `.mcard__meta` line. Publishing made-up nutrition numbers is a genuine problem, not a cosmetic one. |
| Team names & roles | Aisyah R., Faiz M., Mei Ling T., Arjun S., Nadia H., Hafiz K. | INVENTED names over stock portraits of real, unrelated people |
| Social links | `href="#"` | Not wired |
| Copyright year | 2026 | Set in both page footers |

**The team photos are now AI-generated, not real people.** That resolves the
worst of the placeholder problems — no real person is being captioned with an
invented name and job title any more. The names and roles themselves are still
invented, and the faces are synthetic, so if this becomes a real brand they get
replaced with real staff photography either way.

---

## Design system

### Palette — "gula & pandan"
Replaces the template's cream + orange with cream + pandan green + palm sugar gold.

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F4F1E6` | page background (coconut cream) |
| `--paper-2` / `--paper-3` | `#EDE8D8` / `#E3DCC7` | map panel, blocks |
| `--card` | `#FFFDF6` | cards, sign, caption |
| `--ink` | `#14170F` | headlines, body |
| `--muted` | `#6C6A5A` | secondary text |
| `--accent` | `#1E6F50` | **pandan green** — script text, prices, ticker, footer band, grid lines |
| `--accent-dk` | `#14503A` | hover |
| `--gold` | `#C88A1E` | palm sugar — the `NEW` tag |
| `--tag-green` / `--tag-kaya` / `--tag-blue` | pastels | card tags |

Background grid: 40px repeating lines at `rgba(30,111,80,.075)` — the template's
graph-paper texture, recoloured to the green.

### Type — unchanged from the template, as asked
- **Londrina Solid** 400/900 — display headlines, eyebrows, prices, ticker
- **Yellowtail** — the script kicker line
- **Be Vietnam Pro** 400–900 — UI and body
All three load from Google Fonts. Self-host them if this ever goes live.

---

## Motion inventory (what was rebuilt)

Measured off the original, rebuilt in vanilla CSS/JS.

| Effect | How |
|---|---|
| Hero entrance | H1, image band and caption fade + rise, staggered 90ms, on load |
| Scroll reveals | IntersectionObserver, `translateY(26px)` + fade, 0.75s `cubic-bezier(.44,0,.56,1)`, fires once. Grids stagger children via `data-stagger` |
| Marquee ticker | Two cloned tracks, `translateX(0 → -100%)`, duration computed in JS for a constant **62px/s**. Pauses on hover |
| Hanging OPEN sign | `rotate(-3deg) ↔ 3deg`, 6.2s, `transform-origin: 50% 0` — matches the original's swing |
| Doodle sway | `rotate(-2.4deg) ↔ 1.6deg`, 3.6s, offset delays per doodle — matches the original's values |
| Card hover | Card straightens from its resting tilt, lifts 6px, image scales 1.05 |
| Team polaroids | Resting rotations −1.1° / +0.7° / −0.4°, straighten and lift on hover, pin dot on top |
| Nav link hover | Two stacked spans, the pair slides up 100% |
| Menu filters | Sticky bar, click scrolls to the group, IntersectionObserver scroll-spy sets the active chip (locked for 1s after a click so it doesn't fight the smooth scroll) |
| Reduced motion | `prefers-reduced-motion` kills every animation and shows all revealed content |

---

## Two deliberate departures from the original

1. **Hero caption sits in a cream card overlapping the image**, rather than as
   white text burned onto a darkened photo. Same position and reading order, no
   tint over the photography.
2. **The room caption is an opaque corner card**, not a gradient scrim across
   the image. Same reason.

Both are one-line CSS changes if you want the original treatment back
(`.hero__caption`, `.shot__note`).

---

## Artwork

Every SVG in `assets/svg/sprite.svg` is drawn from scratch for this build —
the bun mark, roti stack, curry puff, rolling pin, teh glass, kettle, the
scribbled ellipse around the crew note, and the footer band. Seven symbols,
inlined into both pages so they work over `file://`.

The Bangsar map in the visit panel is a hand-built abstract SVG, not a real map
tile. If accuracy matters, swap the `.visit__map` block for an embed.

## Photography

**The 15 identity images are generated, not stock.** Magnific, Seedream 5 Pro,
2K for the three wide shots and 1.5K for the rest, ~1,200 credits for the set.
All 15 share one room, which is the whole point — the earlier stock set was six
different cafés in three countries and read as a collage.

Every image is WebP. Site images total **3.2MB** across 44 files.

### The room bible
Pasted verbatim into all 15 prompts, because reference images do not hold a room
on this model — continuity has to travel as text.

> A corner shoplot on Jalan Telawi, Bangsar. Self-serve bakery run down one wall:
> stainless trays and pale wooden tongs, open birch-ply shelves of bread behind a
> long curved glass guard, hand-written green index cards as labels. Counter front
> in glossy dark pandan-green square tile with a brushed brass edge strip. Cream
> terrazzo floor flecked green and ochre. White marble bistro tables on black
> cast-iron bases, one long pale-timber communal table, forest-green powder-coated
> steel stools. White ceiling, three-blade fans. Full-height glass and timber
> louvres onto the five-foot way, hard late-morning sun. Camera: Sony A7 IV, 35mm
> f/2, clean whites, punchy colour, almost no grain.

The self-serve tray-and-tongs run is the interactive centrepiece — it is how
Malaysian bakeries actually work, and it gives the people in shot something to
*do*. All six dishes sit on the same marble with the same strip of green tile at
the top of frame and the same cream plate with a green rim; that repeated surface
is what makes the grid read as one place.

### File naming
| Slot | File |
|---|---|
| Hero, room, storefront | `hero.webp`, `room.webp`, `storefront.webp` |
| Crew | `crew-aisyah`, `crew-faiz`, `crew-meiling`, `crew-arjun`, `crew-nadia`, `crew-hafiz` |
| Favourites | `fav-kaya-toast`, `fav-nasi-lemak`, `fav-roti-canai`, `fav-curry-puff`, `fav-croissant`, `fav-pandan-loaf` |

2K originals are in `assets/img/_masters/` (73MB). **Gitignored — never deploy
them.** Re-crop from there rather than re-generating if a size changes.

### Still stock
The **29 remaining menu-page images** are Unsplash placeholders, converted to
WebP but not regenerated. They are tight drink and pastry crops, so they carry no
location cues and sit acceptably next to the generated set. Regenerate them with
the same room bible when the menu content is final.

If you add more stock, take URLs from `images.unsplash.com/...` and avoid
`plus.unsplash.com/...` — the latter download with a tiled watermark.

## Known deviations from the reference template
- The hero wordmark was **removed**. It sat over the bread display and fought the
  photograph, and the nav carries the same wordmark 10px above it. The storefront
  band still carries a large one.
- Hero and room captions sit in opaque cream cards rather than on darkened
  photos, so nothing tints the photography.
