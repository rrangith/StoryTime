docker build -t rrangith/frontend:latest -t rrangith/frontend:$SHA -f ./frontend/Dockerfile ./frontend
docker build -t rrangith/backend:latest -t rrangith/backend:$SHA -f ./backend/Dockerfile ./backend

docker push rrangith/frontend:latest
docker push rrangith/backend:latest

docker push rrangith/frontend:$SHA
docker push rrangith/backend:$SHA

kubectl apply -f kubernetes
kubectl set image deployments/frontend-deployment frontend=rrangith/frontend:$SHA
kubectl set image deployments/backend-deployment backend=rrangith/backend:$SHA
