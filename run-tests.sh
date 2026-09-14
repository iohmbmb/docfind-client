docker build --network=host -f Dockerfile.angular -t angular-tests . && docker run --rm angular-tests

