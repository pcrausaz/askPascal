# Two Column Layout Tests

This page demonstrates the two-column layout options with various configurations.

## Test 1: Equal Width Two Columns

:::two-columns

## Column 1
This is the first column with equal width.
- Full markdown support
- Lists work perfectly
- **Bold** and *italic* text

## Column 2
This is the second column, also equal width.
- Same features
- Same width (50% each)
- [[test-three-columns|Links work]]

:::

---

## Test 2: Split Layout (2/3 and 1/3)

:::two-columns-split

## Main Content (2/3 width)
This column takes up 2/3 of the available space, making it ideal for main content.

You can put longer text here:
- Primary information
- Detailed explanations
- Main article content
- Images and more

**Code works too:**
```javascript
const main = "This is the wider column"
```

## Sidebar (1/3 width)
This narrower column takes 1/3 of the space.

Perfect for:
- Navigation links
- Quick links
- Table of contents
- Sidebar info

:::

---

## Test 3: Another Split Example

:::two-columns-split

## Recipe Content
### Ingredients
- 2 cups flour
- 1 cup sugar
- 3 eggs
- 1 tsp vanilla

### Instructions
1. Mix dry ingredients
2. Add wet ingredients
3. Bake at 350°F for 30 minutes
4. Let cool before serving

### Notes
This demonstrates a typical use case where you have main content on the left (recipe details) and supporting information on the right (tags, related recipes, etc.).

## Related & Tags
### Tags
- [[tags/Dessert|Dessert]]
- [[tags/Baking|Baking]]

### Related
- [[other-recipe|Similar Recipe]]
- [[another-recipe|Another One]]

### Difficulty
⭐⭐⭐ Medium

:::

---

## Styling Options

Both layouts support full markdown and have:
- ✅ Background color (customizable in CSS)
- ✅ Border (customizable in CSS)
- ✅ Padding and border-radius
- ✅ Responsive design (stacks on mobile/tablet)
- ✅ Full markdown support inside columns

### Customization

You can customize the styling in `quartz/styles/custom.scss`:

**Background color:**
```scss
.column-content {
  background-color: var(--lightgray);  // Change to any color
}
```

**Border:**
```scss
.column-content {
  border: 1px solid var(--gray);  // Customize width, style, color
  border-radius: 8px;              // Adjust corner rounding
}
```

**Column widths for split layout:**
```scss
.two-columns-split-page {
  grid-template-columns: 2fr 1fr;  // Change ratio (e.g., 3fr 2fr for 60/40 split)
}
```

## How to Use

### Equal Width (50/50):
```markdown
:::two-columns

## Column 1 Title
Content here...

## Column 2 Title
Content here...

:::
```

### Split Width (2/3 and 1/3):
```markdown
:::two-columns-split

## Main Column Title
Main content here... (2/3 width)

## Side Column Title
Sidebar content here... (1/3 width)

:::
```
