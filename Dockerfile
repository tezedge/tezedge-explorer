# base image
#FROM node:12.2.0 AS BUILD_IMAGE
FROM node:latest AS BUILD_IMAGE

# set working directory
WORKDIR /app

# install angular cli
RUN npm install -g @angular/cli@10.1.0

# clone & install deps for repo
ARG node_explorer_git="https://github.com/simplestaking/tezedge-explorer"
ARG node_explorer_commit_hash="8794cbae44eb0aa25bfba52a77789260b2570d4f"
RUN git clone ${node_explorer_git} && \
    cd tezedge-explorer && \
    git checkout ${node_explorer_commit_hash} && \
    npm install && \
    node path.js

# change dir to angular app
WORKDIR /app/tezedge-explorer

# buid app
RUN ng build --prod --output-path=/dist
# remove development dependencies
RUN npm prune --production



################
# Run in NGINX #
################
FROM nginx:alpine
COPY --from=BUILD_IMAGE /dist /usr/share/nginx/html

# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
