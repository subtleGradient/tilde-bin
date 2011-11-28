#!/usr/bin/env bash
# Use this as a replacement for `git log`, it should work exactly the same, except spit out Jira urls instead of log messages
# e.g.
#   git-log-jira EXTJSIV origin/extjs-4.1.0 --since="last monday"
#   git-log-jira TOUCH origin/touch-2.0.0 --since="last monday"

SEARCH="$1";shift
git log --grep="$SEARCH" "$@" |grep "$SEARCH"|sed -E 's|^.*('"$SEARCH"'[-_\s][0-9]*).*$|https://sencha.jira.com/browse/\1|g'|sort|uniq
