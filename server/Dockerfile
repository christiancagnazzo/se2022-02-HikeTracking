FROM ubuntu:latest
RUN apt-get update
RUN apt-get install -y python3 python3-pip
ENV NODE_ENV=production

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip3 install --upgrade pip
COPY ./requirements.txt /app
RUN pip install -r requirements.txt
CMD ["python3", "manage.py", "migrate"]

COPY . /app

EXPOSE 8000
