sudo docker login --username=jurajselep
sudo docker build -t tezedge/tezedge-explorer:sandbox-v0.6.0 . --no-cache=true
sudo docker push tezedge/tezedge-explorer:sandbox-v0.6.0

sudo docker build -t tezedge/tezedge-explorer:sandbox-latest .
sudo docker push tezedge/tezedge-explorer:sandbox-latest

sudo docker build -t tezedge/tezedge-explorer:v0.6.0 . --no-cache=true
sudo docker push tezedge/tezedge-explorer:v0.6.0