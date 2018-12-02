# Today I Learned

a small example of NodeJS using MongoDB and ReactJS

## Installation

## Web App

Hosted at: https://secure-wildwood-12307.herokuapp.com/

Database: "mongodb://til:til123@ds121834.mlab.com:21834/til"

Installation:

    npm install

Launch server and client with concurrently:

    npm run dev

Cypress Testing:

    npm test

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

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

### To install TIL CLI:

Create til command:

    npm link

(on MacOS with Homebrew, you may also need to do

    brew unlink node && brew link node

)

## CLI Usage

From the command line, run

    til help

To add a lesson:

    til add 'eels are fish, not snakes'

To list all lessons:

    til list
