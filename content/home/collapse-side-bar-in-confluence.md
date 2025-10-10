# Collapse Side Bar in Confluence

Place the following into the body of the Custom HTML config (requires admin rights)

```
<script type="text/javascript">
AJS.toInit(function () {
    if(AJS.$('.ia-fixed-sidebar.collapsed').length == 0) {
        AJS.$('.ia-fixed-sidebar .space-tools-section .expand-collapse-trigger').click();
    }
});
</script>
```