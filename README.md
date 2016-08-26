# Simple Video Player -  Snippets / Redux

Open index.html in the browser, all JS in videos.js

## Step one - You need a Redux session token to get some video!

Hit https://i.bbcredux.com/user/login?username=USERNAME&password=PASSWORD

You should get a 200 response and some JSON, your session token is the string in
the field 'token'.

## Step two - Choose a genre

The page exposes an object called VideoPlayer, it has two functions listGenres
and playNextVideo

List genres returns the top level genres (e.g. comedy, sport, etc )

    var genres = VideoPlayer.listGenres();

## Step three - Play the next video for the genre

Choose one of the genres and play the video for it, internally we keep a list of
around 50 videos for each genre, each time you call the playNextVideo function
we cycle through this list.

    VideoPlayer.playNextVideo( myGenre, myReduxSessionToken );
