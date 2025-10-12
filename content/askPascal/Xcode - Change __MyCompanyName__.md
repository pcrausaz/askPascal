
> [!NOTE] Does that even still work?


### Change \_\_MyCompanyName\_\_

Tired of seeing \_\_MyCompanyName\_\_ in all your files? To get your own reference in the header comments of all your Xcode files, you can set the default company name in Xcode with:

```
defaults write com.apple.Xcode PBXCustomTemplateMacroDefinitions -dict ORGANIZATIONNAME "Acme, Inc."
```