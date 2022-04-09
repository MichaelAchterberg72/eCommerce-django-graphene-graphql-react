FROM python:3.7

ENV PYTHONDONTWRITBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN mkdir /epi

WORKDIR /api

COPY . /api/

RUN pip3 install -r requirements.txt