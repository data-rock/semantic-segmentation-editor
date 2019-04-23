FROM ubuntu:18.04
RUN apt update
RUN apt install -y curl s3fs
ENV AWS_ACCESS_KEY=
ENV AWS_SECRET_KEY=
RUN echo ${AWS_ACCESS_KEY}:${AWS_SECRET_KEY} > /root/.passwd-s3fs && chmod 600 /root/.passwd-s3fs
RUN mkdir /root/images && mkdir /root/internal
RUN curl https://install.meteor.com/ | sh

COPY . /code
WORKDIR /code
RUN cd /code && meteor npm install
COPY utils/docker_cmd.sh /root/docker_cmd.sh
ENV S3_BUCKET=tin-annotation
RUN sed -it 's/S3_BUCKET/${S3_BUCKET}/g' /root/docker_cmd.sh
CMD ["/root/docker_cmd.sh"]
