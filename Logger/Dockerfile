FROM node:14
# Utiliza la imagen de node 8 como base.
# A partir de esta imagen se ejecutarán los comandos de abajo creando una nueva imagen.

# Configura variables de entorno necesariar para correr node
ENV NODE_ENV=development
ENV DEBUG=true

# Crea un directorio y nos movemos ahí
WORKDIR /home/node/logger

# Copia el package.json package-lock.json en /home/node/my_node_app
COPY package.json .
COPY package-lock.json .

# Ejecuta npm install. Esto produce que se instalen todas las dependencias necearias para correr la aplicación
RUN ["npm", "install"]

# Expone el puerto 8083 donde corre la aplicación
EXPOSE 8083 

# Copia los fuentes dentro del container


COPY ErrorsAPI.js /home/node/logger/
COPY loggingApiRest.js /home/node/logger/
COPY logService.js /home/node/logger/
COPY package.json /home/node/logger/
COPY package-lock.json /home/node/logger/

# Le da permisos al usuario node para escribir en /home/node/my_node_app
# Como comentario, notar que el comando RUN nos permite ejecutar culquier comando bash valido.
RUN chown -R node:users /home/node/

# Habilita el usuario node. Por defecto, los containers corren los comandos con el usuario root
USER node

# Comando por defecto sino se provee uno al hacer docker run
# El comando corre el servicio
CMD [ "node", "loggingApiRest"]

# LISTO!


# Para construir la imagen
# docker build -t logger .

# Para armar la red docker
# sudo docker network create --subnet=172.20.0.0/16 unqfynet

# Para correr el container
# docker run --net unqfynet --ip 172.20.0.30 -p 8083:8083 --user node logger