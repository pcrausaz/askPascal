// Port of the v4 askPascal custom-directives transformer.
// Turns :::two-columns / :::three-columns / :::two-columns-split (+ -white/-plain
// variants) container directives into column-layout divs, splitting children into
// columns at each thematic break or heading of depth <= 3. Also supports a
// generic :::div{...} directive.
import { visit } from "unist-util-visit"
import remarkDirective from "remark-directive"
import { h } from "hastscript"

export const manifest = {
  name: "custom-directives",
  displayName: "Custom Directives",
  description: "Multi-column layout container directives for askPascal",
  version: "1.0.0",
  category: "transformer",
}

const CustomDirectives = () => ({
  name: "CustomDirectives",
  markdownPlugins() {
    return [
      remarkDirective,
      () => (tree) => {
        visit(tree, ["containerDirective", "leafDirective", "textDirective"], (node) => {
          const columnDirectiveRegex =
            /^(three-columns|two-columns|two-columns-split)(-white|-plain)?$/
          const match = node.name?.match(columnDirectiveRegex)

          if (match) {
            const data = node.data || (node.data = {})
            const baseLayout = match[1]
            const variant = match[2]

            data.hName = "div"
            data.hProperties = { className: [`${baseLayout}-page`] }

            let columnContentClass = "column-content"
            if (variant === "-white") columnContentClass = "column-content-white"
            else if (variant === "-plain") columnContentClass = "column-content-plain"

            if (node.children && Array.isArray(node.children)) {
              const wrappedChildren = []
              let currentColumn = []

              const flush = () => {
                if (currentColumn.length > 0) {
                  wrappedChildren.push({
                    type: "paragraph",
                    data: {
                      hName: "div",
                      hProperties: { className: [columnContentClass] },
                    },
                    children: currentColumn,
                  })
                  currentColumn = []
                }
              }

              for (const child of node.children) {
                if (
                  child.type === "thematicBreak" ||
                  (child.type === "heading" && child.depth <= 3)
                ) {
                  flush()
                  currentColumn.push(child)
                } else {
                  currentColumn.push(child)
                }
              }
              flush()

              node.children = wrappedChildren
            }
          } else if (node.name === "div") {
            const data = node.data || (node.data = {})
            const hast = h(node.name, node.attributes || {})
            data.hName = hast.tagName
            data.hProperties = hast.properties
          }
        })
      },
    ]
  },
})

export default CustomDirectives
