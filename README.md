# TezEdge | Explorer

The TezEdge Explorer is an in-depth node explorer that shows all interactions between the Tezos protocol and storage. 

This tool is of particular use for developers and security researchers as it allows them to audit, trace and profile each individual action occurring within a block.

[Documentation](https://docs.tezedge.com/tezedge/explorer)

## Prerequisites

### 1. Install Node.js and NPM

If Node.js is not already on our machine, Install Node.js from the following site [https://nodejs.org/en](https://nodejs.org/en).

Note that you need node v16.

NPM comes along with Node, so installing node will install Node and NPM at once.

If the installation was successful you can see the versions of Node and NPM by entering the following commands in terminal: `node -v` and `npm -v`.

### 2. Install Angular CLI

To install `angular-cli` enter the following command in terminal:

```
npm install -g @angular/cli@12.2.2
```

## Quick start

### 1. Clone the repo
```
git clone https://github.com/tezedge/tezedge-explorer.git
cd tezedge-explorer
```

### 2. Install npm packages
Install the `npm` packages described in the `package.json` and verify that it works:

```
npm install --legacy-peer-deps
npm run start
```
By running `npm run start` you will start a development server. Navigate to `http://localhost:4200/`.

You can shut it down with `Ctrl-C`.

### 3. Configure the environment

Go to `src/environments/environment.ts` to configure the environment variables.

```
export const environment = {
 production: false,
 api: [
    {
      id: 'rust.develop.dev.tezedge.com',
      name: 'rust.develop.dev.tezedge.com',
      http: 'http://develop.dev.tezedge.com:18732',
      p2p_port: '9732',
      type: 'tezedge',
      features: [
        { name: 'ws', url: 'ws://develop.dev.tezedge.com:4927' },
        { name: 'debugger', url: 'http://develop.dev.tezedge.com:17732' },
        { name: 'sandbox', url: 'http://localhost:3030' },
        { name: 'commit', id: '' },
        { name: 'monitoring' },
        { name: 'resources/system', monitoringUrl: 'http://develop.dev.tezedge.com:38732/resources/tezedge' },
        { name: 'resources/memory', memoryProfilerUrl: 'http://develop.dev.tezedge.com:17832' },
        { name: 'resources/storage' },
        { name: 'mempool' },
        { name: 'storage' },
        { name: 'storage-action' },
        { name: 'network' },
        { name: 'logs' },
      ]
    },
    {
      id: 'octez',
      name: 'octez.develop.dev.tezedge.com',
      http: 'http://develop.dev.tezedge.com:18733',
      p2p_port: '9733',
      type: 'octez',
      features: [
        { name: 'debugger', url: 'http://develop.dev.tezedge.com:17732' },
        { name: 'sandbox', url: 'http://localhost:3030' },
        { name: 'monitoring' },
        { name: 'resources/system', monitoringUrl: 'http://develop.dev.tezedge.com:38732/resources/ocaml' },
        { name: 'resources/memory', memoryProfilerUrl: 'http://develop.dev.tezedge.com:17832' },
        { name: 'resources/storage' },
        { name: 'mempool' },
        { name: 'network' },
        { name: 'logs' },
      ]
    }
  ]
};
```

### 4. Run application

Run `npm run start` to start the development server. 

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Development with docker-compose

If you don't have nodejs environment setup, you can use docker-compose to run the current version
of the app:

```
docker-compose -f docker/docker-compose-dev.yml up
```

The app will be available under `http://localhost:4200/`and any changes to source files will
be reflected immediately.

## Mock server

Run `npm run start:mock` for starting the json servers and the application. 

If having problem with this one (depending on your terminal, it may stop after starting the first server), you can run each command in a different terminal:

a. Run `npm run mock:http` to start the http server on port `3001`;

b. Run `npm run mock:debugger` to start the debugger server on port `3002`;

c. Go to `src/environments/environment.ts` and create a local node using the http and debugger servers from above:
```
export const environment = {
  production: false,
  api: [
    {
      id: 'localhost',
      name: 'localhost',
      http: 'http://127.0.0.1:3001',
      debugger: 'http://127.0.0.1:3002',
      ws: false
    }
  ]
};
```

Please open `mock` folder to view/edit each server files.


## Running Tests

TezEdge Explorer uses Cypress to run the integration tests.

To run the tests make sure the application is running and in a separate terminal execute

`npx cypress run`

Additionally, if you want to see the real time progress of the tests use the following command instead:

`npx cypress run --headed`


## Running Baking rewards transaction test

To run the test make sure the application is running and in a separate terminal.
To run the baking rewards transaction test run the following:
`npx cypress run --spec "cypress/integration/rewards/ledger-transaction.spec.js" --headed`


## Using Icons Inside TezEdge Explorer

TezEdge Explorer uses `mat-icon` to render the icons and its icon-set functionalities. Also, using the `svg-sprite` library, all icons used by the application are stored inside _one single sprite svg_.

To add a new icon in the app you have to follow these simple steps:

### 1. Add your icon
- put your new **svg** icon inside `assets/icons`

### 2. Trigger svg sprite generation
- go to the **root** of the project, open a terminal window and run: `npm run generate-icons`

### 3. Find your new generated svg sprite
- go to `assets/sprite/css/svg/sprite.css-#hashcode#.svg` and copy the entire content of the generated svg file

### 4. Use the new generated svg sprite
- go to `assets/sprite/icon-set.svg` and replace the entire content with the one copied previously

### 5. Remove unused files
- delete directory `assets/sprite/css`. That's all!
