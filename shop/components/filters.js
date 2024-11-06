moment.locale("nl");

function format_datetime(dt) {
  return moment.tz(dt, "utc").tz(moment.tz.guess()).calendar();
}

Vue.filter("formatDateTime", format_datetime);

function format_date(dt) {
  return moment.tz(dt, "utc").tz(moment.tz.guess()).format("D MMMM YYYY")
}

Vue.filter("formatDate", format_date);

function fixed2(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

Vue.filter("fixed2", fixed2);
