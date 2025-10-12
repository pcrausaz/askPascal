
[[tags/recipe|All Recipes]]

Back to [[Home]]



> [!note] Viewing in Obsidian?
> The dynamic list below works in Obsidian. On the web, browse by above.
```dataview
LIST FROM #recipe 
WHERE file.name != "Sous-Vide Recipe" 
WHERE file.name != "Traditional Recipe" 
SORT file.name DESC
```
