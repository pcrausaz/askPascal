
> [!WARNING] Obsolete

### Remote Mac

- Open System Preferences -> Sharing -> Apple Remote Desktop
  - Start
  - Open Access Privilege
    - Set Access Privileges to allow "VNC viewers may control screen with password"
    - Give it a password.

### local Mac

- Install [Chicken of the VNC]
- Open a Terminal Window and type
```
ssh -L 5900:127.0.0.1:5900 username@remote.mac.addr.com
```
  - Start [Chicken of the VNC] and connect to localhost on port 5900 display 0

ssh will tunnel your port 5900 traffic encrypted to the remote Mac.

# Secure VNC (MacOS X to Windows XP)

### Remote PC

- Install VNC \[[UltraVNC](http://ultravnc.sourceforge.net/)\]
  - Make sure to set "allow loopback connections"
- Install OpenSSH
  - Use \[[CygWin](http://www.cygwin.com/)\]
    - Download the install and update utility
    - Make sure to select the OpenSSH package (in the Net category)
    - Start CygWin
    - Set the password for the user
    - Configure SSH from the Cygwin console
```
$ ssh-host-config
```
    - Answer yes to the priviledge separation question and to the create sshd user question
    - Answer yes to install ssh as a service
    - set CYGWIN=ntsec tty
    - Start ssh
```
 net start sshd
```

You can later on create a shortcut or bat file to start it automatically

```
C:\cygwin\cygwin.bat  "-S sshd"
```

  
Full details in [http://www.redbooks.ibm.com/abstracts/TIPS0408.html?Open](http://www.redbooks.ibm.com/abstracts/TIPS0408.html?Open)