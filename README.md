# Today I Learned

a small example of NodeJS using MongoDB

## Installation

## Web App

Hosted at: https://secure-wildwood-12307.herokuapp.com/

To start the Express Server:

    npm run server

To start the React Client

    npm run client

Concurrently can also be used to run both at the same time

    npm install -g concurrently

    npm run dev

### To install MongoDB:

- on MacOS with Homebrew, run:

      brew update
      brew install mongodb
      brew services start mongodb

  - to fix the error "`Permission denied @ dir_s_mkdir - /usr/local/Frameworks`", run:

        sudo mkdir /usr/local/Frameworks
        sudo chown $(whoami):admin /usr/local/Frameworks

  - to watch the log, run

        tail -f /usr/local/var/log/mongodb/mongo.log

    see https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#install-with-homebrew

- all other systems:
  - see https://docs.mongodb.com/guides/server/install/

### To install TIL:

Clone this repo, then run

    cd til
    npm install
    npm link

(on MacOS with Homebrew, you may also need to do

    brew unlink node && brew link node

)

## Usage

From the command line, run

    til help

To add a lesson:

    til add 'eels are fish, not snakes'

To list all lessons:

    til list
