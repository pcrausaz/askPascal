
```
Sorry I can not remember where I first found this script.
```

```
(*
Expose Fix

If you are going to modify this script, I recommend saving a copy and modifying the copy in the event you render it unusable!

To save as a Run Only Application, go to File->Save As... (CMD-SHIFT-S), change the File Format to Application, and the only option that should be checked is "Run Only". Click Save.

This script modifies the keyboard shortcuts of Expose and Dashboard to the default values.
To modify the shortcuts used, use the following values for each shortcut:
{mouse button:0/1/2/3/4,
function key:F1/F10/F11/F12/F13/F2/F3/F4/F5/F6/F7/F8/F9/left command/left control/left option/left shift/none/right command/right control/right option/right shift/secondary function key,
function key modifiers:{command/control/none/option/shift},
mouse button modifiers:{command/control/none/option/shift}
}
set the properties of the all windows shortcut to {mouse button:4}

*)

tell application "System Events"
	if UI elements enabled then
		tell expose preferences
			set the properties of the application windows shortcut to {function key:F10}
			set the properties of the show desktop shortcut to {function key:F11}
			set the properties of the dashboard shortcut to {function key:F12}
		end tell
	else
		tell application "System Preferences"
			activate
			set current pane to pane "com.apple.preference.universalaccess"
			display dialog "UI element scripting is not enabled. Check \"Enable access for assistive devices\""
		end tell
	end if
end tell
```