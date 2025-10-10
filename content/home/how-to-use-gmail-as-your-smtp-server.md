# How to use Gmail as your SMTP server

## How to use Gmail as your SMTP server

One of the little-known freebies Gmail offers is a portable SMTP server to send mail from any network for any email address.

Travellers who use their ISP's SMTP server to send mail with their email program (like Thunderbird or Outlook Express) can find themselves in a bind if they're on another network away from home, like at a coffee shop, airport or visiting relatives. But if you've got a free Gmail account (get one here) you can use Google's SMTP server to send mail through Thunderbird from [you@example.com](mailto:you@example.com) Update: Google rewrites the from address to your Gmail address..

### How to set it up

In your email client software, under Outgoing mail, set the SMTP server to smtp.google.com. Set the your username is [yourgooglemailname@gmail.com](mailto:yourgooglemailname@gmail.com) and make sure "Use username and password" is checked. Also check off "TLS" under "Use secure connection." And voila! You can send mail for any email address from any network (that lets you connect to an outside SMTP server) using your Gmail account - be sure to enter your Gmail password when prompted.

Check out Gmail's help section on POP access for Gmail for specific instructions for setting this up with your email program. If you only want to use the SMTP server, skip the POP bits and only set up SMTP to work with your existing email account.

### Update 1

I was remiss not to point out that Gmail will set the from address for messages sent through smtp.google.com to [yourgoogleemailname@gmail.com](mailto:yourgoogleemailname@gmail.com) when using this method. Profuse apologies.

A reader says: "Some clarification: I set up Gmail for a client for SMTP access, and we discovered the following huge drawback: Gmail automatically rewrites the "from" line of any e-mail you send via their SMTP gateway to your Gmail address, and it overrides any Reply-To settings you may have in your e-mail software in favor of the one in Gmail's web interface. So while Gmail's SMTP access sure is handy, it's not a perfect solution for everybody.

On the plus side, Gmail also stores and indexes anything you send via SMTP as if you had sent it using the website, so all your e-mail is still searchable and in one place. Also, since Gmail SMTP does not use port 25, I've yet to see an ISP that won't allow me to send mail through it." Thanks, David!

### Update 2

The Gmail spooler is no longer available, but a reader says Gmail invites can be had at bytetest.com. Thanks, Darin!

### Update 2

Reader Derek Bennett says, "The solution is to go into your gmail Settings:Accounts and "Make default" an account other than your gmail account. This will cause gmail to re-write the From field with whatever the default account's email address is."

```
Source: [http://www.lifehacker.com/software/email-apps/how-to-use-gmail-as-your-smtp-server-111166.php](http://www.lifehacker.com/software/email-apps/how-to-use-gmail-as-your-smtp-server-111166.php)
```