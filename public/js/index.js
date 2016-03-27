$(document).ready(function() {
  /*global _*/
  $.ajax({
    type: "GET",
    url: 'http://localhost:1738/user',
    success: function(users) {
      drawUsers(users);
      console.log(Cookies.get());
      removeLogin();
      profileBTN();
      logoutBTN();
    }
  });
}); // end getJSON


function drawUsers(users) {
  return $.map(users, function(user) {
    $.ajax({
      type: "GET",
      url: 'http://localhost:1738/user/' + user.id + '/profile',
      success: function(usersinfo) {
        $.map(usersinfo, function(userinfo) {
          console.log(userinfo);
          $('#userlist').append('<div id="' + user.id + '" class="flexbox">');
          $('#' + user.id).append('<img id="proimage" class="img-circle img-responsive img-center" src="/images/'+ user.img + '" alt="">');
          $('#' + user.id).append('<h1 align="center">' + userinfo.title.name + '. ' + user.nameFirst + ' ' + user.nameLast + '</h2>');
          $('#' + user.id).append('<p align="center">' + user.desc + '</p></div></div>');
        });
      }
    });
  });
}

function removeLogin() {
if (Cookies.get('name')) {
  return $('.cd-signin').remove();
  }
}

function logoutBTN() {
if (Cookies.get('name')) {
  return $('#menu').append('<li><a href="/logout">Logout</a></li>');
  }
}

function profileBTN() {
if (Cookies.get('name')) {
  return $('#menu').append('<li><a href="profile.html">Profile</a></li>');
  }
}

function welcome() {
if (Cookies.get('name')) {
  return $('#menu').append('<li><a href="profile.html">Profile</a></li>');
  }
}
