# gamefaqs-reader

A simple electron application that helps to find and read guides from the website gamefaqs.

This application is intended to be used on a steam deck, but will run in any linux envronment that supports AppImages. Adding in windows +
mac builds is trivial is there is a desire for it running elsewhere (make a github issue).

This application is provided as-is. There is no guarantee that it will continue to work in the future. I currently use this application, so
I will continue to support it and am happy to accept PRs!

## Features

- Search gamefaqs for game guides
- Multiple zoom levels
- Controller navigation support
- Offline mode for recently viewed guides
- Save scroll position for each guide
- Search a guide for keywords
- Auto-updating

## Installing

The easiest way to install is to use the installer script [install.sh](install.sh). Take a look if you are interested in what happens.

```bash
curl -s https://raw.githubusercontent.com/amcolash/gamefaqs-reader/main/install.sh | bash
```

After the installation completes, there should be a new launcher item called "GameFAQS Reader". You can then add that as a "non-steam game"
for access in game mode.

## Icons

Icons are from font awesome and feather icons.
