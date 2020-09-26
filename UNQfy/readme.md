node main.js addArtist "Soda Stereo" "Argentina"
node main.js addArtist "2 minutos" "Argentina"
node main.js addArtist "Virus" "Argentina"
node main.js addArtist "Animal" "Argentina"
node main.js addArtist "Rolling Stones" "USA"
node main.js addArtist "Aerosmith" "USA"

node main.js removeArtist "2 minutos" "Argentina"

node main.js addAlbum "Big Ones" 1991 "Aerosmith"
node main.js addAlbum "Voodoo" "1987" "Rolling Stones"  
node main.js addAlbum "Valentín Alsina" "1994" "2 minutos"
node main.js addAlbum "Astral" "1990" "Soda Stereo"
node main.js addAlbum "Animal" "1998" "Animal"
node main.js addAlbum "Animal2" "1998" "Animal2"
node main.js addAlbum "Grandes exitos" "1983" "Virus"

node main.js removeAlbum "Animal2"

node main.js addTrack "Love in an elevator" 300 "Pop" "Big Ones" 
node main.js addTrack "Vaselina" 90 "Rock" "Valentín Alsina" 
node main.js addTrack "Zoom" 160 "Pop" "Astral" 
node main.js addTrack "Flip the switch" 240 "Pop" "Voodoo"
node main.js addTrack "Luna de miel" 140 "Pop" "Grandes exitos" 
node main.js addTrack "Lucha eterna" 60 "Pop" "Animal"
node main.js addTrack "cancion mal agregada" 60 "Pop" "Animal"

node main.js removeTrack "cancion mal agregada"


node main.js browseArtists
node main.js browseTracks
node main.js browseAlbums
node main.js browseEverything "o"
