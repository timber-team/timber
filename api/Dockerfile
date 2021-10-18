FROM golang:1.17-alpine AS dev

WORKDIR /app

RUN apk add git

RUN GO111MODULE=on go get github.com/cortesi/modd/cmd/modd

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY .. .

RUN go install github.com/gal/cs3500

CMD ["go", "run", "*.go"]

FROM alpine

WORKDIR /bin

COPY --from=dev /go/bin/timber-api ./timber-api

CMD ["sh", "-c", "timber-api", "-p"]