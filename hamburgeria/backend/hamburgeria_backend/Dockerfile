# Usa l'immagine di base di Maven con JDK 17 per costruire l'applicazione
FROM maven:3.8.5-openjdk-17 AS build

# Imposta la directory di lavoro nel container
WORKDIR /app

# Copia il file pom.xml nella directory di lavoro
COPY pom.xml .

# Esegue il comando Maven per scaricare le dipendenze
RUN mvn dependency:go-offline

# Copia tutti i file del progetto nell'attuale directory di lavoro del container
COPY . .

# Esegue il comando Maven per buildare l'applicazione Spring Boot
RUN mvn package -DskipTests

# Secondo stage per eseguire l'applicazione Spring Boot
FROM openjdk:17-jdk-alpine

# Imposta la directory di lavoro nel secondo stage
WORKDIR /app

# Copia il file JAR generato nell'attuale directory di lavoro del secondo stage
COPY --from=build /app/target/*.jar app.jar

# Comando di avvio dell'applicazione Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
