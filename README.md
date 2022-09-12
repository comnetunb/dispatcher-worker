# Dispatcher's Worker

Save application on a distributed system managed by the Dispatcher [Master](https://github.com/comnetunb/dispatcher-master)). This is a service where its main purpose is to process tasks sent by master.

See also:

- [Master](https://github.com/comnetunb/dispatcher-master)
- [Protocol](https://github.com/comnetunb/dispatcher-protocol)

## Installation

Pre-requisites:

- Install [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/).
- Create a new worker in the Dispatcher Web Interface and downloat the configuration file.

Replace the environment variable values and run the following snippet:

```sh
export DISPATCHER_WORKER_CONFIG_FILE=<path to configuration file>
export DOCKER_COMPOSE_PATH=<path to docker-compose file>

curl -L -O $DOCKER_COMPOSE_PATH https://raw.githubusercontent.com/comnetunb/dispatcher-worker/master/docker-compose.yml

sudo docker-compose -f $DOCKER_COMPOSE_PATH up
```

## Development

### Pre requisites

- [Node](https://nodejs.org/en/download/)

### Running

After installing Node, download and run the Worker with:

```bash
$ git clone https://github.com/comnetunb/dispatcher-worker
$ cd dispatcher-worker
$ npm install
$ npm run dev
```

If you'd like to change the [Configuration file](#configuration-file), open it at `dispatcher-worker/config/config.sample.json`.

### Deploying

For now, here is the checklist:

- Commit everything
- Bump package json version and commit again
- Build the docker image
- Push both repo and docker image
