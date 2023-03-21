# PK Library of SQLite TS/JS features for both backend (node) & frontend (react, etc)

1 Feb 2023

Copyright 2023 - Paul Kirkaas - pkirkaas@gmail.com

Includes - common env independent functionality

## Dependencies:

pk-ts-node-lib

sqlite & sqlite3


## Installation:

**NB: SQLITE INSTALLS BINARIES - so MUST RUN in same env as install (ie: Linux OR Windows)**

For now - have to create a ./tmp/ dir to create the test db

If using git hooks to build, MUST ADD .git-hooks dir, scripts, & hooksPath = .git/hooks in .git/config/core

common contains environment independent features, that are included included in both client & node libraries, which have additional env functionality

