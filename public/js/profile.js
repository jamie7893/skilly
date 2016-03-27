$(document).ready(function() {
  /*global _*/
  $.ajax({
    type: "GET",
    url: 'http://localhost:1738/user/' + Cookies.get('id'),
    success: function(user) {
      console.log(Cookies.get());
      drawUsers(user);
      removeLogin();
      profileBTN();
      logoutBTN();
      profile(user);
      htmlbodyHeightUpdate();
      $(window).resize(function() {
        htmlbodyHeightUpdate();
      });
      $(window).scroll(function() {
        height2 = $('.main').height();
        htmlbodyHeightUpdate();
      });
    }
  });
}); // end getJSON

function drawUsers(user) {
  $.ajax({
    type: "GET",
    url: 'http://localhost:1738/user/' + Cookies.get('id') + '/profile',
    success: function(usersinfo) {
      console.log(usersinfo);
      return $.map(usersinfo, function(userinfo) {
        $('.navbar-brand').text('Welcome ' + user.nameFirst.charAt(0).toUpperCase() + user.nameFirst.slice(1) + '!')
        console.log(userinfo);
        $('#userlist').append('<div id="' + user.id + '" class="flexbox">');
        $('#' + user.id).append('<p align="center"> Click here to upload a profile picture </p></div></div>');
        $('#' + user.id).append('<img class="img-circle img-responsive img-center" src="/images/' + user.img +'" alt="">');
        $('#' + user.id).append('<h1 align="center">' + userinfo.title.name + '. ' + user.nameFirst + ' ' + user.nameLast + '</h2>');
        $('#' + user.id).append('<p align="center">' + user.desc + '</p></div></div>');
      });
    }
  });
}



function htmlbodyHeightUpdate() {
  var height3 = $(window).height();
  var height1 = $('.nav').height() + 50;
  height2 = $('.main').height();
  if (height2 > height3) {
    $('html').height(Math.max(height1, height3, height2) + 10);
    $('body').height(Math.max(height1, height3, height2) + 10);
  } else {
    $('html').height(Math.max(height1, height3, height2));
    $('body').height(Math.max(height1, height3, height2));
  }

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

function profile(user) {
  $.ajax({
    type: "GET",
    url: 'http://localhost:1738/title',
    success: function(titles) {
      $.ajax({
        type: "GET",
        url: 'http://localhost:1738/skill',
        success: function(skills) {
          // Calling Profile Form
          $("#profile_form").click(function() {
            $('#userlist').hide();
            $('input[name=nameFirst]').val(user.nameFirst);
            $('input[name=nameLast]').val(user.nameLast);
            var count = 0;
            $('#newskill').click(function() {
              $('#thenewskill').append('<input type="text" name="skill" id="skill" placeholder="Skill" required="true" /> <br />');
            });
            $.map(titles, function(title) {
              $('#selectpicker').append('<option>' + title.name + '</option>');
            });
            $.map(skills, function(skill) {
              $('#skillpicker').append('<option>' + skill.name + '</option>');
            });
            $('#addskill').click(function() {
              console.log('click');
              $('#skills').append('<select name="skill[]" id="skillpicker' + ++count + '" class="form-control"></select><br />');
              $.map(skills, function(skill) {
                $('#skillpicker' + count).append('<option>' + skill.name + '</option>');
              });

            });
            $(".user_profile").show();
            $(".header_title").text('Profile Setup');
            return false;
          });
        }
      });
    }
  });
}
