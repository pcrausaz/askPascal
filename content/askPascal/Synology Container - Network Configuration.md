

```
Source: https://www.wundertech.net/container-manager-on-a-synology-nas/

SSH then
sudo -i
then

# Change 192.168.1.198 (Specific IP used here) and other network/gw/ip reference
# Change name ph_network

sudo docker network create -d macvlan -o parent=eth0 --subnet=192.168.1.0/24 --gateway=192.168.1.1 --ip-range=192.168.1.198/32 ph_network
```