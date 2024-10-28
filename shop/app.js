// don't show drawer by (baseweb) default when screen is small
if($(document).width() < 1200 ) {
  before_app_mount( function() { store.commit("toggle_drawer"); } );
}

// a few console logging wrappers, just to be sure ;-)

function console_log() {
  if(console) {
    console.log(...arguments);
  }
}

function console_info() {
  if(console) {
    console[console.info ? "info" : "log"](...arguments);
  }
}

function console_warn() {
  if(console) {
    console[console.warn ? "warn" : "log"](...arguments);
  }
}
