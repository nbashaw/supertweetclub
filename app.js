$(function(){

  // Set up Firebase
  var fb = new Firebase("https://super-tweet-club.firebaseio.com/");
  var room = fb.child('room');

  // Show the sidebar
  var el = '<div id="stc" class="module roaming-module"><div class="flex-module">';
  el += '<h3 id="stc-h3">SuperTweetClub <small> &middot; <a href="https://github.com/nbashaw/supertweetclub/blob/master/README.md" target="_blank">About</a> &middot; </small><small id="stc-online-label"><span id="stc-online-count">0</span> Online<div id="stc-online-list"></div></small></h3><hr>';
  // el += '<h4 id="stc-qotd"></h4><hr>';
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
      sendMessage(linkify(encodeHTML(msgValue)));
      $(this).val('');
    }
  });

  // Utilities
  function encodeHTML(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;') };
  var linkify=(function(){var k="[a-z\\d.-]+://",h="(?:(?:[0-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])\\.){3}(?:[0-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])",c="(?:(?:[^\\s!@#$%^&*()_=+[\\]{}\\\\|;:'\",.<>/?]+)\\.)+",n="(?:ac|ad|aero|ae|af|ag|ai|al|am|an|ao|aq|arpa|ar|asia|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|biz|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|cat|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|coop|com|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|info|int|in|io|iq|ir|is|it|je|jm|jobs|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mil|mk|ml|mm|mn|mobi|mo|mp|mq|mr|ms|mt|museum|mu|mv|mw|mx|my|mz|name|na|nc|net|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pro|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tel|tf|tg|th|tj|tk|tl|tm|tn|to|tp|travel|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|xn--0zwm56d|xn--11b5bs3a9aj6g|xn--80akhbyknj4f|xn--9t4b11yi5a|xn--deba0ad|xn--g6w251d|xn--hgbk6aj7f53bba|xn--hlcj6aya9esc7a|xn--jxalpdlp|xn--kgbechtv|xn--zckzah|ye|yt|yu|za|zm|zw)",f="(?:"+c+n+"|"+h+")",o="(?:[;/][^#?<>\\s]*)?",e="(?:\\?[^#<>\\s]*)?(?:#[^<>\\s]*)?",d="\\b"+k+"[^<>\\s]+",a="\\b"+f+o+e+"(?!\\w)",m="mailto:",j="(?:"+m+")?[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@"+f+e+"(?!\\w)",l=new RegExp("(?:"+d+"|"+a+"|"+j+")","ig"),g=new RegExp("^"+k,"i"),b={"'":"`",">":"<",")":"(","]":"[","}":"{","B;":"B+","b:":"b9"},i={callback:function(q,p){return p?'<a target="_blank" href="'+p+'" title="'+p+'">'+q+"</a>":q},punct_regexp:/(?:[!?.,:;'"]|(?:&|&amp;)(?:lt|gt|quot|apos|raquo|laquo|rsaquo|lsaquo);)$/};return function(u,z){z=z||{};var w,v,A,p,x="",t=[],s,E,C,y,q,D,B,r;for(v in i){if(z[v]===undefined){z[v]=i[v]}}while(w=l.exec(u)){A=w[0];E=l.lastIndex;C=E-A.length;if(/[\/:]/.test(u.charAt(C-1))){continue}do{y=A;r=A.substr(-1);B=b[r];if(B){q=A.match(new RegExp("\\"+B+"(?!$)","g"));D=A.match(new RegExp("\\"+r,"g"));if((q?q.length:0)<(D?D.length:0)){A=A.substr(0,A.length-1);E--}}if(z.punct_regexp){A=A.replace(z.punct_regexp,function(F){E-=F.length;return""})}}while(A.length&&A!==y);p=A;if(!g.test(p)){p=(p.indexOf("@")!==-1?(!p.indexOf(m)?"":m):!p.indexOf("irc.")?"irc://":!p.indexOf("ftp.")?"ftp://":"http://")+p}if(s!=C){t.push([u.slice(s,C)]);s=E}t.push([A,p])}t.push([u.substr(s)]);for(v=0;v<t.length;v++){x+=z.callback.apply(window,t[v])}return x||u}})();


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
    $chatList.append('<tr class="stc-message"><td class="stc-avatar"><a target="_blank" href="http://twitter.com/'+message.username+'"><img alt="'+message.username+'" class="stc-avatar-img" src="'+message.avatar+'"></a></td><td class="stc-message-text">'+message.text+'</td></tr>');
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

  // // Manage QUOTD
  // var $qotdEL = $('#stc-qotd');
  // fb.child('qotd').on('value', function(snapshot){
  //   $qotdEL.text(snapshot.val());
  // });


});
