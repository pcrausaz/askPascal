# Quartz Customization Documentation

This document describes all custom modifications made to this Quartz installation to support advanced features like three-column layouts using directive syntax.

## Three-Column Layout Feature

### Problem Solved

Enable three-column layouts in markdown that:
1. Use full markdown syntax (not raw HTML)
2. Work in both Obsidian and Quartz-generated sites
3. Are responsive (stack on mobile/tablet)
4. Support all markdown features (links, lists, formatting, etc.)

### Solution Architecture

The solution uses **remark-directive** syntax with a custom transformer plugin and CSS styling.

### Components

#### 1. Package Dependencies

**Added packages:**
- `remark-directive@^4.0.0` - Enables directive syntax parsing in markdown
- `hastscript@^9.0.1` - Helper for creating HTML AST nodes

**Installation:**
```bash
npm install remark-directive hastscript --force
```

Note: Used `--force` flag due to Node version mismatch (project requires Node >= 22, but v20.19.4 was used).

#### 2. Custom Transformer Plugin

**File:** `quartz/plugins/transformers/custom-directives.ts`

**Purpose:** Converts `:::three-columns` directive syntax into proper HTML structure with automatic column separation based on heading markers.

**Implementation:**
```typescript
// quartz/plugins/transformers/custom-directives.ts
import { QuartzTransformerPlugin } from "../../types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"
import remarkDirective from "remark-directive"
import { h } from "hastscript"

export const CustomDirectives = (): QuartzTransformerPlugin => ({
  name: "CustomDirectives",
  markdownPlugins() {
    return [
      remarkDirective,
      () => {
        return (tree: Root) => {
          visit(tree, ["containerDirective", "leafDirective", "textDirective"], (node: any) => {
            // Handle three-column layout directive
            if (node.name === "three-columns") {
              const data = node.data || (node.data = {})

              // Create wrapper div with three-columns-page class
              data.hName = "div"
              data.hProperties = { className: ["three-columns-page"] }

              // Wrap each child in a column-content div
              if (node.children && Array.isArray(node.children)) {
                const wrappedChildren: any[] = []
                let currentColumn: any[] = []

                for (const child of node.children) {
                  // Check if this is a section separator (heading with depth <= 3)
                  if (child.type === "thematicBreak" || (child.type === "heading" && child.depth <= 3)) {
                    // If we have accumulated content, wrap it
                    if (currentColumn.length > 0) {
                      wrappedChildren.push({
                        type: "paragraph",
                        data: {
                          hName: "div",
                          hProperties: { className: ["column-content"] }
                        },
                        children: currentColumn
                      })
                      currentColumn = []
                    }
                    // Add the heading/hr to the new column
                    currentColumn.push(child)
                  } else {
                    currentColumn.push(child)
                  }
                }

                // Wrap remaining content
                if (currentColumn.length > 0) {
                  wrappedChildren.push({
                    type: "paragraph",
                    data: {
                      hName: "div",
                      hProperties: { className: ["column-content"] }
                    },
                    children: currentColumn
                  })
                }

                node.children = wrappedChildren
              }
            }

            // Handle generic div directive
            else if (node.name === "div") {
              const data = node.data || (node.data = {})
              const hast = h(node.name, node.attributes || {})

              data.hName = hast.tagName
              data.hProperties = hast.properties
            }
          })
        }
      },
    ]
  },
})
```

**Key Implementation Details:**
1. Uses `remarkDirective` to parse directive syntax
2. Detects `##` headings (depth <= 3) as column separators
3. Automatically wraps content between headings in `column-content` divs
4. Parent wrapper gets `three-columns-page` class for CSS Grid layout
5. Also supports generic `:::div` directive for flexibility

**Configuration:** Already registered in `quartz.config.ts` in the transformers array.

#### 3. CSS Styling

**File:** `quartz/styles/custom.scss`

**Three-column layout classes:**

```scss
// Three-column layout using directive syntax
.three-columns-page {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 2rem 0;

  // Ensure child divs stretch to full height
  & > div {
    display: flex;
    flex-direction: column;
  }
}

// Responsive: stack on tablets
@media (max-width: 1024px) {
  .three-columns-page {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

// Column content styling
.column-content {
  background-color: var(--lightgray);
  padding: 1.5rem;
  border-radius: 8px;

  // Ensure markdown inside renders properly
  & > *:first-child {
    margin-top: 0;
  }

  & > *:last-child {
    margin-bottom: 0;
  }

  // Style headings within columns
  & h2 {
    color: var(--secondary);
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }

  // Style lists within columns
  & ul, & ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  & li {
    margin: 0.3rem 0;
  }
}
```

**Features:**
- CSS Grid for flexible layout
- Responsive design (stacks on screens < 1024px)
- Styled boxes with padding and background color
- Proper markdown content spacing
- Uses Quartz theme variables for consistent styling

### Usage

#### Basic Syntax (Recommended)

