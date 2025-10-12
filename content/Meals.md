```dataview
LIST FROM #meal 
WHERE file.name != "Sous-Vide Recipe" 
WHERE file.name != "Traditional Recipe" 
SORT file.name DESC
```
