#!/bin/sh
set -e

echo "Starting deployment script..."
echo "Initial DATABASE_URL: $DATABASE_URL"

# Ensure DATABASE_URL starts with file: for SQLite
if [ -n "$DATABASE_URL" ]; then
  case "$DATABASE_URL" in
    file:*) ;;
    *) 
      echo "Prefixing DATABASE_URL with file: protocol"
      export DATABASE_URL="file:$DATABASE_URL" 
      ;;
  esac
fi

# If DATABASE_URL is not set, default it
if [ -z "$DATABASE_URL" ]; then
   export DATABASE_URL="file:./dev.db"
   echo "DATABASE_URL not set, defaulting to $DATABASE_URL"
fi

echo "Final DATABASE_URL: $DATABASE_URL"

# Run database migrations
echo "Running database migrations..."
if [ -d "prisma" ]; then
  # Try running migration using local prisma binary
  if [ -f "./node_modules/.bin/prisma" ]; then
    ./node_modules/.bin/prisma migrate deploy || {
      echo "Migration failed! Check error above."
      echo "Listing prisma directory content for debugging:"
      ls -la prisma
      # We don't exit here to allow server to start if migration is not critical or to debug
    }
  else
    echo "Warning: Prisma CLI not found in node_modules, skipping migrations."
  fi
else
  echo "Warning: No prisma directory found, skipping migrations."
fi

# Start the server
echo "Starting Next.js server..."
echo "Current user: $(whoami)"
echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la

# Explicitly set hostname and port, though ENV vars should handle it
# Use exec to replace shell with node process for better signal handling
export HOSTNAME="0.0.0.0"
export PORT="3000"
exec node server.js
