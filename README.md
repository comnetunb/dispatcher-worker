# Dispatcher's Worker

Save application on a distributed system managed by the Dispatcher [Master](https://github.com/comnetunb/dispatcher-master)). This is a service where its main purpose is to process tasks sent by master.

See also: 

- [Master](https://github.com/comnetunb/dispatcher-master)
- [Protocol](https://github.com/comnetunb/dispatcher-protocol)

## Getting started

### Pre requisites

Everything you need is to install Docker CE (Community Edition):

- [CentOS](https://docs.docker.com/install/linux/docker-ce/centos/)
- [Debian](https://docs.docker.com/install/linux/docker-ce/debian/)
- [Fedora](https://docs.docker.com/install/linux/docker-ce/fedora/)
- [Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- [Others](https://docs.docker.com/install/linux/docker-ce/binaries)

### Running

After installing Docker, just run our latest published docker image:

```bash
$ sudo docker run [-v <configuration-file-path>:/opt/app/config/json] -d comnetunb/dispatcher-worker
```

The first option, `-v <configuration-file-path>:/opt/app/config/json`, is optional and maps a local config file to be used by the worker. If you wish to use a configuration file, change `<configuration-file-path>` for the absolute path of the configuration file you would like to use. For more details regarding the configuration file, see [Configuration file](#configuration-file).


## Configuration file
You can tweak the worker configuration on a json file that can have the following format:

```json
{
  "alias": "ARCTURUS01",
  "dispatcherAddress": "199.198.197.196",
  "languages": {
    "allow_others": true,
    "list": ["java", "python", "c++"]
  }
}
```

### Properties
- alias: defines an alias for the worker machine
- dispatcherAddress: sets the IP of a reachable master. If this property is set, the application will try to connect to it directly. If this property is not set, the connection mechanism will be the automatic discovery, that only works on a master configured on a local network shared by the worker aplication.
- languages: lists the languages currently supported by the machine
