#pragma comment(lib, "libsteam_api.so")
#include "steam_api.h"
#include "isteamutils.h"

int main() {
  if (SteamAPI_RestartAppIfNecessary(480)) {
    printf("Restarting app since it is needed.\n");
    return 1;
  }

  if (!SteamAPI_Init()) {
    printf("Fatal Error - Steam must be running to play this game (SteamAPI_Init() failed).\n");
    return 1;
  }

  printf("\n");

  if (SteamUtils()->ShowFloatingGamepadTextInput(k_EFloatingGamepadTextInputModeModeSingleLine, 0, 0, 0, 0)) {
    printf("Keyboard has been shown\n");
  } else {
    printf("Keyboard was not shown\n");
  }

  return 0;
}