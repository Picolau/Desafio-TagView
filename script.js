var MY_KEY = "cc84b4657459721bb2a516744cfd4b1e";
var imgURL = "https://image.tmdb.org/t/p/original"
var i,j,k,l,indActors,indMovies;

var getActorsID = function(){
    var ACTORS_NAMES = document.getElementById("txtActor").value;
    var STR_ACTORS_LIST = ACTORS_NAMES.split(",");
    var NUM_OF_ACTORS = STR_ACTORS_LIST.length;
    var ACTORS_ID = new Array(NUM_OF_ACTORS);
    for (i = 0, indActors = 0;i < NUM_OF_ACTORS;i++){
        var URL_ACTOR = "https://api.themoviedb.org/3/search/person?api_key="+ MY_KEY +"&query="+STR_ACTORS_LIST[i];
        $.getJSON(URL_ACTOR, function(data){
            var ACTOR_ID = data.results[0].id;
            ACTORS_ID[indActors++] = ACTOR_ID;
            if (indActors == NUM_OF_ACTORS){
                getActorsMovies(ACTORS_ID);
            }
        })
        .fail(function(result){
            document.getElementById("filmes").innerHTML = "Nenhum resultado encontrado!";
        });
    }
}

var getActorsMovies = function(ACTORS_ID){
    var MOVIES_ARRAY = new Array(ACTORS_ID.length);
    i = 0;
    for (i = 0,indMovies = 0;i < ACTORS_ID.length;i++){
        $.getJSON("https://api.themoviedb.org/3/person/"+ACTORS_ID[i]+"/credits?api_key=" + MY_KEY, function(data){
            var MY_MOVIES = new Array(data.cast.length);
            for (j = 0;j < data.cast.length;j++){
                MY_MOVIES[j] = data.cast[j].original_title;
            }
            MOVIES_ARRAY[indMovies++] = MY_MOVIES;
            if (indMovies == ACTORS_ID.length){
                var indMovie = 1;
                i = MOVIES_ARRAY.length - 1;
                document.getElementById("filmes").innerHTML = "";
                for (j = 0;j < MOVIES_ARRAY[i].length;j++){
                    var movieToSearch = MOVIES_ARRAY[i][j];
                    var foundMovie = true;
                    for (k = 0;k < MOVIES_ARRAY.length && foundMovie;k++){
                        if (k != i){
                            foundMovie = false;
                            for (l = 0;l < MOVIES_ARRAY[k].length && !foundMovie;l++){
                                var movieToVerify = MOVIES_ARRAY[k][l];
                                if (movieToSearch == movieToVerify){
                                    foundMovie = true;
                                }
                            }
                        }
                    }
                    if (foundMovie){
                        document.getElementById("filmes").innerHTML += movieToSearch;
                        document.getElementById("filmes").innerHTML += "<br/>";
                        document.getElementById("filmes").innerHTML += "<img width=300 height=400 src="+ (imgURL + data.cast[j].poster_path) +"/><br/><br/>";
                        indMovie++;
                    }
                }
            }
            if (indMovie == 1){
                document.getElementById("filmes").innerHTML = "Nenhum resultado encontrado!";
            }
        })
        .fail(function(result){
            document.getElementById("filmes").innerHTML = "Erro ao tentar buscar os filmes em comum desses atores!";
        });
    }
}