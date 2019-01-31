# Dispatcher's Worker

Save application on a distributed system managed by the Dispatcher [Master](https://github.com/comnetunb/dispatcher-master)). This is a service where its main purpose is to process tasks sent by master.

See also: 

- [Master](https://github.com/comnetunb/dispatcher-master)
- [Protocol](https://github.com/comnetunb/dispatcher-protocol)

## Getting started

### Pre requisites

- [Node](https://nodejs.org/en/download/)

### Running

After installing Node, download and run the Worker with:

```bash
$ git clone https://github.com/comnetunb/dispatcher-worker
$ cd dispatcher-worker
$ node index.js
```

If you'd like to change the [Configuration file](#configuration-file), open it at `dispatcher-worker/config/config.json`.

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
