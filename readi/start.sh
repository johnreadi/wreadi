#!/bin/sh
set -e

echo "Starting deployment script..."

# Ensure DATABASE_URL starts with file: for SQLite
if [ -n "$DATABASE_URL" ]; then
  case "$DATABASE_URL" in
    file:*) ;;
    *) export DATABASE_URL="file:$DATABASE_URL" ;;
  esac
fi

# If DATABASE_URL is not set, default it
if [ -z "$DATABASE_URL" ]; then
   export DATABASE_URL="file:./dev.db"
   echo "DATABASE_URL not set, defaulting to $DATABASE_URL"
fi

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
