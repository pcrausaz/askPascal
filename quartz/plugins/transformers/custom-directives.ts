// quartz/plugins/transformers/custom-directives.ts
import { QuartzTransformerPlugin } from "../../types"
import { Root } from "hast"
import { visit } from "unist-util-visit"

export const CustomDirectives = (): QuartzTransformerPlugin => ({
  name: "CustomDirectives",
  markdownPlugins() {
    return [
      () => {
        return (tree: Root) => {
          visit(tree, ["containerDirective", "leafDirective", "textDirective"], (node) => {
            if (node.name === "div") {
              // Change the node type to a standard div element
              // @ts-ignore
              node.type = "div" 
              if (node.attributes?.class) {
                // @ts-ignore
                node.properties = { className: node.attributes.class.split(' ') }
              }
            }
          })
        }
      },
    ]
  },
})
