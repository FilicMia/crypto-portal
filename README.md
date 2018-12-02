# Quick start

## Download the source code
~~~~ {.bash}
~/workspace $ git clone <URL-to-repo>
~/workspace $ cd <repo>

~/workspace/crypto-portal (master) $ npm install //set express app  
~~~~

## Cerate the local database

### Requirements
~~~~ {.bash}
$ sudo apt-get remove mongodb-org mongodb-org-server
$ sudo apt-get autoremove
$ sudo rm -rf /usr/bin/mongo*
$ sudo rm /etc/apt/sources.list.d/mongodb*.list
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
$ echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
$ sudo apt-get update
$ sudo apt-get install mongodb-org mongodb-org-server
$ sudo touch /etc/init.d/mongod
$ sudo apt-get install mongodb-org-server
~~~~

### Create local serving system
~~~~ {.bash}
~/workspace/crypto-portal (master) $ cd ~/workspace
~/workspace $ mkdir mongodb
~/workspace $ cd mongodb

~/workspace/mongodb $ mkdir data
~/workspace/mongodb $ echo 'mongod --bind_ip=$IP --dbpath=data --nojournal "$@"' > mongod
~/workspace/mongodb $ chmod a+x mongod
~~~~

### Host local database 
~~~~ {.bash}
~/workspace/mongodb $ ./mongod
~~~~

### Import the data into the database
Do this in new terminal. You need to leave the database to be served to access it.

~~~~ {.bash}
$ mongoimport --db Comments --collection Comments --mode upsert --upsertFields name --jsonArray --file ~/workspace/crypto-portal/app_server/models/comments-mongodb.json
~~~~

## Start the app
~~~~ {.bash}
~/workspace (master) $ cd ~/workspace/crypto-portal
~/workspace/crypto-portal (master) $ npm start
~~~~

# Host on Heroku (by your account)

~~~~ {.bash}
$ curl https://cli-assets.heroku.com/install.sh | sh
$ sudo ln -s /usr/local/bin/heroku /usr/bin/heroku
$ heroku login -i
$ cd ~/workspace/crypto-portal
~/workspace/crypto-portal (master) $ heroku create
~/workspace/crypto-portal (master) $ git push heroku master
~/workspace/crypto-portal (master) $ heroku config:set MLAB_URI=mongodb://{user}:{pass}@dsX{koda-mLab-baze}.mlab.com:{koda-mLab-baze}/{database-name}
~/workspace/crypto-portal (master) $ heroku config:set NODE_ENV=production
~~~~