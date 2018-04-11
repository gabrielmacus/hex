var roles = false;
var path = require('path');
var file = require('fs');
var rootDir =require('app-root-dir').get();
var menu = false;
/**
 * Important: should be noted that if you set, for example, 'api.user.*' key and then 'api.user.*.delete-friend', access_levels from the first one should be taken in account
 * @type {{LoadRoles: module.exports.LoadRoles, ParsePath: module.exports.ParsePath, CompareEndpoints: module.exports.CompareEndpoints, IsAuthorized: module.exports.IsAuthorized}}
 */
module.exports=
    {
        LoadRoles:function (rolesPath) {

            if(!rolesPath){
                 rolesPath = path.join( require('app-root-dir').get(),"roles.json");
            }


          return JSON.parse(file.readFileSync(rolesPath,{}).toString());


        },
        ParsePath:function (path) {


            if(path[0] == "/")
            {
                path = path.slice(1, path.length);
            }
            if(path[path.length -1] == "/")
            {
                path =path.slice(0,-1);
            }

            return path.split("/");//path.replace(new RegExp("/", 'g'), ".");
        },
        CompareEndpoints:function (a,b) {

            var wilcardEnd = false;
            var loopable = a;
            var comparable = b;

            var aLast = a[a.length-1];
            var bLast = b[b.length-1];


            if((aLast == "*" ) && a.length < b.length)
            {
                wilcardEnd = "*";
                loopable = a;
                comparable = b;
            }
            else if((bLast == "*") && b.length < a.length)
            {
                wilcardEnd = "*";
                loopable = b;
                comparable = a;
            }
            else if((aLast == "$") && b.length == a.length)
            {
                loopable = a;
                comparable = b;
                wilcardEnd = "$";
            }
            else if((bLast == "$") && b.length == a.length)
            {
                loopable = b;
                comparable = a;
                wilcardEnd = "$";
            }

            if(!wilcardEnd && a.length != b.length)
            {
                return false;
            }

            for(var l in loopable)
            {


                if(comparable.indexOf(loopable[l])== -1 && loopable[l] != "*" && loopable[l] !=  "$")
                {
                    return false;
                }
            }



            return true;


        },
        IsAuthorized:function (user,req,rolesPath) {


            try
            {
                user = (user)?user:{role:"guest"};


                var path = req.baseUrl+req.path;

                var method = req.method.toUpperCase();

                path = module.exports.ParsePath(path);

                if(!roles || process.env.APP_STATUS != "production") {roles = module.exports.LoadRoles((rolesPath)?rolesPath:false);}

                if(!roles[user.role] ){ return false; }

                var permission = false;

                for(var i in roles[user.role])
                {

                    var endpoint = i.split(".") ;

                    if(module.exports.CompareEndpoints(endpoint,path) && roles[user.role][i][req.method])
                    {

                        permission = (typeof  roles[user.role][i][req.method].access_level !== "undefined")?roles[user.role][i][req.method].access_level:1;

                        break;
                    }


                }


                return (permission == 0)?false:permission ;

            }
            catch (e)
            {
                console.error(e);

                return false;
            }

        },
        LoadMenu:function (menuPath) {

            if(!menuPath)
            {
                menuPath = path.join(rootDir,"roles-menu.json");
            }

           return JSON.parse( file.readFileSync(menuPath).toString());


        },
        GetMenu:function (user,menuPath) {

            try {
                if(!menu || process.env.APP_STATUS != "production") {

                    menu = module.exports.LoadMenu((menuPath)?menuPath:false);
                }

                if(user.role != process.env.APP_SU_ROLE)
                {
                    return (menu[user.role])?menu[user.role]:false;
                }else
                {
                    var rootMenu = [];
                    for(var i in menu)
                    {
                        for(var j in menu[i])
                        {
                            if(rootMenu.findIndex(function(el){return el.text == menu[i][j].text}) == -1)
                            {
                                rootMenu.push(menu[i][j]);
                            }
                        }
                    }
                    return rootMenu;
                }


            }
            catch (e)
            {
                return false;
            }
        }
    }