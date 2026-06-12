# Adding Bots to ToastedBots Legal

This repository is a static GitHub Pages legal hub for ToastedBots Discord bots.
Use this checklist when adding another bot after ForwardLink.

## Route Structure

Create one bot-specific route using the public bot name:

```text
/BotName/
/BotName/terms/
/BotName/privacy/
```

Example:

```text
/ForwardLink/
/ForwardLink/terms/
/ForwardLink/privacy/
```

The root `/` page is the all-bots hub. Add each new bot as one compact entry that links to its bot-specific Terms and Privacy pages.

## Assets

Store bot assets under a slugged folder:

```text
assets/<bot-slug>/icon.svg
assets/<bot-slug>/banner.svg
assets/<bot-slug>/<optional-context-logo>.svg
```

Keep SVGs bounded in HTML with explicit `width` and `height` attributes. Do not place large raw SVGs directly into the page body.

## Styling

The base site stays monochrome. Bot-specific pages can define one accent color through a body class and CSS variables:

```css
.bot-example {
  --accent: oklch(...);
  --accent-strong: oklch(...);
  --accent-soft: oklch(...);
}
```

Use the accent only for links, focus states, selected document states, and small bot identity markers. The root all-bots page should not inherit a bot accent.

## Redirects

The legacy `/terms/` and `/privacy/` routes exist for ForwardLink compatibility only. Do not reuse those routes for new bots.

New bots should use their bot-specific URLs in Discord Developer Portal:

```text
https://toastedbots.github.io/legal/BotName/terms/
https://toastedbots.github.io/legal/BotName/privacy/
```

## Legal Content Checklist

For each bot, confirm the Privacy Policy covers:

- stored Discord data and identifiers
- whether message content is stored
- whether data is used for AI or machine learning training
- retention rules, including any data stored longer than 30 days
- deletion request process
- security and encryption-at-rest statement
- contact or support path

For each bot, confirm the Terms of Service covers:

- allowed use
- command and workflow expectations
- moderation or support workflow limits
- availability disclaimer
- changes to terms
- contact or support path

## Release Checklist

Before publishing a new bot route:

- open the bot home, terms, and privacy pages locally
- verify mobile layout has no horizontal overflow
- verify all SVG assets are bounded
- verify the all-bots hub links to the new bot
- update the Discord Developer Portal Terms and Privacy URLs
- collect screenshots or video evidence for Discord review if privileged intents are involved
