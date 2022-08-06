# syntax=docker/dockerfile:1
FROM python:3.9-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .
EXPOSE 5000
CMD [ "uvicorn", "app:app", "--port", "5000", "--host 0.0.0.0" ]