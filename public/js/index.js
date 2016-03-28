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
      search();
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
          $('#userlist').append('<div id="' + user.id + '" class="flexbox">');
          $('#' + user.id).append('<img id="proimage" class="img-circle img-responsive img-center" src="/images/' + user.img + '" alt="">');
          $('#' + user.id).append('<h1 align="center">' + userinfo.title.name + '. ' + user.nameFirst + ' ' + user.nameLast + '</h2>');
          $('#' + user.id).append('<p align="center">' + user.desc + '</p></div></div>');
          $('#' + user.id).on('click', function() {
            event.preventDefault();
            var $this = $(this);
            if ($this.hasClass("clicked-once")) {
              $('#pskill' + user.id).remove();
              $('#ul' + user.id).remove();
              $('#' + user.id).css({
                'height': 'auto',
                "padding-box": "auto"
              });
              $this.removeClass("clicked-once");
            } else {
              $this.addClass("clicked-once");
              $('#' + user.id).append('<p id="pskill' + user.id + '">Skills:</p>');
              $('#' + user.id).append('<ul id="ul' + user.id + '">');
              $.map(userinfo.skills, function(skill) {
                $('#ul' + user.id).append('<li>' + skill.name + '</li>');
              });
              $('#' + user.id).css({
                'height': 'auto',
                "padding-box": "auto"
              });

            }
          });
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

function search() {
  $('.search-panel .dropdown-menu').find('a').click(function(e) {
    e.preventDefault();
    var param = $(this).attr("href").replace("#", "")
    var term = $('#searchbar').val();;
    if (param === "contains") {
      console.log(term);
      $.ajax({
        type: "GET",
        url: 'http://localhost:1738/user?contains=' + term + '',

        success: function(skills) {
          $('.flexbox').hide();
          $.map(skills, function(skill) {
            $.map(skill, function(skillinfo) {
              if (skillinfo.users.length) {
                $.map(skillinfo.users, function(skillinfousers) {
                  $('#' + skillinfousers.id).show();
                });
              }
            });
          });
        }
      });

    } else if (param === "greather_than") {
      $.ajax({
        type: "GET",
        url: 'http://localhost:1738/user/',
        success: function(users) {
          $('.flexbox').hide();
          $.map(users, function(user) {
            $.ajax({
              type: "GET",
              url: 'http://localhost:1738/user/' + user.id + '/profile',
              success: function(usersinfo) {
                $.map(usersinfo, function(userinfo) {
                  console.log(userinfo.skills.length);
                  if (userinfo.skills.length > term)
                    $('#' + user.id).show();
                });
              }
            });
          });
        }
      });
    } else if (param === "its_equal") {
      $.ajax({
        type: "GET",
        url: 'http://localhost:1738/user/',
        success: function(users) {
          $('.flexbox').hide();
          $.map(users, function(user) {
            $.ajax({
              type: "GET",
              url: 'http://localhost:1738/user/' + user.id + '/profile',
              success: function(usersinfo) {
                $.map(usersinfo, function(userinfo) {
                  console.log(userinfo.skills.length);
                  if (userinfo.skills.length == term)
                    $('#' + user.id).show();
                });
              }
            });
          });
        }
      });
    } else if (param === "less_than") {
      $.ajax({
        type: "GET",
        url: 'http://localhost:1738/user/',
        success: function(users) {
          $('.flexbox').hide();
          $.map(users, function(user) {
            $.ajax({
              type: "GET",
              url: 'http://localhost:1738/user/' + user.id + '/profile',
              success: function(usersinfo) {
                $.map(usersinfo, function(userinfo) {
                  console.log(userinfo.skills.length);
                  if (userinfo.skills.length < term)
                    $('#' + user.id).show();
                });
              }
            });
          });
        }
      });
    } else {
      return;
    }
  });
}
