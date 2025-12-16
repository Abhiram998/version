#!/usr/bin/env bash
set -e

echo "Installing frontend dependencies"
npm install

echo "Building frontend"
npm run build

echo "Frontend build complete"
