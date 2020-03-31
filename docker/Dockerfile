# base image
FROM node:12.2.0

# set working directory
WORKDIR /app

# install angular cli
RUN npm install -g @angular/cli@8.3.19
# install static server 
RUN npm install http-server -g

# clone & install deps for repo
ARG node_explorer_git="https://github.com/simplestaking/tezedge-explorer"
ARG node_explorer_commit_hash="3ddf0d1e5c1a6d1e923fbe32091f07ee2ab25c3d"
RUN git clone ${node_explorer_git} && \
    cd tezedge-explorer && \
    git checkout ${node_explorer_commit_hash} && \
    npm install && \
    node path.js

# change dir to angular app
WORKDIR /app/tezedge-explorer
# buid app
RUN npm run build:prod

# run static server with app
CMD http-server ./dist/tezedge-explorer/