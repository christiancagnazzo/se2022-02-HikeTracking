# se2022-02-HikeTracking

Software engineering II course project - PoliTo - Team 2

## Getting Started

### Prerequisites for installation
docker
docker_compose

### Installation

1. Create a file named "docker-compose.yml"

```
services:
    server:
        build: ./server
        ports:
            - "8000:8000"
        command: bash -c "python3 manage.py runserver 0.0.0.0:8000"
        image: christiancagnazzo/hiketracking_sw2022_2:server

   client:
       build: ./client
       image: christiancagnazzo/hiketracking_sw2022_2:client
       ports:
           - "3000:3000"
       command: npm start
```


2. In the same folder, run in the command line ```docker compose pull``` 
3. Run ```docker compose up```
3. Connect to "localhost:3000"

### Alternative installation

1. Clone the repository 
2. Run ```docker compose build```
3. Run ```docker compose up```