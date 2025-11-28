#!/bin/bash
set -e

echo "Starting Minikube..."
minikube start

echo "Creating configmaps..."
kubectl create configmap mongo-init-scripts --from-file=setup/mongo-init-scripts/init.js
kubectl create configmap nginx-config --from-file=nginx.conf

echo "Starting Skaffold..."
skaffold run

echo "Opening proxy service in browser..."
minikube service proxy
