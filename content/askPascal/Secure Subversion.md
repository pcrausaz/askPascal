> [!WARNING] You should move to git

# Installing a secure SVN

Source: [http://www.sonzea.com/articles/subversion-trac.html](http://www.sonzea.com/articles/subversion-trac.html)

# Create a subversion repository

If you don't already have one, create a subversion repository:

```
# cd /usr/local
# svnadmin create repo

```

Now create the basic structure and commit your changes to the repository.

```
$ cd /tmp
$ svn co file:///usr/local/repo
$ cd repo
$ svn mkdir tags branches trunk
A         tags
A         branches
A         trunk
$ svn ci -m "initial structure"
Adding         branches
Adding         tags
Adding         trunk

```
```
Committed revision 1.

```

# Enable HTTP access

Configure Apache HTTPD to enable accessing our Subversion repository using HTTP:

Create a file called httpd-subversion.conf in /etc/apache2/extra and put this in the contents:

```
LoadModule dav_svn_module     libexec/apache2/mod_dav_svn.so
LoadModule authz_svn_module   libexec/apache2/mod_authz_svn.so

<Location /repo>
   DAV svn
   SVNPath /usr/local/repo
</Location>

```

Add these lines to your **httpd.conf** file just after the SSL/TLS include:

```
# Subversion
Include /private/etc/apache2/extra/httpd-subversion.conf

```

Note that I am at times referring to the directory /etc and at other times I will refer to /private/etc. For the most part, it doesn't matter which you use. Apple has symlinked /etc to /private/etc, and I have tried to follow their convention of referring to the directory as /private/etc where they have already established that naming, for example, in the httpd configuration files. Most of the time, however, I prefer the more standard convention of /etc.

Stop and restart the Apache HTTP server by unchecking and then checking web sharing in System Preferences or by issuing the apachectl restart command.

Open Safari, and try to access your repository. Enter [http://localhost/repo](http://localhost/repo) in your address bar. If all is good you should see the three directories you created above. If you are having problems, the Console application (in /Applications/Utilities) is a good place to look.

So far so good, but this is not very secure. Anyone can access and also write to this repository. Lets work on securing it a bit.

# Enable SSL on your Web Server

The apache configuration shipped by apple does not have SSL turned on. Before we can do that, we need to have a certificate. I'm assuming you're not planing on buying one from Verisign or Thawte so lets create our own! Here we will create self-signed certificates for Apache HTTP using the OpenSSL command line tools. These instructions have been adapted from the excellent resources at [http://www.tc.umn.edu/~brams006/selfsign.html](http://www.tc.umn.edu/~brams006/selfsign.html).

```
  1. Generate your own Certificate Authority (CA)

```
```
     # openssl genrsa -des3 -out ca.key 4096
     enter password

```
```
     # openssl req -new -x509 -days 365 -key ca.key -out ca.crt
     re-enter password from above

```
```
     Country Name (2 letter code) [AU]: US
     State or Province Name (full name) [Some-State]: State
     Locality Name (eg, city) []: City
     Organization Name (eg, company) []: company name
     Organizational Unit Name (eg, section) []:
     Common Name (eg, YOUR name) []: My CA
     Email Address []:

```
```
  2. Generate a server key

```
```
     # openssl genrsa -des3 -out server.key 4096
     Enter pass phrase for server.key: ****

```
```
  3. Generate a certificate signing request (CSR)

```
```
     # openssl req -new -key server.key -out server.csr
     Country Name (2 letter code) [AU]:US
     State or Province Name (full name) [Some-State]:State
     Locality Name (eg, city) []:City
     Organization Name (eg, company) []: company name
     Organizational Unit Name (eg, section) []:
     Common Name (eg, YOUR name) []: servername
     Email Address []:
     A challenge password []:
     An optional company name []:

```
```
     The servername entered for the CN should match your web server's DNS name.
  4. Sign the CSR with the CA

```
```
     # openssl x509 -req -days 3650 -in server.csr -CA ca.crt \
     	-CAkey ca.key -set_serial 01 -out server.crt
     Signature ok
     subject=/C=US/ST=State/L=City/O=company/CN=server
     Getting CA Private Key
     Enter pass phrase for ca.key: *****

```
```
  5. Make an insecure version of the key

```
```
     This is needed so that Apache does not prompt for a passkey every time it is started. However, you need to make sure to protect the integrity of the resulting server.key file.

```
```
     # openssl rsa -in server.key -out server.key.insecure
     Enter pass phrase for server.key:
     writing RSA key
     # mv server.key server.key.secure
     # mv server.key.insecure server.key

```
```
     # cp server.key /etc/apache2/server.key
     # cp server.crt /etc/apache2/server.crt

```
```
     # chmod 600 server.key
     # chmod 600 server.crt

```
```
  6. Edit /etc/apache2/httpd.conf and uncomment the include directive for the SSL configuration file. Change:

```
```
     # Secure (SSL/TLS) connections
     #Include /private/etc/apache2/extra/httpd-ssl.conf

```
```
     to

```
```
     # Secure (SSL/TLS) connections
     Include /private/etc/apache2/extra/httpd-ssl.conf

```
```
  7. Start and stop web sharing from system preferences.

```

At this point, your HTTPS server should be functional. In Safari type [https://hostname/](https://hostname/) in your address bar. You should see the root page of your installation. The same page you would see for [http://hostname/](http://hostname/).

# Make the Subversion repository require SSL

At this point we will edit the HTTPD configuration files so that any access to the repository must be done through HTTPS. This will be especially important later when authentication is enabled. If you attempt to perform Basic HTTP authentication over HTTP, the password will be transmitted in clear text. Performing Basic Authentication on a HTTPS connection is considerably more secure as the password will be transmitted in an encrypted form.

Also, lets edit the subversion.conf file so it looks like this:

```
LoadModule dav_svn_module     libexec/apache2/mod_dav_svn.so
LoadModule authz_svn_module   libexec/apache2/mod_authz_svn.so

<Location /repo>
   DAV svn
   SVNPath /usr/local/repo

   SSLRequireSSL
</Location>

```

Start and stop web sharing from system preferences again.

In Safari type [https://hostname/repo/](https://hostname/repo/) in your browser, you should see your repository. Try [http://hostname/repo/](http://hostname/repo/) and you should get a Forbidden error.

Still, we aren't authenticating the user. The reason we set up SSL is so that we could use basic authentication and the password would not be passed in plain text. At this point setting up authentication is not that hard.

This is described in detail at [http://svnbook.red-bean.com/nightly/en/svn.serverconfig.httpd.html#svn.serverconfig.httpd.authn.basic](http://svnbook.red-bean.com/nightly/en/svn.serverconfig.httpd.html#svn.serverconfig.httpd.authn.basic)

Create the authentication file.

```
# htpasswd -cm /etc/apache2/subversion.auth harry
New password: *****
Re-type new password: *****
Adding password for user harry
# chmod 600 subversion.auth 
# chown _www /etc/apache2/subversion.auth 

```

I'll give a basic configuration that allows for blanket access control. More complex examples are in the Subversion book at [http://svnbook.red-bean.com/nightly/en/svn.serverconfig.httpd.html#svn.serverconfig.httpd.authz](http://svnbook.red-bean.com/nightly/en/svn.serverconfig.httpd.html#svn.serverconfig.httpd.authz)

Edit your httpd-subversion.conf file again to look like this:

```
LoadModule dav_svn_module     libexec/apache2/mod_dav_svn.so
LoadModule authz_svn_module   libexec/apache2/mod_authz_svn.so

```
```
<Location /repo>
   DAV svn
   SVNPath /usr/local/repo

```
```
   # Require SSL connection for password protection.
   SSLRequireSSL

   # how to authenticate a user
   AuthType Basic
   AuthName "Subversion repository"
   AuthUserFile /private/etc/apache2/subversion.auth

   # only authenticated users may access the repository
   Require valid-user
</Location>

```

Stop and restart the Web sharing again, and go back to Safari. When you access [https://localhost/repo](https://localhost/repo) you should be prompted to log in. Log in using the credentials you created above, and Voila! you should be set.

At this point you have a functional and secure subversion server operating on port 443 using HTTPs. If thats enough for you, great! I also like to use TRAC in conjunction with subversion. Setting that up is straightforward with the tools that Leopard has provided us.

Here, I'm going to describe how to do this using mod\_fastcgi. Initially, I wanted to use mod\_python, since that is how I like to run TRAC, and was running it before upgrading to Leopard. Unfortunately, the mod\_python installation does not want to build a 64-bit binary, and the httpd in a fat binary containing 64 bit images, which my G5 happily runs. Until this is sorted out, I'll use fast cgi.

First, lets get TRAC running standalone.

# Install TRAC

The TracInstall page lists several dependencies for TRAC, but many of these are happily included in Leopard, such as SQLite or Python 2.5. However, there are a few things you will need to obtain.

From [http://www.clearsilver.net/downloads/](http://www.clearsilver.net/downloads/) get [http://www.clearsilver.net/downloads/clearsilver-0.10.5.tar.gz](http://www.clearsilver.net/downloads/clearsilver-0.10.5.tar.gz)

Extract, configure and build

```
$ tar xzf clearsilver-0.10.5.tar.gz 
$ cd clearsilver-0.10.5
$ ./configure --with-python=/usr/bin/python
$ make
$ sudo make install

```

perhaps also

```
$ cd python
$ sudo python setup.py install

```

Download the 0.10.4 TRAC distribution from [http://ftp.edgewall.com/pub/trac/trac-0.10.4.tar.gz](http://ftp.edgewall.com/pub/trac/trac-0.10.4.tar.gz). Then extract and install the system:

```
$ tar zxf trac-0.10.4.tar.gz
$ cd trac-0.10.4
$ sudo python ./setup.py install

```

Create your TRAC environment with

```
$ sudo trac-admin /usr/local/trac initenv
$ sudo chown -R _www /usr/local/trac

```

Start the stand-alone server

```
$ tracd --port 8000 /usr/local/trac

```

Open up your browser and go to [http://localhost:8000/trac](http://localhost:8000/trac). Looks good!

Now, kill that stand-alone server and lets get this running under Apache.

# Configure Apache to run TRAC using FastCGI

Create a file at /private/etc/apache2/extra called httpd-fastcgi.conf and add the following contents:

```
# Enable fastcgi for .fcgi files
<IfModule mod_fastcgi.c>
   AddHandler fastcgi-script .fcgi
   FastCgiIpcDir /private/var/run/fastcgi 
</IfModule>

LoadModule fastcgi_module libexec/apache2/mod_fastcgi.so

```

Create a file at /private/etc/apache2/extra called httpd-trac.conf and add the following contents:

```
ScriptAlias /trac /usr/local/share/trac/cgi-bin/trac.fcgi
FastCgiConfig -initial-env TRAC_ENV=/usr/local/trac

```
```
<Location "/trac">
  SetEnv TRAC_ENV "/usr/local/trac"
</Location>

```
```
<Directory "/usr/local/share/trac/cgi-bin">
    AllowOverride None
    Options None
    Order allow,deny
    Allow from all
</Directory>

```

As before, add include directives into your httpd.conf file to these new files:

```
# FastCGI
Include /private/etc/apache2/extra/httpd-fastcgi.conf

```
```
# TRAC
Include /private/etc/apache2/extra/httpd-trac.conf

```

Restart the server and try the URLS [http://localhost/trac](http://localhost/trac) and [https://localhost/trac](https://localhost/trac). These should both work, but at this point you are not required to authenticate to access the TRAC project.

## Secure your TRAC installation

As with the Subversion repository above, the TRAC installation needs to be secured so that you are not transmitting sensitive information in the clear. Requiring authentication will have other benefits for TRAC as much of the bug tracking system works best when users are logged in as a specific user rather than as a guest.

Add the following to the Location block above to secure the TRAC site:

```
 # Require SSL connection for password protection.
 SSLRequireSSL

```
```
 AuthType Basic
 AuthName "TRAC Project"
 AuthUserFile /private/etc/apache2/subversion.auth

```
```
 Require valid-user

```

Restart the server and then go back to [https://localhost/trac](https://localhost/trac). Your browser should now require authentication. And there you have it!

Source: [http://www.sonzea.com/articles/subversion-trac.html](http://www.sonzea.com/articles/subversion-trac.html)