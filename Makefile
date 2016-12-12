TESTCONF=e2e.conf.js

all:    refresh-image run-with-envfile

refresh-image:
				docker pull hortonworks/docker-e2e-protractor

run-with-envfile:
				docker run -it \
				--privileged \
				--rm \
				--name uluwatu-e2e-runner \
				--net=host \
				--env-file utils/testenv \
				-v $(PWD):/protractor/project \
				hortonworks/docker-e2e-protractor $(TESTCONF)

run:
				docker run -it \
				--privileged \
				--rm \
				--name uluwatu-e2e-runner \
				--net=host \
				-e BASE_URL=$(BASE_URL) \
				-e USERNAME=$(USERNAME) \
				-e PASSWORD=$(PASSWORD) \
				-e AWS_ROLE_ARN=$(AWS_ROLE_ARN) \
				-e SSHKEY=$(SSHKEY) \
				-v $(PWD):/protractor/project \
				hortonworks/docker-e2e-protractor $(TESTCONF)

run-regression:
				docker run -it \
				--privileged \
				--rm \
				--name uluwatu-e2e-runner \
				--net=host \
				-e BASE_URL=$(BASE_URL) \
				-e USERNAME=$(USERNAME) \
				-e PASSWORD=$(PASSWORD) \
				-e AWS_ROLE_ARN=$(AWS_ROLE_ARN) \
				-e SSHKEY=$(SSHKEY) \
				-v $(PWD):/protractor/project \
				hortonworks/docker-e2e-protractor $(TESTCONF) --troubleshoot --suite regression

run-smoke:
				docker run -it \
				--privileged \
				--rm \
				--name uluwatu-e2e-runner \
				--net=host \
				-e BASE_URL=$(BASE_URL) \
				-e USERNAME=$(USERNAME) \
				-e PASSWORD=$(PASSWORD) \
				-e AWS_ROLE_ARN=$(AWS_ROLE_ARN) \
				-e SSHKEY=$(SSHKEY) \
				-v $(PWD):/protractor/project \
				hortonworks/docker-e2e-protractor $(TESTCONF) --troubleshoot --suite smoke

run-preprod:
				docker run -i \
				--privileged \
				--rm \
				--name uluwatu-e2e-runner \
				--net=host \
				-e BASE_URL=$(BASE_URL) \
				-e USERNAME=$(USERNAME) \
				-e PASSWORD=$(PASSWORD) \
				-e AWS_ROLE_ARN=$(AWS_ROLE_ARN) \
				-e SSHKEY=$(SSHKEY) \
				-v $(PWD):/protractor/project \
				-v /dev/shm:/dev/shm \
				hortonworks/docker-e2e-protractor $(TESTCONF)

run-qa:
				docker run -i \
				--privileged \
				--rm \
				--name uluwatu-e2e-runner \
				--net=host \
				-e BASE_URL=$(BASE_URL) \
				-e USERNAME=$(USERNAME) \
				-e PASSWORD=$(PASSWORD) \
				-e AWS_ROLE_ARN=$(AWS_ROLE_ARN) \
				-e SSHKEY=$(SSHKEY) \
				-v $(PWD):/protractor/project \
				-v /dev/shm:/dev/shm \
				hortonworks/docker-e2e-protractor $(TESTCONF)

allure-report:
				allure generate allure-results/

allure-report-open:
				allure report open

cloudbreak-run-ui-it-test:
				./scripts/cloudbreak-ui-integration-test.sh

.PHONY:
				run