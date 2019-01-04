# SOLUTION 
More detailed instructions how to get commit `4a197a0` to the commit `c8ccb95` can be found under 
[`docs/solution.md`](https://bitbucket.org/mfilic/v6-resitev/src/master/docs/instructions.md).
It explaines what we did on excercises.

The minimal solution to `v6` is up to the [commit](https://bitbucket.org/mfilic/v5-resitev/commits/c8ccb95):
> v6 resitev

The source code up to that commit downloaded with the following. 

~~~~.bash
git clone https://bitbucket.org/mfilic/v6-resitev/commits/c8ccb95
~~~~

or, if you have already downloader `v6-resitev`, with the following.

~~~~.bash
cd v6-resitev
git reset --hard c8ccb95
~~~~

# Quick start

## Download the source code
~~~~ {.bash}
~/workspace $ git clone <URL-to-repo>
~/workspace $ cd <repo>

~/workspace/v6 (master) $ npm install //set express app  
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
~/workspace/v6 (master) $ cd ~/workspace
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
$ mongoimport --db Comments --collection Comments --mode upsert --upsertFields name --jsonArray --file ~/workspace/v6/app_server/models/comments-mongodb.json
~~~~

## Start the app
~~~~ {.bash}
~/workspace (master) $ npm install -g nodemon
~/workspace (master) $ cd ~/workspace/v6
~/workspace/v6 (master) $ nodemon start
~~~~