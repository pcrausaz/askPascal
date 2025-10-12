# Three Column Layout Test

This page demonstrates the three-column layout using directive syntax that works in both Obsidian and Quartz.

## Test 1: Using Simple Directive Syntax (Recommended)

Use headings (##) to separate columns automatically:

:::three-columns

## Recipes by Category
Here are the main recipe categories:
- [[tags/Appetizer|Appetizers]]
- [[tags/Dessert|Desserts]]
- [[tags/Meal|Main Courses]]
- [[tags/Side|Side Dishes]]
- [[tags/Drink|Drinks]]

**Bold text** and *italic text* work perfectly!

## Cooking Methods
Different techniques for great food:
- [[tags/Sous-Vide|Sous-Vide Cooking]]
- [[tags/Traditional|Traditional Methods]]
- Grilling & BBQ
- Baking & Roasting

[External link example](https://example.com)

## Resources
Helpful cooking resources:
1. Temperature charts
2. Conversion tables
3. Timing guides
4. Equipment recommendations

> This is a blockquote inside a column!

Code also works: `const recipe = "delicious"`

:::

---

## Test 2: Simple Content

:::three-columns

### Column A
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Markdown formatting works seamlessly.

### Column B
- Item 1
- Item 2
- Item 3

### Column C
**This is the third column** with some content.

:::

---

## Features Demonstrated

- ✅ Full markdown support inside columns
- ✅ Wiki-style links work
- ✅ External links work
- ✅ Lists (ordered and unordered)
- ✅ **Bold**, *italic*, and `code` formatting
- ✅ Blockquotes
- ✅ Responsive design (stacks on mobile/tablet)
- ✅ Works in both Obsidian and Quartz

## Syntax

The `:::three-columns` directive automatically creates three columns based on heading (##) separators:

```markdown
:::three-columns

## Column 1 Title
Your markdown content here...
- Full markdown support
- Wiki links work
- Everything renders properly

## Column 2 Title
More markdown content...

## Column 3 Title
Even more content...

:::
```

**How it works:**
- Each `##` heading starts a new column
- Use `###` for sub-headings within columns
- The plugin automatically wraps content between headings
- Responsive: stacks to single column on tablets (<1024px)
