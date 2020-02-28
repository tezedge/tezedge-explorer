# base image
FROM node:12.2.0

# set working directory
WORKDIR /app

# install angular cli
RUN npm install -g @angular/cli@8.3.19
# install static server 
RUN npm install http-server -g

# clone & install deps for repo
ARG node_explorer_git="https://github.com/simplestaking/tezos-node-explorer"
ARG node_explorer_commit_hash="83acaf7b08bb827d62c9668464f72d14caf2f438"
RUN git clone ${node_explorer_git} && \
    cd tezos-node-explorer && \
    git checkout ${node_explorer_commit_hash} && \
    npm install

# change dir to angular app
WORKDIR /app/tezos-node-explorer
# buid app
RUN npm run build:prod

# run static server with app
CMD http-server ./dist/tezos-node-explorer/