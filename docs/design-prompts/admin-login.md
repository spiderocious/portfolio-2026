# Prompt: Admin Login Screen — /admin/login

Context: This is the single-user admin login screen for a developer portfolio. It is accessed at `/admin/login`. It is private, minimal, and on-brand — matching the dark editorial aesthetic of the public site. The user (site owner) lands here when trying to access the admin panel. There is no signup, no social login, no forgot password link visible prominently. Just a clean, confident login form. The design language is terminal-meets-editorial: dark background, monospace labels, subtle crosshatch grain texture, dashed or low-opacity borders. Not corporate, not generic SaaS.

---

## Layout Structure:

- Full viewport: 100vw × 100vh
- Background color: #0f0f0f
- Background texture: repeating diagonal line grain overlay at 45°, lines spaced 12px apart, line color rgba(255,255,255,0.03) — very subtle, like paper grain
- Layout: Vertically and horizontally centered single column
- Center column width: 400px on desktop, 90% on mobile
- No sidebar, no header bar, no nav

---

## Section 1: Terminal Identity Bar (Top of card)

### Structure:
- Sits above the form card, flush with its top edge or as the card's top strip
- Height: 40px
- Background: #161616
- Border: 1px dashed rgba(255,255,255,0.1)
- Border-bottom only OR full border as top section of card
- Border-radius (top only): 6px 6px 0 0

### Content:
- Left-aligned monospace text: "feranmi@admin ~ $"
  - Font: JetBrains Mono, Courier New, monospace
  - Font size: 12px
  - Font weight: 400
  - Color: #666666
  - Padding-left: 16px
- Blinking cursor character after the text: "|"
  - Color: #4ade80 (green)
  - Animation: opacity blink 1s step-end infinite

---

## Section 2: Login Form Card

### Card Structure:
- Width: 400px (desktop), 100% (mobile, max 400px)
- Background: #141414
- Border: 1px solid #222222
- Border-radius: 0 0 8px 8px (bottom only, since terminal bar is top)
- Padding: 40px 36px 36px 36px
- No box shadow

### Content — Top:

#### Heading:
- Text: "Welcome back, Feranmi."
- Font: DM Serif Display, Georgia, serif
- Font size: 26px
- Font weight: 400 (serif italic feel, not bold)
- Color: #f0ece4 (warm off-white)
- Margin-bottom: 6px

#### Subtext:
- Text: "Enter your credentials to access the admin panel."
- Font: JetBrains Mono, monospace
- Font size: 11px
- Font weight: 400
- Color: #444444
- Margin-bottom: 32px

---

### Form Fields:

#### Email Field:

Label:
- Text: "email"
- Font: JetBrains Mono, monospace
- Font size: 10px
- Font weight: 500
- Color: #555555
- Letter-spacing: 0.12em
- Text-transform: uppercase
- Margin-bottom: 6px

Input:
- Width: 100%
- Height: 44px
- Background: #0f0f0f
- Border: 1px solid #2a2a2a
- Border-radius: 4px
- Padding: 0 14px
- Font: JetBrains Mono, monospace
- Font size: 13px
- Font weight: 400
- Color: #d4d0c8
- Placeholder: "you@domain.com"
- Placeholder color: #333333
- Margin-bottom: 20px

States:
- Focus: border-color changes to #3a3a3a, outline: none, box-shadow: 0 0 0 2px rgba(255,255,255,0.04)
- Error: border-color: #5c1a1a, background: #120a0a
- Filled: color #f0ece4

#### Password Field:

Label:
- Text: "password"
- Same style as email label above

Input:
- Same sizing and style as email input
- Type: password
- Placeholder: "••••••••"
- Placeholder color: #333333

Show/Hide Toggle:
- Positioned inside the input field, right side
- Icon: Eye / Eye-off, 14px, color #444444
- Hover: color #888888
- Cursor: pointer
- No background, no border

States: same as email field

---

### Submit Button:

