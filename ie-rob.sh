#!/usr/bin/env bash
# Author: Thomas Aylott
# More info about this stuff: http://www.singularity.be/2008/03/using-rdesktop-to-script-windows.html

URL="${1:-http://localhost/}"

IP="$(ifconfig en1 |grep 'inet '|cut -d ' ' -f 2)" # use en0 for ethernet
URL="$(echo "$URL"|sed -E "s/localhost/$IP/")"

CMD="\"C:\Program Files\Internet Explorer\IEXPLORE.EXE\" $URL"
CMD="cmd.exe /K $CMD & logoff"

HOST="192.168.1.20:33891"; rdesktop -T IE6 -k en-us -r clipboard:PRIMARYCLIPBOARD -s "$CMD" -g 1240x1024 -u rob -p rob "$HOST" &
HOST="192.168.1.20:33892"; rdesktop -T IE7 -k en-us -r clipboard:PRIMARYCLIPBOARD -s "$CMD" -g 1240x1024 -u rob -p rob "$HOST" &
HOST="192.168.1.20:33893"; rdesktop -T IE8 -k en-us -r clipboard:PRIMARYCLIPBOARD -s "$CMD" -g 1240x1024 -u rob -p rob "$HOST" &
HOST="192.168.1.20:33894"; rdesktop -T IE9 -k en-us -r clipboard:PRIMARYCLIPBOARD -s "$CMD" -g 1240x1024 -u rob -p rob "$HOST" &
