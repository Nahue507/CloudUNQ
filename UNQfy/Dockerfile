FROM node:14
# Utiliza la imagen de node 8 como base.
# A partir de esta imagen se ejecutarán los comandos de abajo creando una nueva imagen.

# Configura variables de entorno necesariar para correr node
ENV NODE_ENV=development
ENV DEBUG=true

# Crea un directorio y nos movemos ahí
WORKDIR /home/node/UNQfy

# Copia el package.json package-lock.json en /home/node/my_node_app
COPY package.json .
COPY package-lock.json .

# Ejecuta npm install. Esto produce que se instalen todas las dependencias necearias para correr la aplicación
RUN ["npm", "install"]

# Expone el puerto 8080 donde corre la aplicación
EXPOSE 8080 

# Copia los fuentes dentro del container
COPY Album.js /home/node/UNQfy
COPY Artista.js /home/node/UNQfy
COPY data.json /home/node/UNQfy
COPY Dockerfile /home/node/UNQfy
COPY ErrorsAPI.js /home/node/UNQfy
COPY generateSpotifyCredentials.js /home/node/UNQfy
COPY IdManager.js /home/node/UNQfy
COPY main.js /home/node/UNQfy
COPY musicMatchConnector.js /home/node/UNQfy
COPY package.json /home/node/UNQfy
COPY package-lock.json /home/node/UNQfy
COPY Playlist.js /home/node/UNQfy
COPY spotifyConnector.js /home/node/UNQfy
COPY spotifyCreds.json /home/node/UNQfy
COPY Track.js /home/node/UNQfy
COPY UML.uxf /home/node/UNQfy
COPY UNQFYApiRest.js /home/node/UNQfy
COPY unqfy_back.js /home/node/UNQfy
COPY unqfy.js /home/node/UNQfy
COPY UnqyfyHelper.js /home/node/UNQfy
COPY Usuario.js /home/node/UNQfy

# Le da permisos al usuario node para escribir en /home/node/my_node_app
# Como comentario, notar que el comando RUN nos permite ejecutar culquier comando bash valido.
RUN chown -R node:users /home/node/

# Habilita el usuario node. Por defecto, los containers corren los comandos con el usuario root
USER node

# Comando por defecto sino se provee uno al hacer docker run
# El comando corre el servicio
CMD [ "node", "UNQFYApiRest"]

# LISTO!


# Para construir la imagen
# docker build -t unqfy .

# Para crear la red de docker 
# docker network create --subnet=172.20.0.0/16 unqfynet

# Para correr el container
# docker run --net unqfynet --ip 172.20.0.20 -p 8080:8080 --user node unqfy