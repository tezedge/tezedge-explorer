docker login --username=jurajselep
sudo docker build -t simplestakingcom/tezedge-node-explorer . --no-cache=true
sudo docker push simplestakingcom/tezedge-node-explorer