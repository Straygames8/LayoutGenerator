# Install MongoDB (Ubuntu)
sudo apt-get update
sudo apt-get install -y mongodb

# Start MongoDB service
sudo service mongodb start

# Create database
mongo
> use cad_layout_generator
> db.createCollection("layouts")
> exit

# Verify database creation
mongo
> show dbs
> use cad_layout_generator
> show collections
> exit
