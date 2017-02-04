ENVFILE=./utils/testenv
TESTCONF=e2e.conf.js

all:    refresh-image run-with-envfile

refresh-image:
				docker pull hortonworks/docker-e2e-protractor

run-gui-tests:
				./scripts/uluwatu-test.sh

run-grid-tests:
				./scripts/grid-uluwatu-test.sh

run:
				docker run -it \
				--privileged \
				--rm \
				--name uluwatu-e2e-runner \
				--net=host \
				--env-file $(ENVFILE) \
				-v $(PWD):/protractor/project \
				hortonworks/docker-e2e-protractor $(TESTCONF) --troubleshoot --suite smoke

launch-grid:
				docker-compose -p ${grid_name} up -d
				sleep 20
				docker-compose -p ${grid_name} scale firefox=${firefox}
				sleep 20

down-grid:
				docker-compose -p ${grid_name} down

allure-report:
				allure generate allure-results/

allure-report-open:
				allure report open

.PHONY:
				run