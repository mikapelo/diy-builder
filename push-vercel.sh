#!/bin/bash
# Push vers GitHub → déclenche rebuild Vercel automatiquement
cd "$(dirname "$0")"
git push
