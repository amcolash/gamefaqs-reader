#!/bin/sh

echo "Compiling\n"
g++ -I./sdk/public/steam -Wl,-rpath,. main.cpp libsteam_api.so -o toggle_keyboard

echo "\nLinks\n"
ldd toggle_keyboard

echo "\nRunning\n"
./toggle_keyboard