FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

COPY run.sh run.sh
COPY .bundle .bundle

CMD ["/bin/bash", "-c", "/usr/src/app/run.sh"]

EXPOSE 3000

# Build
# docker build -t pocket-stats .

# Run
# docker run -t --rm -v $PWD:/usr/src/app -p 3002:3000 pocket-stats