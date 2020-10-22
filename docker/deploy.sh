sudo docker login --username=jurajselep
sudo docker build -t simplestakingcom/tezedge-explorer:sandbox-v0.6.0 . --no-cache=true
sudo docker push simplestakingcom/tezedge-explorer:sandbox-v0.6.0

sudo docker build -t simplestakingcom/tezedge-explorer:sandbox-latest .
sudo docker push simplestakingcom/tezedge-explorer:sandbox-latest

sudo docker build -t simplestakingcom/tezedge-explorer:v0.6.0 . --no-cache=true
sudo docker push simplestakingcom/tezedge-explorer:v0.6.0