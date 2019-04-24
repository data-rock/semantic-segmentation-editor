FROM ubuntu:18.04
RUN apt update
RUN apt install -y curl s3fs
RUN mkdir /root/images && mkdir /root/internal
RUN curl https://install.meteor.com/ | sh

COPY . /code
WORKDIR /code
RUN cd /code && meteor npm install

# This will set up the app in the production mode
RUN cd /code && meteor --allow-superuser build --directory /root/build
RUN cd /root/build/bundle/programs/server && meteor npm install --production && meteor npm audit fix
CMD ["/code/utils/docker_cmd.sh"]
