```dataview
LIST FROM #sous-vide 
WHERE file.name != "Sous-Vide Recipe" 
WHERE file.name != "Traditional Recipe" 
SORT file.name DESC
```
