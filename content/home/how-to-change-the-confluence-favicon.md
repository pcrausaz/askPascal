# How to change the Confluence favicon

Source: [https://confluence.atlassian.com/display/DOC/Changing+the+Confluence+Browser+Icon,+aka+favicon](https://confluence.atlassian.com/display/DOC/Changing+the+Confluence+Browser+Icon,+aka+favicon)

The Confluence logo ![](http://confluence.atlassian.com/images/icons/favicon.png)

 is displayed in the user's browser to identify the Confluence browser tab. To use a custom image for your Confluence site:

1. Obtain or create an image in ICO file format. To maximise browser compatibility, it should be 32x32 pixels in size, 71x71 DPI (dots per inch) and have an 8 bit colour depth.
2. Inside the root of your Confluence installation directory, find the `confluence` subdirectory.
3. Back up the file `favicon.ico`.
4. Replace the `favicon.ico` file with your custom ICO image.
5. Restart your application server.

Users may need to clear their browser cache before they will see the new image. This can be done by pressing ctrl+refresh in the browser when a page in Confluence is open.