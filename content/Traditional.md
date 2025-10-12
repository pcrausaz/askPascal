```dataview
LIST FROM #traditional 
WHERE file.name != "Sous-Vide Recipe" 
WHERE file.name != "Traditional Recipe" 
SORT file.name DESC
```
