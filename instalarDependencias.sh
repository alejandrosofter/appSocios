#!/bin/bash
echo "INSTALANDO METEOR"
curl https://install.meteor.com/ | sh
echo "ACTUALIZANDO"
sudo apt-get update
sudo apt-get --yes --force-yes install build-essential checkinstall
sudo apt-get --yes --force-yes install libreadline-gplv2-dev libncursesw5-dev libssl-dev libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev 
cd /usr/src
sudo wget https://www.python.org/ftp/python/2.7.14/Python-2.7.14.tgz
echo "INSTALANDO PYTHON"
sudo tar xzf Python-2.7.14.tgz
cd Python-2.7.14
sudo ./configure
sudo make altinstall
sudo apt-get install -y python-pip
sudo python -m pip install pymongo
clear
echo "INSTALACION FINALIZADA"