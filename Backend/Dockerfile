FROM golang:1.24.4-alpine AS builder

WORKDIR /app

COPY . .

RUN go build -o /bin/api cmd/main.go

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /bin/api .
EXPOSE 8080
CMD ["./api"]
