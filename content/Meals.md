
[[tags/meal|Main Courses]]

Back to [[Home]]

> [!note] Viewing in Obsidian?
> The dynamic list below works in Obsidian. On the web, browse by above.
```dataview
LIST FROM #meal 
WHERE file.name != "Sous-Vide Recipe" 
WHERE file.name != "Traditional Recipe" 
SORT file.name DESC
```