The `:::three-columns` directive automatically creates three columns based on heading (##) separators:

```markdown
:::three-columns

## Column 1 Title
Your markdown content here...
- Full markdown support
- Wiki links work: [[other-page]]
- **Bold** and *italic* work
- External links: [example](https://example.com)

## Column 2 Title
More markdown content...
- Everything renders properly
- Lists work perfectly
- Code: `const foo = "bar"`

## Column 3 Title
Even more content...
> Blockquotes work too!

:::
```

**How it works:**
- Each `##` heading (or `###`) starts a new column
- Use `###` or lower for sub-headings within columns
- The plugin automatically wraps content between headings
- Responsive: stacks to single column on tablets (<1024px)

#### Example Files

- **Test Page**: `content/test-three-columns.md` - Complete working examples demonstrating all features
- **Real Usage**: `content/index-new.md` - Example of applying three-column layout to actual content

### Obsidian Compatibility

**Obsidian Support:**
- Directive syntax requires the [Obsidian Admonitions](https://github.com/javalent/admonitions) plugin or native container directive support
- Alternatively, use the [Obsidian Extended Syntax](https://github.com/ebullient/obsidian-task-collector) plugin
- The syntax renders as plain text in Obsidian without plugins, but converts properly in Quartz

**Recommended Obsidian Setup:**
1. Install "Obsidian Admonitions" plugin
2. Configure it to support custom directives
3. Add CSS snippet for three-column layout matching Quartz styles

**Alternative:** Use Obsidian's CSS snippets to style the directive text for preview purposes.

### Testing

**Local Testing:**
```bash
# Build and serve
npm run quartz build -- --serve

# View at http://localhost:8080/test-three-columns
```

**Test Page:**
- Navigate to `/test-three-columns` to see working examples
- Test responsive behavior by resizing browser window
- Verify all markdown features render correctly

### Browser Compatibility

- **Desktop:** 3 columns side-by-side (>1024px width)
- **Tablet:** Single column stack (<=1024px width)
- **Mobile:** Single column stack (<=1024px width)

### Limitations

1. **Column Count:** Currently fixed at 3 columns - 2-column or 4-column layouts would require CSS modifications
2. **Obsidian:** Requires plugins for proper preview rendering (directive syntax shows as text)
3. **Node Version:** Project requires Node >= 22 (packages installed with `--force` on Node 20.x)
4. **Column Separation:** Must use `##` or `###` headings to separate columns - content without headings won't be split

### Future Enhancements

Possible improvements:
1. Support for 2-column and 4-column layouts
2. Custom column widths
3. Different background colors per column
4. Column gap customization via directive attributes
5. Better Obsidian integration

### Maintenance Notes

**When Updating Quartz:**
1. Check if `remark-directive` compatibility is maintained
2. Verify `custom-directives.ts` plugin still works
3. Test that CSS classes aren't overridden by Quartz updates
4. Re-test the example page after updates

**Files Modified:**
- `package.json` - Added dependencies (`remark-directive`, `hastscript`)
- `quartz/plugins/transformers/custom-directives.ts` - Complete rewrite to support heading-based column separation
- `quartz/styles/custom.scss` - Added three-column layout styles with responsive design

**Files Added:**
- `content/test-three-columns.md` - Test and example file demonstrating all features
- `content/index-new.md` - Example of real-world usage with recipe categories
- `quartz_customization.md` - This documentation

### Troubleshooting

**Issue:** Directives appear as text, not rendered as HTML
- **Solution:** Ensure `remark-directive` is installed (`npm install remark-directive --force`)
- **Solution:** Verify `CustomDirectives()` is in transformers array in `quartz.config.ts`
- **Solution:** Check that the plugin is properly importing `remarkDirective`

**Issue:** Columns stack vertically instead of displaying side-by-side
- **Solution:** Ensure you're using `##` headings to separate columns (not just plain text)
- **Solution:** Verify the directive name is exactly `three-columns` (not `three-column` or other variants)
- **Solution:** Check browser width is > 1024px (responsive design stacks on smaller screens)
- **Solution:** Inspect HTML in browser DevTools to ensure `.three-columns-page` class is present

**Issue:** Columns don't stack on mobile
- **Solution:** Check that `custom.scss` is being loaded
- **Solution:** Verify media query breakpoint (1024px)
- **Solution:** Clear browser cache

**Issue:** Markdown doesn't render inside columns
- **Solution:** Ensure you're using the simple `:::three-columns` syntax with `##` heading separators
- **Solution:** Do NOT nest `:::div` directives - use the heading-based approach
- **Solution:** Check that hastscript is properly creating HTML nodes
- **Solution:** Verify the plugin is using `data.hName` and `data.hProperties`

**Issue:** Build fails with type errors
- **Solution:** Check TypeScript imports (`Root` from `mdast` not `hast`)
- **Solution:** Ensure all dependencies are installed (`remark-directive`, `hastscript`)
- **Solution:** Run `npm run check` to verify TypeScript compilation

### References

- [remark-directive documentation](https://github.com/remarkjs/remark-directive)
- [Quartz custom plugins guide](https://quartz.jzhao.xyz/advanced/making-plugins)
- [hastscript documentation](https://github.com/syntax-tree/hastscript)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

---

**Last Updated:** October 12, 2025
**Quartz Version:** 4.5.2
**Tested On:** macOS (Darwin 25.0.0), Node v20.19.4
