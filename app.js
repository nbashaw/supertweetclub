$(function(){

  // Set up Firebase
  var room = new Firebase("https://super-tweet-club.firebaseio.com/").child('room');

  // Show the sidebar
  var el = '<div id="stc" class="module roaming-module"><div class="flex-module"><h3>SuperTweetClub</h3><hr><div id="stc-room"></div><input id="stc-new-message" type="text" placeholder="Text goes here"></div></div>';
  $('.dashboard-right').prepend(el);
  var $room = $('#stc-room');
  var username = $('.u-linkComplex-target').text();

  // Listen for new message events
  $('#stc-new-message').on('keyup', function(e){
    if (e.keyCode === 13) {
      var msgValue = $(this).val();
      sendMessage(msgValue);
      $(this).val('');
    }
  });

  // Send a message
  var sendMessage = function(text) {
    var newMessageRef = room.push();
        newMessageRef.set({'username': username, 'text': text});
  };

  // Get new messages as they're added
  room.on('child_added', function(childSnapshot, prevChildName) {
    var message = childSnapshot.val();
    $room.append('<li><a href="/'+message.username+'">'+message.username+'</a>: '+message.text+'</li>');
    $room.scrollTop($room[0].scrollHeight);
  });

});
