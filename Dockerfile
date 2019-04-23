FROM ubuntu:18.04
RUN apt update
RUN apt install -y curl s3fs
RUN mkdir /root/images && mkdir /root/internal
RUN curl https://install.meteor.com/ | sh

COPY . /code
WORKDIR /code
RUN cd /code && meteor npm install
CMD ["/code/utils/docker_cmd.sh"]
