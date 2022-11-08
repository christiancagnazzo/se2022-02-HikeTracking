# pull the official base image
#FROM python:3.8.3-alpine
FROM ubuntu:latest
RUN apt-get update
RUN apt-get install -y python3 python3-pip

# set work directory
WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip3 install --upgrade pip 
COPY ./requirements.txt /app
RUN pip install -r requirements.txt
CMD ["python3", "manage.py", "migrate"]
# copy project
COPY . /app

EXPOSE 8000

#CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]