- Width: 100%
- Height: 44px
- Background: #f0ece4 (warm off-white — inverted from the dark card)
- Border: none
- Border-radius: 4px
- Margin-top: 28px

Typography:
- Text: "enter →"
- Font: JetBrains Mono, monospace
- Font size: 13px
- Font weight: 500
- Color: #0f0f0f (dark text on light button)
- Letter-spacing: 0.08em

States:
- Default: background #f0ece4, color #0f0f0f
- Hover: background #ffffff, transition 150ms ease
- Active/Pressed: transform scale(0.99), background #e0dcd4
- Loading: text changes to "entering..." with subtle opacity pulse on the text, cursor not-allowed, background #c8c4bc
- Disabled: background #1e1e1e, color #444, cursor not-allowed

---

### Error Message (below button, hidden by default):

- Visible only on failed login
- Text: "incorrect credentials. try again."
- Font: JetBrains Mono, monospace
- Font size: 11px
- Color: #f87171 (soft red)
- Margin-top: 12px
- Text-align: left
- No background, no border — just inline text

---

### Back to Site Link:

- Positioned below error message or at bottom of card
- Margin-top: 24px
- Text: "← back to site"
- Font: JetBrains Mono, monospace
- Font size: 11px
- Color: #444444
- Hover: color #888888
- Text-decoration: none
- Cursor: pointer
- Transition: color 150ms ease

---

## Visual Design System:

### Colors:
- Page background: #0f0f0f
- Card background: #141414
- Terminal bar: #161616
- Input background: #0f0f0f
- Border default: #222222
- Border focus: #3a3a3a
- Text primary: #f0ece4
- Text secondary: #888888
- Text muted: #444444 / #555555
- Labels: #555555
- Button (primary): #f0ece4
- Button text: #0f0f0f
- Error text: #f87171
- Error border: #5c1a1a
- Cursor green: #4ade80
- Grain overlay: rgba(255,255,255,0.03)

### Typography:
- Headings: DM Serif Display, 26px, weight 400, color #f0ece4
- Labels: JetBrains Mono, 10px, weight 500, uppercase, letter-spacing 0.12em, color #555555
- Input text: JetBrains Mono, 13px, weight 400, color #d4d0c8
- Button text: JetBrains Mono, 13px, weight 500, letter-spacing 0.08em
- Subtext / links: JetBrains Mono, 11px, weight 400, color #444444

### Spacing:
- Card padding: 40px 36px 36px
- Between label and input: 6px
- Between fields: 20px
- Between last field and button: 28px
- Between button and error: 12px
- Between error and back link: 24px

### Border Radius:
- Card bottom: 8px
- Inputs: 4px
- Button: 4px

### Animations:
- Cursor blink: opacity 1s step-end infinite (terminal bar)
- Input focus ring: transition border-color 150ms ease
- Button hover: transition background 150ms ease
- Button press: transform scale(0.99) 100ms ease-in

---

## Responsive Behavior:

### Desktop (1200px+):
- Card centered in viewport, 400px wide
- Full card visible without scroll

### Tablet (768px–1199px):
- Card centered, 400px wide
- Same layout, no changes

### Mobile (<768px):
- Card width: 90% of screen, max 400px
- Card padding: 32px 24px 28px
- Button height: 48px (larger touch target)
- Font sizes unchanged

---

## Interaction States Summary:

- Default: form empty, button shows "enter →"
- Typing: input border subtly lightens, text appears in off-white
- Submit loading: button text "entering...", pulsing, disabled
- Error: red inline message below button, email+password fields get red border
- Success: immediate redirect (no visible success state needed)

---

## Notes:
- No logo needed — the terminal bar IS the brand signal
- No "forgot password" link — single user, not needed on screen
- No "sign up" — this is private, single-user only
- Dark mode only — this page never shows in light mode regardless of theme toggle
- The grain texture is critical — without it the page feels flat. It must be very subtle (barely visible diagonal lines)
- The form should feel like typing into a terminal, not filling out a SaaS form
