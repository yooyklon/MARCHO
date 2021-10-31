$(function() {
 $('.top-slider__inner').slick({
  arrows: false,
  dots: true,
  fade: true,
  autoplay: true,
  autoplaySpeed: 2000
 })
})

$(function () {
 
 $(".card-product__star").rateYo({
   starWidth: "18px",
   normalFill: "#ccccce",
   ratedFill: "#ffc35b",
   readOnly: true
 });

});

$(function() {
 function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  
  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
}

function initializeClock(id, endtime) {
  const clock = document.querySelector('.banner__time');
  const daysSpan = clock.querySelector('.banner__time-days');
  const hoursSpan = clock.querySelector('.banner__time-hours');
  const minutesSpan = clock.querySelector('.banner__time-minutes');
  const secondsSpan = clock.querySelector('.banner__time-seconds');

  function updateClock() {
    const t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  const timeinterval = setInterval(updateClock, 1000);
}

const deadline = $('.banner__time').attr('data-time');
initializeClock('clockdiv', deadline);
})