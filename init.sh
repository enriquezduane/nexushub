#!/bin/bash

npm uninstall bcrypt

npm install bcrypt

node models/database/seed.js

clear

npm run devStart