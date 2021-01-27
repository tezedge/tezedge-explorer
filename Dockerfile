# base image
FROM node:latest AS BUILD_IMAGE

# set working directory
WORKDIR /app

# install angular cli
RUN npm install -g @angular/cli@10.1.0

# clone & install deps for repo
ARG source=develop
ARG node_explorer_git="https://github.com/simplestaking/tezedge-explorer"
#ARG node_explorer_commit_hash="${source}"
RUN git clone ${node_explorer_git} && \
    cd tezedge-explorer && \
    git checkout ${source} && \
    npm install && \
    node path.js

# change dir to angular app
WORKDIR /app/tezedge-explorer

# test
#RUN npm install

# buid app
RUN ng build --prod --output-path=/dist

#RUN npm install http-server -g
#CMD http-server ./dist/tezedge-explorer/
#RUN npm run test:run

# remove development dependencies
RUN npm prune --production

################
# Run in NGINX #
################
FROM nginx:alpine
COPY --from=BUILD_IMAGE /dist /usr/share/nginx/html

# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]

# Example of how to run
# docker run --env SANDBOX='https://carthage.tezedge.com:3030' --env API='[{"id":"master","name":"master.dev.tezedge","http":"http://master.dev.tezedge.com:18733","debugger":"http://master.dev.tezedge.com:17733","ws":false}]'  -p 8080:80  tezedge-explorer:latest
