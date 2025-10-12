- [Ton of tricks](#ton-of-tricks)
- [Single Application Mode](#single-application-mode)
- [Bluetooth A2DP audio quality on Mac OS X](#bluetooth-a2dp-audio-quality-on-mac-os-x)
- [Screenshots from the command line](#screenshots-from-the-command-line)
  - [All options](#all-options)
  - [Standard Screenshots](#standard-screenshots)
  - [Capturing a screenshot to the clipboard](#capturing-a-screenshot-to-the-clipboard)
  - [Taking Screenshots with a Timer](#taking-screenshots-with-a-timer)
  - [Specifying a file type](#specifying-a-file-type)
  - [Quieting the snap](#quieting-the-snap)
  - [Sending the Screenshot Directly to Mail](#sending-the-screenshot-directly-to-mail)
- [Stop Outlook from changing your server address underneath you](#stop-outlook-from-changing-your-server-address-underneath-you)
- [Interesting list of hacks](#interesting-list-of-hacks)
- [Interesting list of hacks](#interesting-list-of-hacks)
- [MacBook Pro, Discrete Graphic and Battery Life](#macbook-pro-discrete-graphic-and-battery-life)
- [Open Preference Panes from the Function Keys](#open-preference-panes-from-the-function-keys)
- [Make Internet Sharing DHCP work with an Xbox/Xbox 360 Network](#make-internet-sharing-dhcp-work-with-an-xboxxbox-360-network)
- [Run your screensaver as a desktop image](#run-your-screensaver-as-a-desktop-image)
- [Show/Hide hidden file in open/save dialogs](#showhide-hidden-file-in-opensave-dialogs)
- [Fixing Juniper Network after installing Snow Leopard](#fixing-juniper-network-after-installing-snow-leopard)
- [Display unsupported volumes in Time Machine](#display-unsupported-volumes-in-time-machine)
- [Create a Time Machine size limit for networked disks](#create-a-time-machine-size-limit-for-networked-disks)
- [Don't like the new dock](#dont-like-the-new-dock)
- [Menu Bar](#menu-bar)
  - [White Menu Bar](#white-menu-bar)
  - [Grayish Menu Bar](#grayish-menu-bar)
  - [Translucent Menu Bar](#translucent-menu-bar)
- [Replace your startup background picture](#replace-your-startup-background-picture)
- [Replace your stack icons](#replace-your-stack-icons)
- [Open data from a pipeline in any application](#open-data-from-a-pipeline-in-any-application)
- [Find what process locks a file](#find-what-process-locks-a-file)
- [Add useful toolbar buttons to Screen Sharing](#add-useful-toolbar-buttons-to-screen-sharing)
- [Bandwidth Throttling in OS X](#bandwidth-throttling-in-os-x)
- [Reset of the F-Key](#reset-of-the-f-key)
- [Disable Space switching on Command-Tab in 10.5.2](#disable-space-switching-on-command-tab-in-1052)
- [Change the Finder's default Find window](#change-the-finders-default-find-window)
- [Dot Clean](#dot-clean)
- [Inspect Installer Packages](#inspect-installer-packages)
- [Installing a Secure Subversion](#installing-a-secure-subversion)
- [Enabling Developer Menu in Safari](#enabling-developer-menu-in-safari)
- [Reset a user's password in single user mode](#reset-a-users-password-in-single-user-mode)
- [Syslog Messages](#syslog-messages)
- [Accessing iDisk using WebDav](#accessing-idisk-using-webdav)

  

Slow SMB connections

If you experience slow connections to windows server (smb://) try the following in terminal

```
 sudo sysctl -w net.inet.tcp.delayed_ack=0

```

to make the fix permanent

```
 sudo pico /etc/sysctl.conf

```

to create/edit sysctl.conf then add the following line

```
  net.inet.tcp.delayed_ack=0

```

see [https://discussions.apple.com/message/4595699#4595699](https://discussions.apple.com/message/4595699#4595699)

# Ton of tricks

[https://github.com/mathiasbynens/dotfiles/blob/master/.osx?os-x-10.8](https://github.com/mathiasbynens/dotfiles/blob/master/.osx?os-x-10.8)

# Single Application Mode

Nifty little trick to avoid distractions: Single Application mode can be turned on by

```
defaults write com.apple.dock single-app -bool true
killall Dock 

```

To revert same procedure but use false. Source: [http://zackshapiro.com/post/26300586593/single-application-mode-my-favorite-hidden-feature-of](http://zackshapiro.com/post/26300586593/single-application-mode-my-favorite-hidden-feature-of)

# Bluetooth A2DP audio quality on Mac OS X

Increase the minimum bit rate negotiated by your mac:

```
defaults write com.apple.BluetoothAudioAgent "Apple Bitpool Min (editable)" 40

```

Adjust the value up for higher quality, or down if you have connection problems.

Source: [http://danwarne.com/fix-bluetooth-a2dp-audio-quality-mac-os/](http://danwarne.com/fix-bluetooth-a2dp-audio-quality-mac-os/)

# Screenshots from the command line

## All options

```
screencapture -?

```

## Standard Screenshots

The screenshot will be stored in your home directory, or you can specify another path and filename in place of “test.jpg.”

```
screencapture test.jpg 

```

## Capturing a screenshot to the clipboard

You can also capture a screenshot to your Mac’s clipboard instead of outputting the image to a file by typing the following command instead:

```
screencapture -c 


```

## Taking Screenshots with a Timer

```
screencapture -T 10 timed.jpg

```

Amount of time (in seconds)

## Specifying a file type

The screencapture tool is able to export as png, PDF, tiff, jpg, and gif, using the following command and flag:

```
screencapture -t tiff myscreen.tiff

```

## Quieting the snap

```
screencapture -x screen.jpg 

```

## Sending the Screenshot Directly to Mail

```
screencapture -M screen.jpg

```

After the screenshot has been taken, a new Mail message will be opened, and the screenshot will automatically be included as an attachment.

# Stop Outlook from changing your server address underneath you

Open Apple Script editor, paste following script there, and execute it.

```
tell application "Microsoft Outlook"
    set background autodiscover of exchange account "NameOfAccount" to false
end tell

```

Of course subtitle 'NameOfAccount' by the name of your account as defined in outlook. Thanks to Vlad for that lifesaver trick.

# Interesting list of hacks

[https://gist.github.com/2260182](https://gist.github.com/2260182)

# Interesting list of hacks

[https://gist.github.com/2260182](https://gist.github.com/2260182)

# MacBook Pro, Discrete Graphic and Battery Life

Credit to Vlad for this one,I am switching back to Safari as Chrome also forces the use of discrete graphics. He found that despite being supposed to switch back to the integrated graphic, some apps like Skype and Chrome force the use of the discrete graphic card hence reducing the battery life dramatically, Skype and Chrome are two know apps which forces the discrete graphic. Now for the solution, a small - free - app allows to control which card get uses in which condition:[http://codykrieger.com/gfxCardStatus](http://codykrieger.com/gfxCardStatus) It shows the icon on a toolbar showing which card is used, also allow you to lock specific card or to use auto switch mode. And the most important, you can force to use integrated card while on battery and leave default switching mode (or force discrete card) when on power source (this is in app preferences and you need to restart to make new preference active). Pretty cool, now I'm on the battery for 4 hours, and it still shows 3+ hours remaining. So, check it out.

# Open Preference Panes from the Function Keys

You can visit the corresponding preference panes by pressing the Option key with the function key of any given feature. For example, hitting Option+F1 or Option+F2 will take you to the Display preference pane, and hitting Option with F10, F11, or F12 will take you to the Sound preference pane (assuming your brightness keys are F1 and F2 and your Volume keys are F10-F12).

# Make Internet Sharing DHCP work with an Xbox/Xbox 360 Network

See [xBox360]

# Run your screensaver as a desktop image

Use a lot of CPU but way cool

```
/System/Library/Frameworks/ScreenSaver.framework/Resources/ScreenSaverEngine.app/Contents/MacOS/ScreenSaverEngine -background

```

# Show/Hide hidden file in open/save dialogs

When you have the Open or Save dialog open in an application, you can type the following keyboard shortcut to toggle between showing and hiding the hidden files in a given directory:

```
Command-Shift-. (period)

```

If you have your Mac adjusted for a region where the comma is the decimal separator of fraction numbers, or if you are using a keyboard with a comma instead a point on the numerical keyboard, then the shortcut is

```
Command-Shift-, (comma)

```

This has to be the comma on the numerical keyboard.

Source: [http://www.macosxhints.com/article.php?story=20090915152215383](http://www.macosxhints.com/article.php?story=20090915152215383)

# Fixing Juniper Network after installing Snow Leopard

After installing Apple latest Snow Leopard OS, I noticed that Network Connect did not work. Juniper does not seem to have a fix yet, but the following seems to solve the problem, open terminal then type:

```
sudo chmod 755 /usr/local/juniper/nc/[version number]/
sudo mkdir '/Applications/Network Connect.app/Contents/Frameworks'

```

You will need of course to change \[version number\] by your the version of the tool you are using.

Source: [http://www.thevagary.net/archives/2009/08/make\_network\_connect\_work\_in\_s.html](http://www.thevagary.net/archives/2009/08/make_network_connect_work_in_s.html)

# Display unsupported volumes in Time Machine

[Volker Weber](http://vowe.net/) found the command to get Time Machine to support network volumes: Open Terminal and type:

```
    defaults write com.apple.systempreferences TMShowUnsupportedNetworkVolumes 1

```

Careful, this feature has been turned off by Apple right before the release, most likely these type of backup are not reliable.

Source: [Engadget](http://www.engadget.com/2007/11/10/how-to-enable-time-machine-on-unsupported-volumes/)

# Create a Time Machine size limit for networked disks

When using Time Machine to back up on a network drive (see above); it will fill the disk with backups. The following trick enables the creation of a limited volume sized for Time Machine to retricts its backup size (handy).

When you use TM with a network drive, it creates a .sparsebundle disk image to put the backup data into. The disk image has a capacity of 2.75 TB. The trick is to create another sparsebundle disk image of a given capacity (i.e. 300GB) on network disk. Use 'Mac OS Extended (Case-sensitive, Journaled)' as the volume format in Disk Utility. Name the volume the same as the volume used by Time Machine (it should be Backup of computerName), and save it to something like test.sparsebundle.

Now, turn urn off Time Machine, mount your Time Machine backup image (by opening the .sparsebundle disk image on your network) and your newly-created disk image; use Disk Utility to 'restore' the Time Machine disk image into your new image. Click on the 'Erase Destination' button in order to allow Disk Utility to make a block copy of your Time Machine disk image. Wait for the process to finish.

Once finished, unmount both images and open a Finder window into your network drive. Note the name of the disk image used by Time Machine; it should be computerName\_ABC123DEF.sparsebundle, where ABC123DEF is your MAC address. Delete this image, and rename your test.sparsebundle to this name. Then, restart Time Machine. Voila. It will use no more than the size your specified.

Source: [http://www.macosxhints.com/article.php?story=20071108020121567](http://www.macosxhints.com/article.php?story=20071108020121567)

# Don't like the new dock

Open Terminal and type:

```
    defaults write com.apple.dock no-glass -boolean YES

```

# Menu Bar

Open Terminal and Type:

## White Menu Bar

```
 sudo defaults write /System/Library/LaunchDaemons/com.apple.WindowServer 'EnvironmentVariables' -dict 'CI_NO_BACKGROUND_IMAGE' 1

```

**Warning** Sudo command so be careful.

## Grayish Menu Bar

```
 sudo defaults write /System/Library/LaunchDaemons/com.apple.WindowServer 'EnvironmentVariables' -dict 'CI_NO_BACKGROUND_IMAGE' 0

```

## Translucent Menu Bar

```
 sudo defaults delete /System/Library/LaunchDaemons/com.apple.WindowServer 'EnvironmentVariables'

```

# Replace your startup background picture

Simply replace this file:

```
    /System/Library/CoreServices/DefaultDesktop.jpg

```

# Replace your stack icons

Stack icons are always changing, updating based on the top document in the stack. Quite annoying. Here is a way to get it set to one type of icon. First, make sure the stack folder is sorted by date modified (ctrl-click/right-click/Sort by:) place the icon in the stack folder to get it to update, now change the access modified date using the unix command touch. Open up Terminal and type:

```
       cd ~/yourstackfolder
       touch -mt 202001010101.01 "yourstackfolder"

```

  
**Warning: Hum...sounds like a bad idea to change the modified date, I wonder if this affects Time Machine..**

Source: [http://t.ecksdee.org/post/19001860](http://t.ecksdee.org/post/19001860) Icon Set: [click here](http://homepage.mac.com/WebObjects/FileSharing.woa/wa/DRAWERS_icon__1.zip.zip?a=downloadFile&user=chys&path=Sites/icon/DRAWERS_icon_%231.zip)

# Open data from a pipeline in any application

The open command provides a -f option you can use to load the data into nearly any application. Simply combine the -f flag with the -a flag:

```
   * curl '[http://askpascal.com/wiki/index.php/Main_Page'] | open -a 'TextMate' -f
   * curl '[http://askpascal.com/wiki/images/7/79/AskPascal.png'] | open -a 'Preview' -f

```

It works with any source, any other command and does not need to be text. It can be any type of data, the only catch is that the open command will save the data into a file with the .txt extnsion independently of the type of data. Some apps get confused by this.

Source: [http://www.macosxhints.com/article.php?story=2008031505562229](http://www.macosxhints.com/article.php?story=2008031505562229)

# Find what process locks a file

In Terminal

```
  lsof | grep nameoffile

```

myapp 279 you 3r REG 14,2 106204 1466023 /Users/you/nameoffile.txt You can then issue a kill command to lock the process

```
  kill 279

```

# Add useful toolbar buttons to Screen Sharing

You can enable toolbar buttons that will put you in full-screen mode or allow you to "curtain" (hide the screen of) the remote Mac. It requires the Property List Editor installed (part of the Developer Tools). To add the toolbar buttons:

```
  1. Make sure that you've used the screen sharing feature in Leopard at least once to ensure that a prefs file is created. Quit it if it is running already.
  2. In Terminal enter the following, all on one line:

```

# Bandwidth Throttling in OS X

Use ipfw to limit bandwidth on specific ports.

Create a pipe that only allows up to 15KB/s to go through:

```
  sudo ipfw pipe 1 config bw 15KByte/s

```

Attach that pipe to the outgoing traffic on port 80, effectively limiting the outgoing traffic of the web server:

```
  sudo ipfw add 1 pipe 1 src-port 80

```

When done, remove the pipe from the port

```
  sudo ipfw delete 1

```

Source: [http://www.macosxhints.com/index.php?page=2](http://www.macosxhints.com/index.php?page=2)

# Reset of the F-Key

I started to play WoW again, unfortunately the beast overwrite the fkey setting rendering the expose and other dashboard fkey useless, you need to reset the key after each sessions.

  
I found a little script that re-assign the key properly, you can get the content here [Reset FKey Script]

# Disable Space switching on Command-Tab in 10.5.2

There is a new hidden dock preference which prevent the automatic switch to the application space when using command tab to switch to an application.

```
defaults write com.apple.Dock workspaces-auto-swoosh -bool NO

```

Make sure to restart the dock for the command to apply:

```
killall Dock

```

To revert the setting set the parameter to YES or use

```
delete com.apple.Dock workspaces-auto-swoosh

```

**Note:** This one works well only if you do not assign your application to specific spaces. If you do have an app associated with a given space then you will get strange and confusing results but if you do not ... it does marvels. Source: [http://www.macosxhints.com/article.php?story=2008021122525348](http://www.macosxhints.com/article.php?story=2008021122525348)

# Change the Finder's default Find window

This allows you to tailor the Finder's Find (Command-F) window.

Copy the following into TextEdit, make it plain text, and save it to the Desktop as default\_smart.plist:

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "[http://www.apple.com/DTDs/PropertyList-1.0.dtd](http://www.apple.com/DTDs/PropertyList-1.0.dtd)">
<plist version="1.0">
<dict>
  <key>CompatibleVersion</key>
  <integer>1</integer>
  <key>RawQuery</key>
  <string>((_kMDItemGroupId > 6))</string>
  <key>SearchCriteria</key>
  <dict>
    <key>CurrentFolderPath</key>
    <string>/</string>
    <key>FXCriteriaSlices</key>
    <array>
      <dict>
        <key>criteria</key>
        <array>
          <string>com_apple_SearchSystemFilesAttribute</string>
          <integer>1220</integer>
        </array>
        <key>displayValues</key>
        <array>
          <string>SEARCH_SYSTEM_FILES</string>
          <string>YES</string>
        </array>
        <key>rowType</key>
        <integer>0</integer>
        <key>subrows</key>
        <array/>
      </dict>
    </array>
    <key>FXScope</key>
    <integer>0</integer>
    <key>FXScopeArrayOfPaths</key>
    <array>
      <string>kMDQueryScopeComputer</string>
    </array>
  </dict>
  <key>ViewOptions</key>
  <dict>
    <key>SidebarWidth</key>
    <integer>135</integer>
    <key>ToolbarVisible</key>
    <true/>
    <key>ViewHeight</key>
    <integer>582</integer>
    <key>ViewStyle</key>
    <string>icnv</string>
    <key>WindowBounds</key>
    <dict>
      <key>bottom</key>
      <integer>850</integer>
      <key>left</key>
      <integer>457</integer>
      <key>right</key>
      <integer>1207</integer>
      <key>top</key>
      <integer>268</integer>
    </dict>
  </dict>
  <key>Version</key>
  <string>10.5.3</string>
</dict>
</plist>

```

  
This version of Finder's search box shows the user's home folder as a place to search, includes all system files, is taller than the original window, and the cursor displays in the search box. Note that the ViewHeight field is the difference between bottom and top. So you can adjust it, and the window's width, to suit your needs.

To change the default Find window (this backs up the old one):

```
cd /System/Library/CoreServices/Finder.app/Contents/Resources 
sudo cp default_smart.plist default_smart.plist.bak

```

To activate your modified search box, use this command:

```
sudo cp /Users/{username}/Desktop/default_smart.plist default_smart.plist

```

Replace {username} with your user's short username.

To return to the original file:

```
cd /System/Library/CoreServices/Finder.app/Contents/Resources 
sudo cp default_smart.plist.bak default_smart.plist

```

Source: [http://www.macosxhints.com/article.php?story=20080229204517495](http://www.macosxhints.com/article.php?story=20080229204517495)

# Dot Clean

To clean up '.' files in a directory, usefull for windows director (smb) or USB keys

In Terminal type:

```
dot_clean /path/folder 

```

This will join the dot-underscore files with their parent files. Read OS X 10.5's manual pages (man dot\_clean) for more information.

Source: [http://www.macworld.com/article/132556/2008/04/geekfactor2504.html](http://www.macworld.com/article/132556/2008/04/geekfactor2504.html)

# Inspect Installer Packages

To see a list of installed packages, in Terminal type:

```
pkgutil —pkgs and press return. 

```

Each entry in the list represents a package ID; you can use that string to get more information on any particular package. For instance, if you’d like to know every file that was installed with the recent security update, just type the following (but without the line breaks), and then press return:

```
pkgutil —files com.apple.pkg .update.security.2007 .009 | more 

```

Source:[http://www.macworld.com/article/132556/2008/04/geekfactor2504.html](http://www.macworld.com/article/132556/2008/04/geekfactor2504.html)

# Installing a Secure Subversion

Check [Secure Subversion]

Source: [http://www.sonzea.com/articles/subversion-trac.html](http://www.sonzea.com/articles/subversion-trac.html)

# Enabling Developer Menu in Safari

Open terminal and type, use 1 to show and 0 to hide the Developer menu

```
% defaults write com.apple.Safari IncludeDebugMenu 1

```

# Reset a user's password in single user mode

To reset the password on a Leopard system:

```
  1. Boot into single user mode (press Command-S at power on)
  2. Type fsck -fy
  3. Type mount -uw /
  4. Type launchctl load /System/Library/LaunchDaemons/com.apple.DirectoryServices.plist
  5. Type dscl . -passwd /Users/username password, replacing username with the targeted user and password with the desired password.
  6. Reboot

```

This allows you to reset the password in single user mode without booting from the install media.

  
Source: [http://www.macosxhints.com/article.php?story=20080414140636495](http://www.macosxhints.com/article.php?story=20080414140636495)

# Syslog Messages

To enable your Leopard system to receive network syslog submissions edit

```
     /System/Library/LaunchDaemons/com.apple.syslogd.plist 

```

uncomment the lines specified in the comments so that the end of the file looks something like this:

```
      <!--
	Un-comment the following lines to enable the network syslog protocol listener.
      -->
		<key>NetworkListener</key>
		<dict>
			<key>SockServiceName</key>
			<string>syslog</string>
			<key>SockType</key>
			<string>dgram</string>
		</dict>

```

Then execute the following commands:

```
     sudo launchctl unload /System/Library/LaunchDaemons/com.apple.syslogd.plist
     sudo launchctl load /System/Library/LaunchDaemons/com.apple.syslogd.plist

```

That is enough to get an apple base station to dump it's log into the system log.

# Accessing iDisk using WebDav

Looks like the Finder sometimes has issues with iDisk (disconnect etc...). A nice way around it is to use a WebDav connection. Most FTP application (Flow, Transmit, CyberDuck etc...) now support WebDAV.

Simply select WebDav as the protocol and then use a URL in the form of

```
https://idisk.mac.com/membername
```