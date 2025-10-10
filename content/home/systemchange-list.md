# System:Change List

# System:Change List when askPascal was on MediaWiki

## Contents

- [1 To Do]
- [2 May 10 Update]
- [3 May 08 Update]
- [4 Web Page Counter]
- [5 Added eBooks Management]
- [6 Added email via smtp]
- [7 Added Boilerplate extension & management]
- [8 Google Analytics]
- [9 Disable PhpAdmin access from outside]
- [10 Added Extensions]
- [11 Imported Help Pages from MediaWiki]
- [12 System Pages: About, Privacy, Disclaimer]
- [13 Footer]
- [14 Logo]
- [15 Skins MonoBook.php]
  - [15.1 AdSense Code]
  - [15.2 Edit Protections]
- [16 LocalSettings.php Configurations]

## To Do

- Need to complete [Green Pepper Sauce]
- Need to complete [Morels Sauce]

## May 10 Update

- Remove referral section in left pane, inside MonoBook.php

```
    <h5>Referrals</h5>
     <div class = "pBody">
	<script type="text/javascript">
            <!--
	     google_ad_client = "pub-XXXXXXX";
	     google_ad_output = "textlink";
	     google_ad_format = "ref_text";
	     google_cpa_choice = "CAEaCO2CMYkg3UJjMABQBVBHUDQ";
	     //-->
	  </script>
        <script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script>
      </div>

```

- Changed minimum words required in biography from 50 to 0 in SpecialConfirmAccount.php

```
$wgAccountRequestMinWords = 0;

```

