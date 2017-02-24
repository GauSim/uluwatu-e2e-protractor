#!/bin/bash -x
# -e  Exit immediately if a command exits with a non-zero status.
# -x  Print commands and their arguments as they are executed.

: ${BASE_URL:? required}
: ${HOST:? required}
: ${MASTER_SSH_KEY:? required}
: ${CLOUDBREAK_CENTOS_SSH_USER:? required}
: ${ENVIRONMENT:? required}
: ${TEST_SUITE:? required}
: ${ENVFILE:=./utils/testenv}
: ${PARALLELBROWSERS:=2}

export NOWDATE=$(ssh -o StrictHostKeyChecking=no -i $MASTER_SSH_KEY $CLOUDBREAK_CENTOS_SSH_USER@$HOST date +%Y-%m-%d"T"%H:%M:%S)

export TESTCONF=/protractor/project/e2e.conf.js
export ARTIFACT_POSTFIX=info

echo "CBD version: "$TARGET_CBD_VERSION

export TEST_CONTAINER_NAME=uluwatu-e2e-$ENVIRONMENT
export TEST_GRID_NAME=uluwatu-grid-$ENVIRONMENT

grid_cleanup() {
    echo "Checking " $TEST_GRID_NAME " grid is running"
    if [[ $(docker ps -ql --filter "name=uluwatugrid*") ]]; then
        if [[ "$(docker inspect -f {{.State.Running}} $(docker ps -q --filter "name=uluwatugrid*") | sort | uniq 2> /dev/null)" == "true" ]]; then
              echo "Stopping then removing the " $TEST_GRID_NAME " grid"
              docker-compose -p $TEST_GRID_NAME down
        fi
    else
        echo $TEST_GRID_NAME " grid is NOT running"
    fi
}

echo "Refresh the Test Runner Docker image"
docker pull hortonworks/docker-e2e-protractor

echo "Checking stopped containers"
if [[ -n "$(docker ps -a -f status=exited -f status=dead -q)" ]]; then
  echo "Delete stopped containers"
  docker rm $(docker ps -a -f status=exited -f status=dead -q)
else
  echo "There is no Exited or Dead container"
fi

echo "Checking " $TEST_CONTAINER_NAME " container is running"
if [[ "$(docker inspect -f {{.State.Running}} $TEST_CONTAINER_NAME 2> /dev/null)" == "true" ]]; then
  echo "Delete the running " $TEST_CONTAINER_NAME " container"
  docker rm -f $TEST_CONTAINER_NAME
fi

grid_cleanup

BASE_URL_RESPONSE=$(curl -k --write-out %{http_code} --silent --output /dev/null $BASE_URL/sl)
echo $BASE_URL " HTTP status code is: " $BASE_URL_RESPONSE
if [[ $BASE_URL_RESPONSE -ne 200 ]]; then
    echo $BASE_URL " Web GUI is not accessible!"
    exit 1
else
    echo $TEST_GRID_NAME " grid is starting"
    docker-compose -p $TEST_GRID_NAME up -d
    echo $TEST_GRID_NAME " grid Firefox node is scaling"
    sleep 20
    docker-compose -p $TEST_GRID_NAME scale firefox=$PARALLELBROWSERS
    sleep 20

    if [[ $(docker-compose -p $TEST_GRID_NAME ps -q | xargs docker inspect -f {{.State.ExitCode}} $(docker ps -q --filter "name=uluwatugrid*") | sort | uniq 2> /dev/null) -ne 0 ]] ; then
        echo $TEST_GRID_NAME " grid compose has failed"
        exit 1
    else
        docker run -i \
        --privileged \
        --rm \
        --name $TEST_CONTAINER_NAME \
        --env-file $ENVFILE \
        -v $(pwd):/protractor/project \
        -v /dev/shm:/dev/shm \
        hortonworks/docker-e2e-protractor e2e.conf.js --troubleshoot --suite $TEST_SUITE
        RESULT=$?
    fi
fi

echo "Get the runtime Cloudbreak logs!"
mkdir -pv cloudbreak-logs
sudo chown -R jenkins .

ssh -o StrictHostKeyChecking=no -i $MASTER_SSH_KEY $CLOUDBREAK_CENTOS_SSH_USER@$HOST docker logs --since=$NOWDATE cbreak_cloudbreak_1 > test_log/cloudbreak-$TARGET_CBD_VERSION.log

grid_cleanup

exit $RESULT
