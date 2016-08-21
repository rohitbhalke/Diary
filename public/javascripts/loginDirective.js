(function($){

    var createButton;
    $(function(){
        createButton = $('#createAccount');
        createButton.on('click',createAccount);
    });

    function createAccount(){

        window.location.href = 'create';
    }


})(jQuery);