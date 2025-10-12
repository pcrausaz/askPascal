
> [!NOTE] Obsolete
> Moved to XBox One a long time ago


**Restarting Internet Sharing** Try something like this in a user daemon (use Lingon)

```
 sudo sh -c 'kill $(cat /var/run/bootpd.pid)'

```

**Make Internet Sharing DHCP work with an Xbox/Xbox 360 Network**

Many people have noticed that the Xbox and Xbox 360 will not obtain an IP address from a Mac running Internet Sharing using DHCP. (Apparently some other devices have the same problem, but I don't have any of them to test with.) One workaround is to simply set the Xbox to use a static IP, DNS server(s), etc. That will certainly work, but it may be inconvenient and is definitely inelegant.

This hint will allow your Xbox to obtain its IP, DNS info, and so on from the Mac using DHCP. You need to have administrator privileges on the Mac in question, and the procedure is different on 10.4 vs. 10.5. (Presumably older systems were similar to 10.4, but I haven't tested on anything older than 10.4.10.).

**10.4:**

I haven't had much time to interact with the 10.4 machine I have access to, so I haven't tested this as much. Some variation on this procedure may be necessary to get the change to stick -- in particular, you may need to perform it more than once, or start and/or stop Internet Sharing before performing it. Also, the restart at the end may be unnecessary (though you do need to start and stop Internet Sharing somehow). Please post your experience in the comments, if someone hasn't already.

```
  1. Start Internet Sharing if it's not already running.
  2. Open NetInfo Manager, located in /Applications » Utilities. Authenticate as an administrator using the lock icon in the lower-left.
  3. Navigate to the /config/dhcp node (so that dhcp is selected in the browser pane).
  4. In the lower pane, find the reply_threshold_seconds property and change its value from 4 to 0.
  5. Quit NetInfo Manager and then restart your Mac.
  6. After the restart, open NetInfo Manager again and confirm that reply_threshold_seconds is still 0.

```

**10.5:**

The following procedure is confirmed to work as written.

```
  1. Start Internet Sharing if it's not already running.
  2. In Terminal, type cp /etc/bootpd.plist /tmp/bootpd.plist
  3. Stop Internet Sharing.
  4. Open /tmp/bootpd.plist for editing using TextEdit or whatever.
  5. Locate this section of the file, near the end:

```
```
     <key>reply_threshold_seconds</key>
     <integer>4</integer>

```
```
  6. Change the value 4 to 0.
  7. In Terminal, type sudo cp /tmp/bootpd.plist /etc
  8. Start Internet Sharing.
  9. If you want to, check that your change to /etc/bootpd.plist hasn't been reverted. 

```

Source: [http://www.macosxhints.com/article.php?story=20071223001432304](http://www.macosxhints.com/article.php?story=20071223001432304)