- Adding user account creation queue confirmation extension [Extension:ConfirmAccount](http://www.mediawiki.org/wiki/Extension:ConfirmAccount)
- Re-enable account creation by anonymous users, in LocalSettings.php, disable:

```
 # $wgGroupPermissions['*']['createaccount'] = false;

```

## May 08 Update

- Correct problem in eBook extension which inserted a blank line in all pages before the !DOCTYPE parameter....invalidating the feed. This was due to extra line feeds at the end of the extension (strange!) code.
- Added Talk with WebMaster Google Chat link in MonoBook.php
- Setup [feeds.feedburner.com/askPascal/Recipes](http://feeds.feedburner.com/askPascal/Recipes)
- Added NewsChannel extension:
```
extensions/NewsChannel/NewsChannel.php
```
- Updated to Mediawiki 1.12.0

## Web Page Counter

- Done: Changed StatCounter to WebStats (StatCounter has good data but free account locks after a certain time) . Check at [http://www.webstats4u.com/s?id=4262156](http://www.webstats4u.com/s?id=4262156)
- Done: Add old visitor count, using StatCounter--[Pascal](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 20:58, 26 February 2007 (PST)
- Done: Model it on Google Analytics:check [Google Analytics]

## Added eBooks Management

- Created \[\[Special:EBooks\]
- Created new `$wgGroupPermissions['eBooks']['ebooks'] = true;` permissions and group
- Created [EBooks\_Extension]
- Restricted access to special page to people in eBooks group

## Added email via smtp

- Changes in LocalSettings.php via moof account on 1and1
- Use reply to on askpascal

## Added Boilerplate extension & management

- \--[Pcrausaz](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 00:27, 9 December 2006 (PST)
  - Included boilerplate.php and load in LocalSettings
  - Added new page [MediaWiki:Boilerplate:Recipe](http://askpascal.com/wiki/index.php/MediaWiki:Boilerplate:Recipe) for default content
- Create [How to Create a Recipe] describing the process--[SysOp](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 00:10, 24 December 2006 (PST)

## Google Analytics

- Done: plugged Google Analytics:check [Google Analytics]\--[SysOp](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 22:23, 14 December 2006 (PST)
- Allow web site verification by adding meta tag to monobook.php `<META name="verify-v1" content="SECRET" />`
- Added Sitemap generation with special page. As per [http://www.mediawiki.org/wiki/Extension:Google\_Sitemap#Download\_and\_Installation](http://www.mediawiki.org/wiki/Extension:Google_Sitemap#Download_and_Installation)

## Disable PhpAdmin access from outside

- In the basic configuration of XAMPP, PHPMyAdmin have a public access. You can close this 'gap' with the "config.inc.php". Open the configuration file of PHPMyAdmin and edit the 'auth\_type' lines:
  - Orginal Lines
    - $cfg\['Servers'\]\[$i\]\['auth\_type'\] = 'config';
    - $cfg\['Servers'\]\[$i\]\['user'\] = 'root';
    - $cfg\['Servers'\]\[$i\]\['password'\] = 'secret';
  - Now correctly ...
    - $cfg\['Servers'\]\[$i\]\['auth\_type'\] = 'http';
    - $cfg\['Servers'\]\[$i\]\['user'\] = 'xxx';
    - $cfg\['Servers'\]\[$i\]\['password'\] = *;*

## Added Extensions

- NewsChannel --[Pascal](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 21:10, 3 May 2008 (UTC)
- ParserFunctions [http://meta.wikimedia.org/wiki/ParserFunctions\_extension](http://meta.wikimedia.org/wiki/ParserFunctions_extension)
- SpamBlacklist [http://meta.wikimedia.org/wiki/SpamBlacklist\_extension](http://meta.wikimedia.org/wiki/SpamBlacklist_extension)
- PayPal [http://www.ipbwiki.com/IpbWiki\_Paypal\_Extension](http://www.ipbwiki.com/IpbWiki_Paypal_Extension)
- Added Flash Extension [http://www.mediawiki.org/wiki/Extension:Flash\_swf](http://www.mediawiki.org/wiki/Extension:Flash_swf) --[Pcrausaz](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 15:15, 8 December 2006 (PST)
- Added WikiFeeds [http://wiki.case.edu/Special:WikiFeeds](http://wiki.case.edu/Special:WikiFeeds)

## Imported Help Pages from MediaWiki

- Reference at [Help:Copying](http://www.mediawiki.org/wiki/Help:Copying) --[Pcrausaz](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 13:48, 7 December 2006 (PST)
  - [Help:Contents](http://askpascal.com/wiki/index.php/Help:Contents)
  - [Help:Navigation](http://askpascal.com/wiki/index.php/Help:Navigation)
  - [Help:Searching](http://askpascal.com/wiki/index.php/Help:Searching)
  - [Help:Tracking changes](http://askpascal.com/wiki/index.php/Help:Tracking_changes)
  - [Help:Editing pages](http://askpascal.com/wiki/index.php/Help:Editing_pages)
  - [Help:Starting a new page](http://askpascal.com/wiki/index.php/Help:Starting_a_new_page)
  - [Help:Formatting](http://askpascal.com/wiki/index.php/Help:Formatting)
  - [Help:Links](http://askpascal.com/wiki/index.php/Help:Links)
  - [Help:Categories](http://askpascal.com/wiki/index.php/Help:Categories)
  - [Help:Images](http://askpascal.com/wiki/index.php/Help:Images)
  - [Help:Templates](http://askpascal.com/wiki/index.php/Help:Templates)
  - [Help:Tables](http://askpascal.com/wiki/index.php/Help:Tables)
  - [Help:Variables](http://askpascal.com/wiki/index.php/Help:Variables)
  - [Help:Managing files](http://askpascal.com/wiki/index.php/Help:Managing_files)
  - [Help:Preferences](http://askpascal.com/wiki/index.php/Help:Preferences)
  - [Help:Namespaces](http://askpascal.com/wiki/index.php/Help:Namespaces)
  - [Help:Interwiki linking](http://askpascal.com/wiki/index.php/Help:Interwiki_linking)
  - [Help:Special pages](http://askpascal.com/wiki/index.php/Help:Special_pages)
  - [Template:PD Help Page](http://askpascal.com/wiki/index.php/Template:PD_Help_Page)
  - [Template:Languages](http://askpascal.com/wiki/index.php/Template:Languages)
  - [Template:Meta](http://askpascal.com/wiki/index.php/Template:Meta)
  - [Template:Admin tip](http://askpascal.com/wiki/index.php/Template:Admin_tip)
  - [Template:Prettytable](http://askpascal.com/wiki/index.php/Template:Prettytable)
  - [Template:Hl2](http://askpascal.com/wiki/index.php/Template:Hl2)
  - [Template:Hl3](http://askpascal.com/wiki/index.php/Template:Hl3)
  - [File:Example.jpg](http://askpascal.com/wiki/index.php?title=Special:Upload&wpDestFile=Example.jpg)

## System Pages: About, Privacy, Disclaimer

- Modified (--[Pcrausaz](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 15:49, 2 December 2006 (PST)):
  - privacy - this is a link only. Edit [MediaWiki:Privacy](http://askpascal.com/wiki/index.php/MediaWiki:Privacy) for the link text and [AskPascal:Privacy\_policy] for the wiki page to which to link.
  - about - this is a link only. Edit [MediaWiki:Aboutsite](http://askpascal.com/wiki/index.php/MediaWiki:Aboutsite) for the link text and [AskPascal:About] for the wiki page to which to link.
  - disclaimer - this is a link only. Edit [MediaWiki:Disclaimers](http://askpascal.com/wiki/index.php/MediaWiki:Disclaimers) for the link text and [AskPascal:General\_disclaimer] for the wiki page to which to link.

## Footer

- Shorten footer text in
  - [MediaWiki:Lastmodifiedat](http://askpascal.com/wiki/index.php/MediaWiki:Lastmodifiedat)
  - [MediaWiki:Viewcount](http://askpascal.com/wiki/index.php/MediaWiki:Viewcount)
  - \--[Pcrausaz](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 15:49, 2 December 2006 (PST)

## Logo

- Created logo and favicon logo images. Check [System:Logo Design] for details--[Pcrausaz](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 14:43, 2 December 2006 (PST)
- Modified LocalSettings.php to include pointer to logo image: $wgLogo=""
- Modified htdocs\\xampp\\index.php to include **"<link rel="shortcut icon" href="../favicon.ico">"** --[Pcrausaz](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 22:55, 4 December 2006 (PST)
- Modified wiki/index.php to include meta icon info (see above) --[Pcrausaz](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 22:56, 4 December 2006 (PST)
- also add Favicon.ico in wiki directory (this one should be sufficient)

## Skins MonoBook.php

### AdSense Code

- Inserted into ./skins/MonoBook.php --[Pcrausaz](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 22:08, 30 November 2006 (PST)
- Check [System:Google AdSense] for details --[Pcrausaz](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 22:08, 30 November 2006 (PST)
- PC: Ad Sense Insert --[Pcrausaz](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 22:41, 4 December 2006 (PST)

### Edit Protections

- PC: Modified to allow edit only by people logged in
- PC: hide the section edit links for users who are not logged in? --[Pcrausaz](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 22:41, 4 December 2006 (PST)

## LocalSettings.php Configurations

- Added Custom Logo personalization --[Pcrausaz](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 20:52, 1 December 2006 (PST)
  - $wgLogo="![AskPascal.png](http://askpascal.com:8080/wiki/images/7/79/AskPascal.png)
";
- Check how to restrict type of files to be uploaded --[Pcrausaz](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 22:08, 30 November 2006 (PST)
  - $wgFileExtensions = array('gif','png','jpg','jpeg','xls','doc','ppt','wmv','swf');
  - $wgVerifyMimeType = false;
  - $wgStrictFileExtensions = false;
  - $wgCheckFileExtensions = false;

- Enable File Upload: Changed $wgEnableUploads = true; --[Pcrausaz](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 22:08, 30 November 2006 (PST)
- Anonymous Protections --[Pcrausaz](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 22:08, 30 November 2006 (PST)
  - To disable account creation by anonymous visitors
  - $wgGroupPermissions\['\*'\]\['createaccount'\] = false;
  - To require that users log in to edit
  - It's worth noting that if you set this, you may also want to set
  - $wgGroupPermissions\['\*'\]\['edit'\] = false;
  - $wgShowIPinHeader = false; # For non-logged in users
- Define new namespace for Recipes --[Pcrausaz](http://askpascal.com/wiki/index.php?title=User:Pcrausaz&action=edit&redlink=1) 22:08, 30 November 2006 (PST)
  - $wgExtraNamespaces = array(100 => "Recipe");
  - $wgNamespacesWithSubpages += array(100 => true);
  - $wgNamespacesToBeSearchedDefault += array(100 => true);