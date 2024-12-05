FROM openjdk:17-slim

MAINTAINER MOZAJKA <info@mozajka.co>

WORKDIR /app

COPY target/*.jar /app/isme-hydro-proxy-service.jar
CMD ["java", "-Xmx200m", "-jar", "/app/isme-hydro-proxy-service.jar"]

EXPOSE 8080