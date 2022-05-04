FROM node:12.18.0

ENV DOCKERIZE_VERSION v0.2.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

RUN npm install -g nodemon
RUN mkdir -p /usr/src/app
# 작업 디렉토리 전환
WORKDIR /usr/src/app

# local 컴터에있는  package.json 파일을 현재 워킹 디렉토리에 복사 
COPY package*.json ./

# local machine 에서 npm install 실행 
RUN npm install

COPY . .

EXPOSE 8080

RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ./docker-entrypoint.sh