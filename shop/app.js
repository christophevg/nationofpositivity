// don't show drawer by (baseweb) default when screen is small
if($(document).width() < 1200 ) {
  before_app_mount( function() { store.commit("toggle_drawer"); } );
}
