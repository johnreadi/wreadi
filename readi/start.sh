#!/bin/sh
set -e

echo "Starting deployment script..."
echo "Current user: $(whoami)"
echo "Current directory: $(pwd)"

# Environment Variable Checks
echo "--- Environment Check ---"
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set!"
  # We don't exit here because sometimes it might be set in .env file which Prisma reads
else 
  echo "DATABASE_URL is set."
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
  echo "WARNING: NEXTAUTH_SECRET is not set! This may cause 500 errors if using NextAuth."
fi

if [ -z "$NEXTAUTH_URL" ]; then
  echo "WARNING: NEXTAUTH_URL is not set. Defaulting to localhost or inferred."
fi

# Run database migrations (or push schema)
echo "--- Database Sync ---"
if [ -d "prisma" ]; then
  # Try running db push using local prisma binary
  if [ -f "./node_modules/.bin/prisma" ]; then
    echo "Running prisma db push..."
    # Using db push instead of migrate deploy because we switched providers
    # and don't have valid migrations for Postgres yet.
    ./node_modules/.bin/prisma db push --accept-data-loss || {
      echo "ERROR: DB Push failed! Check database connection and credentials."
      # We don't exit here to allow server to start if it's just a connection issue we want to debug
    }
    
    # Run seed script if it exists
    if [ -f "prisma/seed.js" ]; then
      echo "Running seed script..."
      node prisma/seed.js || echo "Seeding failed (non-fatal)"
    else
      echo "No seed script found at prisma/seed.js"
    fi

    # Run DB check script
    if [ -f "prisma/check-db.js" ]; then
      echo "Running DB check script..."
      node prisma/check-db.js || echo "DB check failed (non-fatal)"
    fi
  else
    echo "Warning: Prisma CLI not found in node_modules, skipping db sync."
  fi
else
  echo "Warning: No prisma directory found, skipping db sync."
fi

# Start the server
echo "--- Starting Server ---"
echo "Listing files in public/uploads:"
ls -la public/uploads || echo "public/uploads not found or not accessible"

# Explicitly set hostname and port
export HOSTNAME="0.0.0.0"
export PORT="3000"

echo "Launching node server.js..."
exec node server.js
