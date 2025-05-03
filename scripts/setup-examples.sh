#!/bin/bash

# Load environment variables
source ../.env.local

# Run the scripts to create example data
echo "Setting up example data for R.I.S.E. Retreat..."
echo "================================================"

echo "1. Creating example organizer..."
node create-example-organizer.js

echo "================================================"
echo "2. Creating example client with notes, files, and messages..."
node create-example-client.js

echo "================================================"
echo "Setup complete! You can now view the example client in the organizer dashboard."
echo "Navigate to: http://localhost:3000/organizer/clients"
echo "Then click on 'Sophie Martin' to see the detailed client view."
