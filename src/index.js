var controls = {}
var video = {}

module.exports = function(_video, _controls)
{
  video = _video;
  controls = _controls;

  video.addEventListener("ended", reset, false);

  video.addEventListener("timeupdate", update);

  setupPlayPause()
  setupMute()
  setupFullscreen()
  setupSeekBar()
  setupTimer()
}

function reset()
{
  if(controls.play_pause)
  {
    controls.play_pause.classList.remove("playing");
    controls.play_pause.className += " paused"
  }

  seek(0);
  video.currentTime = 0;
}

function update()
{
  var value = (100 / video.duration) * video.currentTime;

  if(controls.seekbar)
    seek(value)

  if(controls.timer)
  {
    var time = video.currentTime;

    if(video.currentTime <= 0)
      time = video.duration;

    controls.timer.innerText = formatTime(time);
  }
}

function setupTimer()
{
  video.addEventListener("loadedmetadata", function () {
    if(controls.timer)
    {
      controls.timer.innerText = formatTime(video.duration);
    }
  }, false);
}

function formatTime(time)
{
  var hrs = ~~(Math.round(time) / 3600);
  var mins = ~~((Math.round(time) % 3600) / 60);
  var secs = Math.round(time) % 60;

  var ret = "";

  if (hrs > 0)
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;

  return ret;
}

function setupPlayPause()
{
  if(controls.play_pause)
  {
    controls.play_pause.addEventListener("click", function()
    {
      if(video.paused)
      {
        controls.play_pause.classList.remove("paused");
        controls.play_pause.className += " playing"
        video.play();
      }
      else
      {
        controls.play_pause.classList.remove("playing");
        controls.play_pause.className += " paused"
        video.pause();
      }
    })
  }
}

function setupMute()
{
  if(controls.mute)
  {
    controls.mute.addEventListener("click", function()
    {
      if(!video.muted)
      {
        controls.mute.className += " muted"
        video.muted = true
      }
      else
      {
        controls.mute.classList.remove("muted");
        video.muted = false
      }
    });
  }
}

function setupFullscreen()
{
  if(controls.fullscreen)
  {
    controls.fullscreen.addEventListener("click", function()
    {
      if(video.requestFullscreen)
        video.requestFullscreen()
      else if (video.mozRequestFullScreen)
        video.mozRequestFullScreen();
      else if (video.webkitRequestFullscreen)
        video.webkitRequestFullscreen()
    });
  }
}

function setupSeekBar()
{
  if(controls.seekbar)
  {
    controls.seekbar.addEventListener("click", function(e)
    {
      var posX = e.offsetX;

      var percentage = (posX * 100) / controls.seekbar.offsetWidth;
      var time = video.duration * (percentage / 100);

      seek(percentage);
      video.currentTime = time;

    });
  }
}

function seek(to)
{
  if(controls.seekbar_progress)
  {
    controls.seekbar_progress.style.width = to + "%"
  }
}
