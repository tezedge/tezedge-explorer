# base image
FROM node:12.2.0

# set working directory
WORKDIR /app

# install angular cli
RUN npm install -g @angular/cli@9.1.3
# install static server 
RUN npm install http-server -g

# clone & install deps for repo
ARG node_explorer_git="https://github.com/simplestaking/tezedge-explorer"
ARG node_explorer_commit_hash="5859d2a13fb2aeada11f653dadf6a3b1375925f5"
RUN git clone ${node_explorer_git} && \
    cd tezedge-explorer && \
    # git checkout ${node_explorer_commit_hash} && \
    npm install && \
    node path.js

# change dir to angular app
WORKDIR /app/tezedge-explorer
# buid app
RUN npm run build:docker

# run static server with app
CMD http-server ./dist/tezedge-explorer/