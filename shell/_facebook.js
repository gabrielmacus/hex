
console.log("Starting...");

var args = require('system').args;

var fs = require('fs');

var page = require('webpage').create();

var status=false;

var groups = JSON.parse(args[1]);

function logIn() {

page.evaluate(function(args){
        document.querySelector("input[name='email']").value = args[2];
        document.querySelector("input[name='pass']").value = args[3];
        document.querySelector("#login_form").submit();
        console.log("Logged in ");
    },args);
}

function postInGroup() {


    for(var i=1;i<=3;i++)
    {
        var arg = 6+i;
        if(args[arg])
        {
            page.uploadFile('input[name="file'+i+'"]', args[arg]);
        }


    }


    page.evaluate(function (args) {
        document.querySelector("[name='composer_attachment_sell_title']").value=args[4];
        document.querySelector("[name='composer_attachment_sell_price']").value=args[5];
        document.querySelector("[name='xc_message']").value=args[6];
        document.querySelector("[type='submit']").click();

    },args);

}

function goToGroup(id) {

    console.log("Going to group "+id);
    page.open("https://m.facebook.com/groups/"+id);

}
function onConsoleMessage(msg) {
    console.log(msg);
};
function sellSomething() {
    page.evaluate(
        function () {
            document.querySelector("[href*='/groups/sell/']").click()
        }
    );
}
function goHome() {

   var goHome= page.evaluate(function () {

        if( document.querySelector("[target]"))
        {
            document.querySelector("[target]").click();
            return false;
        }
        else
        {
            return true;
        }
    });

   if(goHome)
   {
       page.open("https://www.facebook.com/home.php");
   }


}
page.onConsoleMessage = onConsoleMessage;

page.onCallback = function(data) {

    switch (data.type)
    {
        case "goto":

            page.open(data.url);

            break;
    }


};
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko';



var groupId = groups.pop();
page.onLoadFinished=function (response) {

    if(response=='success')
    {
        console.log("Status: "+status);

        page.render('C:\\Users\\Puers\\Pictures\\facebook\\image'+groupId+"-"+status+".png");

        if(!status || typeof  status == "undefined" || status == "false")
        {

            logIn();
            status="onetouch-login";
        }
        else if(status =="onetouch-login")
        {

            status="logged-in";
            goHome();


        }
        else if(status == "logged-in")
        {
            status="in-group";
            goToGroup(groupId);

        }
        else if(status == "in-group")
        {

            sellSomething();
            status='selling-something';

        }
        else if(status=='selling-something')
        {
            console.log("Posting on ",groupId);
            postInGroup();

            if(groups.length > 0)
            {
                status = "logged-in";
                groupId = groups.pop();

                goToGroup(groupId);

            }
            else
            {
                status="end";
            }



        }
        else if(status=='end')
        {
            console.log("Succesfully posted on group");
            phantom.exit();
        }
        else
        {
            console.log("Unknown status:"+status);
            phantom.exit();
        }

    }
    else
    {
        console.log("Failed");
        phantom.exit();
    }

}
page.open("https://m.facebook.com");
