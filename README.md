# Dispatcher's Worker

Save application on a distributed system managed by the Dispatcher [Master](https://github.com/comnetunb/dispatcher-master)). This is a service where its main purpose is to process tasks sent by master.

See also: 

- [Master](https://github.com/comnetunb/dispatcher-master)
- [Protocol](https://github.com/comnetunb/dispatcher-protocol)

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

## Actual use

### Pre requisites

You need to have Docker installed

- [CentOS](https://docs.docker.com/install/linux/docker-ce/centos/)
- [Debian](https://docs.docker.com/install/linux/docker-ce/debian/)
- [Fedora](https://docs.docker.com/install/linux/docker-ce/fedora/)
- [Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- [Others](https://docs.docker.com/install/linux/docker-ce/binaries)

### Running

After installing Docker, just run our latest published docker image:

```bash
$ sudo docker run [--network="host"] -v <configuration-file-path>:/opt/app/config/config.json -d comnetunb/dispatcher-worker
```

The brackets around `--network="host"` mean that this argument is optional. The `--network="host"` argument tells the docker container to use the host's network as its own. You should use it if the dispatcher is not accessible via the internet, i.e., it is inside your local network, therefore it is easier to simply use the host's network as opposed to configure an access to the network, from the container.

The `<configuration-file-path>` must be the full path of your configuration file, downloadable via the Dispatcher Web Interface. The `-v` flag maps the local config file to be used by the worker inside the container.

This file must be present for the Worker to know the address of the dispatcher and credentials that will be used for authentication.
