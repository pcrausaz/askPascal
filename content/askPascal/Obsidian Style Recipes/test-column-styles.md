# Column Style Variants Test

This page demonstrates all available column layouts with different style options.

## Style Variants Available

You can choose from these style options for any column layout:

- **Default** (no suffix) - Gray background + border
- **`-white`** suffix - White/light background + border (auto light/dark mode)
- **`-plain`** suffix - No background, no border

---

## Three-Column Layouts

### Test 1: Three Columns - Default (Gray + Border)

:::three-columns

## Column 1
Default styling with gray background and border.
- Full markdown support
- **Bold** and *italic*
- [[test-three-columns|Wiki links]]

## Column 2
Same gray background.
- Lists work
- Code: `const x = 1`
- External [links](https://example.com)

## Column 3
Consistent styling.
> Blockquotes work too!

:::

---

### Test 2: Three Columns - White Background + Border

:::three-columns-white

## Column 1
White/light background with border.
- Automatically handles light/dark mode
- Uses `var(--light)` theme variable
- Perfect for cleaner look

## Column 2
Same white background.
- Subtle border
- Clean appearance
- Professional look

## Column 3
Matches site background.
- Seamless integration
- Light border for definition

:::

---

### Test 3: Three Columns - Plain (No Background, No Border)

:::three-columns-plain

## Column 1
No background or border.
- Minimal styling
- Content-focused
- Clean and simple

## Column 2
Just content.
- No visual separation
- Pure columns
- Grid layout only

## Column 3
Minimalist approach.
- Focus on content
- No distractions

:::

---

## Two-Column Layouts (50/50)

### Test 4: Two Columns - Default

:::two-columns

## Left Side
Gray background with border (default).

## Right Side
Same styling throughout.

:::

---

### Test 5: Two Columns - White

:::two-columns-white

## Left Side
White background with subtle border.

## Right Side
Clean and professional appearance.

:::

---

### Test 6: Two Columns - Plain

:::two-columns-plain

## Left Side
No background or border.

## Right Side
Pure content focus.

:::

---

## Two-Column Split Layouts (2/3 and 1/3)

### Test 7: Split Layout - Default

:::two-columns-split

## Main Content (2/3 width)
Wider column with gray background and border.

Perfect for main article content.

## Sidebar (1/3 width)
Narrower sidebar.

Quick links and info.

:::

---

### Test 8: Split Layout - White

:::two-columns-split-white

## Main Content (2/3 width)
White background with border - clean and professional.

Automatically adapts to light/dark mode.

## Sidebar (1/3 width)
Matches the main column.

Clean sidebar appearance.

:::

---

### Test 9: Split Layout - Plain

:::two-columns-split-plain

## Main Content (2/3 width)
No background or border - pure content focus.

Minimal visual elements, maximum readability.

## Sidebar (1/3 width)
Simple sidebar.

No distractions.

:::

---

## Light/Dark Mode Support

✅ **All variants automatically support light/dark mode!**

- Default uses `var(--lightgray)` - adapts to theme
- White uses `var(--light)` - white in light mode, dark in dark mode
- Plain has no background - always inherits page background
- Borders use `var(--gray)` or `var(--lightgray)` - theme-aware

Try switching between light and dark mode to see the automatic adaptation!

---

## Quick Reference

### Three-Column Layouts:
```markdown
:::three-columns         # Default: gray bg + border
:::three-columns-white   # White bg + border
:::three-columns-plain   # No bg, no border
```

### Two-Column Layouts (50/50):
```markdown
:::two-columns           # Default: gray bg + border
:::two-columns-white     # White bg + border
:::two-columns-plain     # No bg, no border
```

### Two-Column Split (2/3 and 1/3):
```markdown
:::two-columns-split         # Default: gray bg + border
:::two-columns-split-white   # White bg + border
:::two-columns-split-plain   # No bg, no border
```

### Usage Example:
```markdown
:::three-columns-white

## Column 1 Title
Your content here...

## Column 2 Title
More content...

## Column 3 Title
Even more...

:::
```

---

## Customization

All styling is defined in `quartz/styles/custom.scss` and can be easily customized:

- Change background colors
- Adjust border styles
- Modify padding and spacing
- Change border radius
- Customize responsive breakpoints
