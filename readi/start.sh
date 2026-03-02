#!/bin/sh
set -e

echo "Starting deployment script..."
echo "Initial DATABASE_URL: $DATABASE_URL"

# No need to force file: protocol anymore as we are using PostgreSQL
# The DATABASE_URL from Dokploy (postgresql://...) is correct

# Run database migrations (or push schema)
echo "Syncing database schema..."
if [ -d "prisma" ]; then
  # Try running db push using local prisma binary
  if [ -f "./node_modules/.bin/prisma" ]; then
    # Using db push instead of migrate deploy because we switched providers
    # and don't have valid migrations for Postgres yet.
    ./node_modules/.bin/prisma db push --accept-data-loss || {
      echo "DB Push failed! Check error above."
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
echo "Starting Next.js server..."
echo "Current user: $(whoami)"
echo "Current directory: $(pwd)"
echo "Listing files in public/uploads:"
ls -la public/uploads || echo "public/uploads not found or not accessible"

# Explicitly set hostname and port, though ENV vars should handle it
# Use exec to replace shell with node process for better signal handling
export HOSTNAME="0.0.0.0"
export PORT="3000"
exec node server.js
