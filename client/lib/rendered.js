Template.menuBar.rendered = function() {
	var $menu = $("#menu_bar_container");

   	$(window).scroll(function(){
        if ( $(this).scrollTop() > 80 && $menu.hasClass("default") ){
            $menu.removeClass("default").addClass("fixed");
        } 
        else if($(this).scrollTop() <= 80 && $menu.hasClass("fixed")) {
            $menu.removeClass("fixed").addClass("default");
        }
    });
};

Template.home.rendered = function() {
	$('#home').clickMenuBarItem();
};

Template.groups.rendered = function() {
	$('#groups').clickMenuBarItem();
};

Template.groupInfo.rendered = function() {
	var nav_panel = $("#group_navigate");

	$('#groups').clickMenuBarItem();

   	$(window).scroll(function(){
   		
        if ( $(this).scrollTop() > 80 && $(nav_panel).hasClass("default") ){
            $(nav_panel).removeClass("default").addClass("fixed");
        } else if($(this).scrollTop() <= 80 && $(nav_panel).hasClass("fixed")) {
            $(nav_panel).removeClass("fixed").addClass("default");
        }
    });
};

Template.members.rendered = function() {
	clickNavigateBarItem(Template.currentData().title, 'members')
};

Template.menu.rendered = function() {
	clickNavigateBarItem(Template.currentData().title, 'menu');	
};

Template.pizzaDay.rendered = function() {
	clickNavigateBarItem(Template.currentData().title, 'pizzaDay')
};

function clickNavigateBarItem(title, elem) {
	$('.navigate_item').css('color', 'black').removeClass('selected_green');
	$('#navigate_items')
		.find("a[href='/groups/"  + title + "?navigateItem=" + elem + "']")
			.css('color', 'white').addClass('selected_green');
}
