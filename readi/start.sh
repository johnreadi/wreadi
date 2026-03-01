#!/bin/sh
set -e

echo "Starting deployment script..."

# Run database migrations
echo "Running database migrations..."
if [ -d "prisma" ]; then
  # Try running migration using local prisma binary
  if [ -f "./node_modules/.bin/prisma" ]; then
    ./node_modules/.bin/prisma migrate deploy
  else
    echo "Warning: Prisma CLI not found in node_modules, skipping migrations."
  fi
else
  echo "Warning: No prisma directory found, skipping migrations."
fi

# Start the server
echo "Starting Next.js server..."
# Explicitly set hostname and port, though ENV vars should handle it
node server.js
