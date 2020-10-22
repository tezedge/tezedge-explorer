# base image
FROM node:12.2.0 AS BUILD_IMAGE

# set working directory
WORKDIR /app

# install angular cli
RUN npm install -g @angular/cli@10.1.0

# clone & install deps for repo
ARG node_explorer_git="https://github.com/simplestaking/tezedge-explorer"
ARG node_explorer_commit_hash="9164a7d7230424c6fdd40b0fc7fcbcbbc318eb1e"
RUN git clone ${node_explorer_git} && \
    cd tezedge-explorer && \
    # git checkout ${node_explorer_commit_hash} && \
    npm install && \
    node path.js

# change dir to angular app
WORKDIR /app/tezedge-explorer
# buid app
RUN npm run build:docker
# remove development dependencies
RUN npm prune --production

# smaller base image for production
FROM node:10-alpine

WORKDIR /app

# copy from build image
COPY --from=BUILD_IMAGE /app/tezedge-explorer/dist ./dist
# COPY --from=BUILD_IMAGE /app/tezedge-explorer/node_modules ./node_modules

# install static server 
RUN npm install http-server -g

# run static server with app
CMD http-server ./dist/tezedge-explorer/
