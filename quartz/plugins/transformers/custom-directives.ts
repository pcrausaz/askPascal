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
            // Handle multi-column layout directives with style variants
            const columnDirectiveRegex = /^(three-columns|two-columns|two-columns-split)(-white|-plain)?$/
            const match = node.name?.match(columnDirectiveRegex)

            if (match) {
              const data = node.data || (node.data = {})
              const baseLayout = match[1]  // e.g., "three-columns"
              const variant = match[2]     // e.g., "-white", "-plain", or undefined

              // Create wrapper div with appropriate class
              const className = `${baseLayout}-page`
              data.hName = "div"
              data.hProperties = { className: [className] }

              // Determine column content class based on variant
              let columnContentClass = "column-content"  // default (gray background + border)
              if (variant === "-white") {
                columnContentClass = "column-content-white"
              } else if (variant === "-plain") {
                columnContentClass = "column-content-plain"
              }

              // Wrap each child in a column-content div
              if (node.children && Array.isArray(node.children)) {
                const wrappedChildren: any[] = []
                let currentColumn: any[] = []

                for (const child of node.children) {
                  // Check if this is a section separator (horizontal rule or heading)
                  if (child.type === "thematicBreak" || (child.type === "heading" && child.depth <= 3)) {
                    // If we have accumulated content, wrap it
                    if (currentColumn.length > 0) {
                      wrappedChildren.push({
                        type: "paragraph",
                        data: {
                          hName: "div",
                          hProperties: { className: [columnContentClass] }
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
                      hProperties: { className: [columnContentClass] }
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
