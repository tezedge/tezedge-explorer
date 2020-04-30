docker login --username=jurajselep
sudo docker build -t simplestakingcom/tezedge-node-explorer . --no-cache=true
sudo docker push simplestakingcom/tezedge-node-explorer

# docker login --username=jurajselep
# sudo docker build -t simplestakingcom/tezedge-explorer-ocaml . --no-cache=true
# sudo docker push simplestakingcom/tezedge-explorer-ocaml