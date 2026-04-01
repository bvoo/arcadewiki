# Controller Content Template

This is the canonical body template for controller articles on arcade.wiki.

Use this template for the Markdown content below the frontmatter block. Keep sortable facts in frontmatter. Use the body for context, caveats, accessories, software, and links.

## Goals

- Make every controller page easy to scan
- Keep page structure consistent across sparse and well-documented controllers
- Avoid repeating frontmatter unless the body adds useful context
- Prefer compact factual bullets over long marketing-style prose

## Section Order

Use this order for all controller pages:

1. `## Overview`
2. `## Highlights`
3. `## Hardware`
4. `## Compatibility`
5. `## Resources`

Optional sections for unusually well-documented controllers to be put between `## Compatibility` and `## Resources`:

- `## History`
- `## DIY / Open Source`
- `## In the Box`
- `## Notes`

## Writing Rules

- Keep `## Overview` to 1–2 short paragraphs.
- Start the overview with a distinctive lead sentence, not a restatement of frontmatter.
- Use the lead to explain identity, design, audience, historical significance, or market position.
- Prefer bullets for technical facts.
- Use `unknown` or `not publicly documented` when data cannot be confirmed.
- Do not guess or pad with generic copy.
- Do not repeat frontmatter values unless the body adds context.
- Keep tone factual and encyclopedic.

## What Belongs in Frontmatter vs Body

Frontmatter should hold structured catalog data:

- `name`
- `maker`
- `buttonType`
- `gameType`
- `priceUSD`
- `currentlySold`
- `releaseYear`
- `switchType`
- `weightGrams`
- `dimensionsMm`
- `link`

The body should hold:

- what makes the controller notable
- construction details
- switch behavior and hot-swap notes
- PCB, firmware, and software details
- compatibility caveats
- included accessories
- revision notes
- source conflicts or uncertainty
- official and community links

## Firmware and PCB Conventions

- Always mention firmware in `## Compatibility`, even if support is largely defined by the firmware platform.
- For FGC-oriented controllers, an RP2040-based PCB often implies GP2040-CE unless another firmware is confirmed. State that explicitly when it is known or strongly documented.
- For Smash and platform-fighter controllers, HayBox is the default firmware framing unless another firmware is confirmed.
- Note exceptions that materially affect compatibility, such as DS4 keys, passthrough authentication, or dedicated auth ports.
- When the board is based on an RP2040, prefer the wording `RP2040-based PCB` over naming the MCU alone.

## Canonical Body Template

```md
## Overview

[Name] is [a concise, distinctive description].

[Optional second sentence: target audience, market position, design goal, or historical significance. Not super strict.]

## Highlights

- [Primary distinguishing feature]
- [Switch or layout highlight]
- [Compatibility or connectivity highlight]
- [Material, ergonomics, or customization highlight]

## Hardware

### Case and Materials

- **Case**: [material]
- **Top / Bottom**: [material or construction, if known]
- **Buttons / Keycaps**: [type or material, if known]
- **Mounting**: [hot-swap / soldered / modular / unknown]

### Switches

- **Stock switch**: [name]
- **Type**: [linear / tactile / optical / Hall Effect / arcade button]
- **Hot-swappable**: [yes / no / unknown]
- **Adjustability**: [actuation, travel, SOCD, profiles, etc., if applicable]

### Electronics

- **PCB / Controller**: [RP2040-based PCB / Brook / proprietary / unknown]
- **Firmware / Software**: [GP2040-CE / HayBox / app / web configurator / unknown]
- **Special features**: [RGB, profiles, touchpad, audio jack, etc.]

## Compatibility

- **Firmware**: [GP2040-CE / HayBox / proprietary / unknown]
- **Native support**: [PC / PS5 / PS4 / Switch / GameCube / Xbox]
- **Connection**: [USB-C wired / Bluetooth / 2.4GHz / tri-mode]
- **Notes**: [adapter requirements, DS4 keys, passthrough auth, auth ports, tournament lock, SOCD behavior, etc.]

## In the Box

- [Controller]
- [Cable]
- [Case / pouch]
- [Extra switches / tools / accessories]

## Notes

- [Known revisions, discontinuation notes, pricing caveats, regional variants, or source ambiguity]
- [Anything important that does not fit elsewhere]

## Resources

### Official

- [Product page](...)
- [Manual / configurator / firmware](...)

### Community

- [Review / wiki / repo / video](...)
```

## Sparse Page Guidance

For pages with limited public information:

- still use the same section order
- keep each section short
- explicitly mark unknown details
- skip `## In the Box` or `## Notes` if nothing reliable is known

## Rich Page Guidance

For pages with extensive documentation:

- keep the same section order
- add `## History` if the design lineage matters
- add `## DIY / Open Source` if the controller has published files, firmware, or rebuild paths
- keep long revision histories in `## Notes` unless the history is central to the controller

## Example Minimal Skeleton

```md
## Overview

[Name] is [short, distinctive description].

[Optional second sentence: audience, market position, design goal, or historical significance.]

## Highlights

- [Feature]
- [Feature]
- [Feature]

## Hardware

### Case and Materials

- **Case**: [known or unknown]

### Switches

- **Stock switch**: [known or unknown]

### Electronics

- **PCB / Controller**: [RP2040-based PCB / proprietary / known or unknown]
- **Firmware / Software**: [GP2040-CE / HayBox / proprietary / known or unknown]

## Compatibility

- **Firmware**: [known or unknown]
- **Native support**: [known or unknown]
- **Connection**: [known or unknown]
```
