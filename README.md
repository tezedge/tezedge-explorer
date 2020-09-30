# TezEdge | Explorer

The TezEdge Explorer is an in-depth node explorer that shows all interactions between the Tezos protocol and storage. 

This tool is of particular use for developers and security researchers as it allows them to audit, trace and profile each individual action occurring within a block.

[Documentation](https://docs.tezedge.com/tezedge/explorer)

## Prerequisites

### 1. Install Node.js and NPM

If Node.js is not already on our machine, Install Node.js from the following site [https://nodejs.org/en](https://nodejs.org/en).

Note that you need node v13.0 or above.

NPM comes along with Node, so installing node will install Node and NPM at once.

You can check the version of Node and NPM by entering the following commads in terminal: `node -v` and `npm -v`.

### 2. Install Angular CLI

To install `angular-cli` enter the following command in terminal:

```
npm -i -g angular-cli
```

## Quick start

### 1. Clone the repo
```
git clone https://github.com/simplestaking/tezedge-explorer.git
cd tezedge-explorer
```

### 2. Install npm packages
Install the `npm` packages described in the `package.json` and verify that it works:

```
npm install
npm run start
```
By running `npm run start` you will start a devopment server. Navigate to `http://localhost:4200/`.

You can shut it down with `Ctrl-C`.


### 3. Configure the environment

Go to `src/environments/environment.ts` to configure the environment variables.

```
export const environment = {
  production: false,
  api: {
    ws: 'ws://127.0.0.1:4927/',
    http: 'http://127.0.0.1:18732',
  }
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
be reflected immediatelly.

## Mock server
Run `npm run server:json` for a json dev server.
Navigate to `http://localhost:3000/`.

Please view/edit `db.json` file according to your needs.
