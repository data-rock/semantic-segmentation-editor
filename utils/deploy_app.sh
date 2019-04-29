#!/usr/bin/env bash

set -e

SERVICE=hitachi
[[ -z "$SERVICE" ]] && echo "SERVICE must be set" && exit 1
[[ -z "$TAG_NAME" ]] && echo "TAG_NAME must be set" && exit 1
[[ -z "$ENVIRONMENT" ]] && echo "ENVIRONMENT must be set" && exit 1

AWS_REGION=${AWS_REGION:-ap-southeast-2}
IMAGE_NAME="datarock-${SERVICE}"
ECS_STACK="datarock-ecs-${ENVIRONMENT}"

ECS_STACK_DETAILS=$(aws cloudformation describe-stacks --stack-name ${ECS_STACK} --region "${AWS_REGION}")
ECS_CLUSTER=$(echo "${ECS_STACK_DETAILS}" | jq --raw-output '.Stacks[0].Outputs[] | select(.OutputKey=="ClusterName") | .OutputValue')
ECR_HOST=$(echo "${ECS_STACK_DETAILS}" | jq --raw-output '.Stacks[0].Outputs[] | select(.OutputKey=="EcrHost") | .OutputValue')
[[ -z "$ECS_CLUSTER" ]] && echo "Could not find ECR ECS_CLUSTER" && exit 1
[[ -z "$ECR_HOST" ]] && echo "Could not find ECR_HOST" && exit 1

IMAGE_TAG=${IMAGE_NAME}:${TAG_NAME}
LATEST_TAG=${IMAGE_NAME}:latest

function build_image {
  docker build --tag ${IMAGE_TAG} .
}

function tag_image {
  docker tag "${IMAGE_TAG}" "${ECR_HOST}/${IMAGE_TAG}"
  docker tag "${IMAGE_TAG}" "${ECR_HOST}/${LATEST_TAG}"
}

function push_to_ecr {
  $(aws ecr get-login --no-include-email --region ${AWS_REGION})
  docker push "${ECR_HOST}/${IMAGE_TAG}"
  docker push "${ECR_HOST}/${LATEST_TAG}"
}

build_image && tag_image && push_to_ecr

aws ecs update-service --cluster $ECS_CLUSTER --service $SERVICE --force-new-deployment