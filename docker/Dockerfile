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
ARG node_explorer_commit_hash="efd23d601046d248b9113469e44ea22ec43bffde"
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