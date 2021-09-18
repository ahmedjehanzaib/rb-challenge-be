# Remotebase Challenge Backend

## Usage

### Developers

#### Prerequites

Before installing, the following prerequisites need to met:

- [Docker](https://docs.docker.com/install/) needs to be installed on the host server.
- [`default bridge network` bridge network](https://docs.docker.com/engine/reference/commandline/network_create/) needs to be created using docker on the host server to link dashboard API.
- [git](https://gist.github.com/derhuerst/1b15ff4652a867391f03) needs to be installed on the host server.

#### Installation

1. clone solution
   To install the solution, first clone the repo to the host server

   ```
   git clone
   ```

2. build docker container (skip this part as its build automatically using dockerhub and watchtower)
   move to cloned folder.
   ```
   cd rb-challenge-be
   ```
   build docker container by passing the `npm token` as a build parameter.
   ```
   sudo docker build -t api:rb-challenge-be --build-arg NPM_SECRET=<npm token> .
   ```
3. run the container
   run the container using the `--net` flag, linking the container to the `bridge` network on server.
   ```
   sudo docker run --net 'bridge' -p 3005:3002 -d --name rb-challenge-be --restart always api:rb-challenge-be
   ```
4. test server
   open http://localhost:3005/api/v1/ping in your browser.

### Technical users

## Issues

Any issues found on usage of this solution (more especially failed tests found on test status of solution), post your issues onto the corresponding proxy API page:

- [Collection]()
