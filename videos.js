var VideoPlayer = (function() {

  var currentGenre = null;

  var currentVideo = 0;

  // Always play from 60 seconds to miss any continuity announcments
  document.getElementById( 'videoPlayer' )
    .addEventListener( 'loadedmetadata', function() {
      this.currentTime = 60;
    }, false);

  function getJSON( uri, options ) {
    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function () {
      if ( httpRequest.readyState === XMLHttpRequest.DONE ) {
        if ( httpRequest.status === 200 ) {
          options.success( JSON.parse( httpRequest.responseText ) );
        } else {
          options.error();
        }
      }
    }

    httpRequest.open( 'GET', uri, true );

    httpRequest.send( null );
  }

  function snippetsGenreSearch( genre, options ) {
    var uri = 'http://search.bbcsnippets.co.uk/api/search';

    uri += '?filters=is_tv:true&order=start&order_dir=desc&limit=50';
    
    uri += '&genre=' + genre;

    getJSON( uri, options );
  }

  function reduxVideoAccessKey( diskReference, reduxToken, options ) {
    var uri = 'https://i.bbcredux.com/asset/details?';

    uri += 'reference=' + diskReference + '&token=' + reduxToken;

    getJSON( uri, { 
      success: function( data ) {
        options.success( data['key'] );
      },
      error: options.error
    });
  }

  function logError( message ) {
    console.log( 'ERROR: ' + message );
  }

  function playVideo( diskReference, accessKey ) {
    var videoUri = 'https://i.bbcredux.com/asset/media/' + diskReference;

    videoUri += '/' + accessKey + '/h264_mp4_hi_v1.1/video.mp4';

    var player = document.getElementById('videoPlayer');

    player.src = videoUri;

    player.currenTime = 60000;

    player.play();
  }
  
  return {

    // Return array of top-level genres

    listGenres: function() {
      return [
        'childrens',
        'comedy',
        'drama',
        'entertainment',
        'factual',
        'learning',
        'music',
        'news',
        'religion',
        'sport',
        'weather'
      ];
    },

    // Play next video for genre

    playNextVideo: function( genre, reduxToken ) {

      snippetsGenreSearch( genre, {

        success: function( data ) {

          // Find diskReference for current video in genre, increment counter
          // for next, loop if > number of videos in response

          if ( genre != currentGenre ) {
            currentGenre = genre;
            currentVideo = 0;
          }

          if ( currentVideo > data['results'].length ) {
            currentVideo = 0;
          }

          var diskReference = data['results'][currentVideo]['disk_reference'];

          currentVideo++;

          // Get a Redux access key for the video, and play on browser on succes

          reduxVideoAccessKey( diskReference, reduxToken, {

            success: function( accessKey ) {
              playVideo( diskReference, accessKey );
            },

            error: function() {
              logError( 'Error getting Redux Access Key' );
            }

          });

        },

        error: function() {
          logError( 'Error talking to Snippets Search API' );
        }

      });

    }

  };

})();
