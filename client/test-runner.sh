#!/bin/bash

# Start the React app in the background
npm run dev &

# Store its PID
REACT_PID=$!

# Wait for React app to be up
for _ in {1..30}; do
    if curl -s http://localhost:5173 > /dev/null; then
        break
    fi
    sleep 1
done

# Run Cypress tests
npx cypress run

# Once the tests are done, kill the React app process
kill $REACT_PID

# Exit with the same status as the Cypress command
exit $?
