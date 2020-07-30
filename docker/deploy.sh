docker login --username=jurajselep
sudo docker build -t simplestakingcom/tezedge-explorer . --no-cache=true
sudo docker push simplestakingcom/tezedge-explorer

# docker login --username=jurajselep
# sudo docker build -t simplestakingcom/tezedge-explorer-ocaml . --no-cache=true
# sudo docker push simplestakingcom/tezedge-explorer-ocaml