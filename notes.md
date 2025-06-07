docker compose up

db

 docker exec -it microservices-mongo-1 mongosh
 use microservices
 show collections
 db.users.find().pretty()

