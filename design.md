# contest-radar — design.md

## 1. Product voice & posture

A personal scanning tool for one Korean undergrad developer. It IS a quiet, dense daily-read surface — a desk reference for 공모전 deadlines. It IS NOT a discovery product, marketplace, or feed. Reading the page should feel like opening a well-kept notebook, not a dashboard. Trust comes from typographic precision and accurate dates, not from visual reassurance.

## 2. Reference inspirations

- **Linear changelog** — flat list, hairline dividers, mono metadata, zero card chrome.
- **Stripe docs** — restrained ink-on-paper, generous line-height for Korean, left-aligned everything.
- **Pinboard** — text-first density, tags as plain inline tokens, no thumbnails competing with text.
- **Hacker News** — information hierarchy through type weight alone, not boxes.
- **Are.na** — quiet neutrals, single restrained accent, no decorative gestures.

## 3. Negative constraints (hard rules)

- No Inter, Geist, DM Sans, Manrope. No Noto Sans KR as primary.
- No `border-radius` greater than **2px** anywhere. No `rounded-lg/xl/2xl/full`.
- No `box-shadow` on any content surface. Borders only.
- No gradient. No glassmorphism, no `backdrop-filter`, no blur.
- No emoji. No decorative icons next to text labels. Icons allowed only when they replace text (e.g. external-link glyph).
- No blue primary. No indigo, no violet, no teal.
- No card-in-card. No hero section. No CTA button at top.
- No center-aligned body. No `text-align: justify`. Headings left-aligned.
- No animation on load. No skeleton shimmers. No hover-lift.
- No colored backgrounds on rows to denote NEW / soon / seen. Color is a signal, not a fill.
- No poster image at row-grid scale. Posters live inside expanded detail only.

## 4. Color tokens

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#111111` | Primary text, headings, deadline numerals |
| `--ink-2` | `#3A3A3A` | Body text, host names |
| `--ink-3` | `#6B6B6B` | Secondary metadata (source, date) |
| `--ink-4` | `#A0A0A0` | Tertiary, seen-state text, placeholders |
| `--paper` | `#FBFAF7` | Page background. Warm off-white. |
| `--paper-2` | `#F4F1EB` | Row hover only — single acceptable fill. |
| `--rule` | `#E8E4DC` | Hairline dividers and borders (~10% ink on paper) |
| `--accent` | `#B4452B` | Single signal accent — terracotta. NEW, D-3, active filter, expanded row. |
| `--warn` | `#8A6A1F` | D-1/D-0 deadline ink. Used sparingly. |

No success/info green. Expired uses `--ink-4` (gray-out, no red).

## 5. Typography

- **Sans (text):** Pretendard Variable → Pretendard → `-apple-system`.
- **Mono (numerals, IDs, dates, D-N, deadlines, tags):** JetBrains Mono → SF Mono → D2Coding.

| Token | px / lh | Weight | Tracking | Use |
|---|---|---|---|---|
| `display` | 22 / 28 | 600 | -0.01em | Page title |
| `h2` | 13 / 20 | 600 | 0.04em uppercase | Section labels (오늘의 메모, etc) |
| `body` | 14 / 22 | 400 | 0 | Body, detail markdown |
| `body-strong` | 14 / 22 | 600 | 0 | Contest title |
| `meta` | 12 / 18 | 400 | 0 | Source, host, secondary |
| `mono-md` | 13 / 18 | 500 | 0 | D-N, deadlines, prize numerals |
| `mono-sm` | 11 / 16 | 500 | 0.02em | Tags, category chips, NEW |

Korean line-height never below 1.55×.

## 6. Spacing scale

4px base. Allowed: `0, 4, 8, 12, 16, 24, 32, 48, 64`. Forbid `6, 10, 14, 20, 28, 36`.

## 7. Density

- Row min-height: **40px** (expands when detail open).
- List gap: **0** — hairline divider between rows.
- Max content width: **960px**. Page padding: 32px desktop, 16px mobile.
- Body line-length cap: **72ch** inside expanded detail.

## 8. Component recipes

- **Buttons**: text-only, `--ink-3`, underline on hover. No fill, no border, no radius.
- **Links (external)**: `--ink`, underline on hover. Trailing `↗` glyph mono `--ink-4`.
- **Tags**: inline `mono-sm` `--ink-3`, `#` prefix, space-separated. No background. No border.
- **Categories**: inline `mono-sm`, prefixed with the category marker square (8×8). Active match = filled.
- **Filter toggle**: plain text. Active = `--ink` + 1px underline 4px offset. Inactive = `--ink-4`.
- **Search input**: bottom-border only, 1px `--rule`. Focus = border `--ink`. No ring.
- **NEW**: `mono-sm` text `NEW` in `--accent`. No dot, no pill.
- **D≤3**: D-N in `--accent`. D-1/D-0 in `--warn` weight 700.
- **Seen**: title + meta drop to `--ink-4`. Category marker hollows. No strikethrough.
- **Expired**: entire row `--ink-4`. Deadline replaced with `마감`.

## 9. Layout primitives

Single column, no sidebar, no sticky header. Header = one line of text + 1px rule below. Filter strip below, not sticky. Row grid: `[8px marker] [16px gap] [title+meta auto] [tags 1fr right] [80px deadline right]`. Right-aligned deadline is the only right-aligned thing.

## 10. Voice & microcopy

- Korean primary, sentence-case English where mixed.
- Dates: ISO `2026-05-13`. No `2026년 5월 13일`.
- Insight heading: `오늘의 메모`.
- Stats: `활성 24 · 신규 3 · 마감임박 5` — middle dots, mono numerals, inline.
- Toggles: `본 항목 숨기기`, `마감 항목 숨기기`.
- Empty: `해당 조건에 맞는 공모전이 없습니다.` Left-aligned, `--ink-3`.

## 11. Do / Don't

1. Do: `D-3` terracotta mono. Don't: red pill "마감임박!".
2. Do: `#대학생 #IT` plain mono. Don't: gray rounded chips with padding.
3. Do: hairline between rows. Don't: white card on gray bg.
4. Do: poster only inside detail. Don't: 80×80 thumbnail in every row.
5. Do: `활성 24 · 신규 3` inline. Don't: three big stat cards.
6. Do: row itself is click target for expand. Don't: chevron icon rotating.
7. Do: seen rows fade to gray. Don't: checkmark icon + struck-through title.
8. Do: left-align everything. Don't: center the insight block.
