#!/bin/bash
# create output & pid dir if not already present
mkdir -p test/coverage

# run istanbul cover, save its PID so we can kill it later, and pipe
# its output into file descriptor 3 so we can wait for the server to start
exec 3< <(./node_modules/.bin/istanbul cover server.js --dir ./test/coverage --handle-sigint & echo $! >test/coverage/pid)

# wait until we see "Server listening..." to indicate the server's started, then
# kill sed
# run cat to stop istanbul blocking fd 3 (see Stack Overflow #21001220)
sed '/Server listening on port 3000$/q' <&3 ; cat <&3 &

# run tests
grunt mochaTest

# kill istanbul (--handle-sigint) ensures it generates coverage reports here
kill -SIGINT $(<test/coverage/pid)
