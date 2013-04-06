# Collaborative Todos

[![Todos Screenshot](https://github.com/googledrive/realtime-tasks/raw/master/screenshot.png)](http://googledrive.github.io/realtime-tasks)

## Overview

A simple todo list based off [TodoMVC](http://todomvc.com/), [AngularJS](https://www.angularjs.org),
and the [Google Drive Realtime API](https://developers.google.com/drive/realtime).

You can try out the app on its [live instance](http://googledrive.github.io/realtime-tasks).

## Installation and Configuration

The project can run on any static web server.

## Building from source

If you don't already have [Yeoman](http://yeoman.io/), [Grunt](http://gruntjs.com/), and [Bower](http://twitter.github.com/bower/) you can install with:

    npm install -g yo grunt-cli bower

Fetch the source for the app:

    git clone https://github.com/googledrive/realtime-tasks.git
    cd realtime-tasks
    npm install
    bower install

### Create a Google APIs project and Activate the Drive API

First, you need to activate the Drive API for your app. You can do it by configuring your API project in the Google APIs Console.

- Create an API project in the [Google APIs Console](https://developers.google.com/console).
- Select the "Services" tab and enable the Drive API.
- Select the "API Access" tab in your API project, and click "Create an OAuth 2.0 client ID".
- In the Branding Information section, provide a name for your application (e.g. "Realtime Tasks"), and click Next. Providing a product logo is optional.
- In the Client ID Settings section, do the following:
  - Select Web application for the Application type
  - Click the more options link next to the heading, Your site or hostname.
  - List your hostname in the Authorized Redirect URIs and JavaScript Origins fields.
  - Click Create Client ID.
- In the **API Access** page, locate the section **Client ID for Web applications** and note the **Client ID** value.
- List your hostname in JavaScript origins in the Client ID settings.
- Go to the **Drive SDK** page and copy the **App ID**.

To enable integration with the Drive UI, go the **Drive SDK** page.

- Set the **Open URL** to `http://YOURHOST/#/todos/{ids}/?user={userId}` 
- Check the **Create With** option and set the **New URL** to `http://YOURHOST/#/create?user={userId}`

Adjust the above URLs as needed for the correct hostname or path. Localhost is currently not allowed.

### Setup your App information

You should now have your **Client ID** and your **App ID**.  Update the `CONFIG` object in `app.js` appropriately.

### Deploy, run that's it!

You can run a local server with grunt:

    grunt server


## Contributing

Before creating a pull request, please fill out either the individual or
corporate Contributor License Agreement.

* If you are an individual writing original source code and you're sure you
own the intellectual property, then you'll need to sign an
[individual CLA](http://code.google.com/legal/individual-cla-v1.0.html).
* If you work for a company that wants to allow you to contribute your work
to this client library, then you'll need to sign a
[corporate CLA](http://code.google.com/legal/corporate-cla-v1.0.html).

Follow either of the two links above to access the appropriate CLA and
instructions for how to sign and return it. Once we receive it, we'll add you
to the official list of contributors and be able to accept your patches.
