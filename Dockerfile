########################################################################
# Dockerfile for rb challenge be
########################################################################

# pull base image
FROM node:12-alpine

# maintainer details
LABEL author="ahmedjehanzaib1992@gmail.com"
LABEL company="http://simplusinnovation.com/"
LABEL issues=""
LABEL majorVersion="1"
LABEL name="rb challenge be"

# npm token argument so that is it not stored in the file
ENV NPM_TOKEN ${NPM_TOKEN}
#a02cd4ae-944f-457a-949d-225ba444408b

# setup application directory
RUN mkdir /app
WORKDIR /app
RUN  apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && npm install --quiet node-gyp -g
# build .npmrc file for npm installation of private packages
RUN printf "//`node -p \"require('url').parse(process.env.NPM_REGISTRY_URL || 'https://registry.npmjs.org').host\"`/:_authToken=${NPM_TOKEN}\nregistry=${NPM_REGISTRY_URL:-https://registry.npmjs.org}\n" >> ~/.npmrc

# copy application build files.
ADD ./package.json /app

# install pacakges and global packages
RUN npm install
RUN npm prune

# copy application run files and test for standard
ADD ./src /app/src
ADD ./tsconfig.json /app

# copy application test documentation files and build documentation
ADD ./docs /app/docs
ADD ./README.md /app
ADD ./test /app/test
# RUN npm run document

# test solution for build failures
RUN npm run test

# build solution
RUN npm run build

# setup environment variables
ENV NODE_ENV 'production'
ENV PORT 80
ENV POSTGRES_USER ${POSTGRES_USER}
ENV POSTGRES_DATABASE ${POSTGRES_DATABASE}
ENV POSTGRES_PASSWORD ${POSTGRES_PASSWORD}
ENV POSTGRES_PORT ${POSTGRES_PORT}
ENV POSTGRES_HOST ${POSTGRES_HOST}

# expose microservice on selected port. Defaults to 3010
EXPOSE 80

# run microservice
ENTRYPOINT [ "node" , "./build/bin/server.js"]
CMD ["/bin/bash"]