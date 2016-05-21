Template.menuBar.rendered = function() {

	var $menu = $("#menu_bar_container");

   	$(window).scroll(function(){
        if ( $(this).scrollTop() > 80 && $menu.hasClass("default") ){
            $menu.removeClass("default").addClass("fixed");
        } else if($(this).scrollTop() <= 80 && $menu.hasClass("fixed")) {
            $menu.removeClass("fixed").addClass("default");
        }
    });
}



Template.home.rendered = function() {
	clickMenuPan('home')
}
Template.groups.rendered = function() {
	clickMenuPan('groups')
}
Template.groupInfo.rendered = function() {
	clickMenuPan('groups')	


	var nav_panel = $("#group_navigate");

   	$(window).scroll(function(){
   		
        if ( $(this).scrollTop() > 80 && $(nav_panel).hasClass("default") ){
            $(nav_panel).removeClass("default").addClass("fixed");
        } else if($(this).scrollTop() <= 80 && $(nav_panel).hasClass("fixed")) {
            $(nav_panel).removeClass("fixed").addClass("default");
        }
    });
}


Template.members.rendered = function() {
	clickNavPan(Template.currentData().title, 'members')
}
Template.menu.rendered = function() {
	clickNavPan(Template.currentData().title, 'menu');
	
}
Template.pizzaDay.rendered = function() {
	clickNavPan(Template.currentData().title, 'pizzaDay')
}



function clickMenuPan(elem) {
	$('.menu_bar_item').removeClass('selected_green');
	$('#' + elem).addClass('selected_green');	
}
function clickNavPan(title, elem) {
	$('.navigate_item').css('color', 'black').removeClass('selected_green');
	$('#navigate_items')
		.find("a[href='/groups/"  + title + "?navigateItem=" + elem + "']")
			.css('color', 'white').addClass('selected_green');
}