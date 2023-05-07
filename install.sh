#!/bin/bash

# Fail on error
set -e

# Clean if --clean is passed in
if [ "$1" = "--clean" ]; then
  echo "Cleaning up"

  rm -rf ~/Applications/squashfs-root
  rm -f ~/Applications/gamefaqs-reader.AppImage
  rm -f ~/.local/share/icons/hicolor/256x256/apps/gamefaqs-reader.png
  rm -f ~/.local/share/applications/gamefaqs-reader.desktop

  exit 0
fi

echo "Installing GameFAQS Reader"

# Make directory
mkdir -p ~/Applications/
pushd ~/Applications > /dev/null

# Pre-Cleanup
rm -f gamefaqs-reader.AppImage
rm -rf squashfs-root

# Download specified or latest version of the application
if [ -z "$VERSION" ]; then
  VERSION=latest
fi

echo "Downloading version $VERSION"
wget  -q --show-progress https://github.com/amcolash/gamefaqs-reader/releases/download/$VERSION/gamefaqs-reader.AppImage

# Extract contents for icon + desktop file
echo "Extracting files"
chmod +x ./gamefaqs-reader.AppImage
./gamefaqs-reader.AppImage --appimage-extract > /dev/null

# Copy files, fix permissions
echo "Copying files"
cp squashfs-root/gamefaqs-reader.png ~/.local/share/icons/hicolor/256x256/apps
cp squashfs-root/gamefaqs-reader.desktop ~/.local/share/applications
chmod +x ~/.local/share/applications/gamefaqs-reader.desktop

# Replace .desktop launcher slightly
COMMAND="$HOME/Applications/gamefaqs-reader.AppImage --no-sandbox %U"
sed -i "s|^Exec=.*|Exec=$COMMAND|" ~/.local/share/applications/gamefaqs-reader.desktop

# Post-Cleanup
echo "Cleaning up"
rm -rf squashfs-root

# Go back to previous directory
popd > /dev/null