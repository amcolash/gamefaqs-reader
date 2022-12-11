# gamefaqs-reader

A react app that reads gamefaqs guides

## Getting a Cookie

Use this command: `$ curl -s -I https://gamefaqs.gamespot.com/ | grep set-cookie:\ gf_dvi`

Add `COOKIE="gf_dvi=**************;"` to a file called `.env`.

This cookie is supposed to last for one year, repeat steps with new cookie to refresh.
