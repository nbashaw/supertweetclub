$(function(){

  // Set up Firebase
  var fb = new Firebase("https://super-tweet-test.firebaseio.com/");
  var room = fb.child('room');

  // Show the sidebar
  var el = '<div id="stc" class="module roaming-module"><div class="flex-module">';
  el += '<h3>Super Tweet Club <small id="stc-online-label"><span id="stc-online-count">0</span> Online<div id="stc-online-list"></div></small></h3><hr>';
  el += '<div id="stc-room"><table id="stc-chat-list"></table></div><input id="stc-new-message" type="text" placeholder="Text goes here"></div></div>';
  $('.dashboard-right').prepend(el);
  var $room = $('#stc-room');
  var $chatList = $('#stc-chat-list');
  var username = $('.DashboardProfileCard-avatarLink').attr('href').replace('/', '');
  var avatarUrl = $('.DashboardProfileCard-avatarImage').attr('src');
  var homeActive = $('#global-nav-home').hasClass('active');

  // Listen for new message events
  $('#stc-new-message').on('keyup', function(e){
    if (e.keyCode === 13) {
      var msgValue = $(this).val();
      sendMessage(encodeHTML(msgValue));
      $(this).val('');
    }
  });

  function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  // Send a message
  var sendMessage = function(text) {
    var newMessageRef = room.push();
    newMessageRef.set({
      'username': username,
      'avatar': avatarUrl,
      'text': text
    });
  };

  // Get the previous 50 messages, then new ones as they're added
  room.endAt().limit(50).on('child_added', function(childSnapshot, prevChildName) {
    var message = childSnapshot.val();
    $chatList.append('<tr class="stc-message"><td class="stc-avatar"><a target="_blank" href="http://twitter.com/'+message.username+'"><img alt="'+message.username+'" class="stc-avatar-img" src="'+message.avatar+'"></a></td><td>'+message.text+'</td></tr>');
    $room.scrollTop($room[0].scrollHeight);
  });

  // Manage presence
  if (homeActive) {
    var amOnline = fb.child('.info/connected');
    var userRef = fb.child('presence/' + username);
    amOnline.on('value', function(snapshot) {
      if (snapshot.val()) {
        userRef.onDisconnect().remove();
        userRef.set(true);
      }
    });
  }

  // Show list of who's online
  $onlineCountEl = $('#stc-online-count');
  $onlineListEl = $('#stc-online-list');
  fb.child('presence').on('value', function(snapshot){
    $onlineCountEl.text(snapshot.numChildren());
    $onlineListEl.html('');
    snapshot.forEach(function(childSnapshot){
      $onlineListEl.append('<li>' + childSnapshot.name() + '</li>');
    });
  });


});
