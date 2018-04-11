function findIndex(id,array) {

    for(var i=0;i<array.length;i++)
    {
        if(array[i].id == id)
        {
            return i ;
        }
    }

    return false;
}
function range(start, end) {
    var arr = [];
    for(var i=start;i<=end;i++)
    {
        arr.push(i);
    }
    return arr;
}
var fs = require('fs');

function getSeries()
{
    var series = [];
    var seriesDOM = document.querySelectorAll('.row .pretty-figure figcaption > a');

    if(seriesDOM.length > 0)
    {
        for(var k = 0;k<seriesDOM.length;k++ )
        {

            var href  =seriesDOM[k].getAttribute('href').split('/');

            series.push({id:href[href.length - 1],name:seriesDOM[k].innerText});


        }
    }
    return series;
}
function getSeasons()
{
    return document.querySelectorAll('.sezon').length

}
function getEpisodes()
{
    return document.querySelectorAll("#episode-list h4").length;

}
function getLinks()
{
        var linksJSON = [];
        var links =  document.querySelectorAll('.links-table [data-id] .name');
        for(var k in links)
        {
            if(links[k].dataset && links[k].dataset.bind)
            {
                var bind = links[k].dataset.bind;
                var link = bind.split("$data, '").pop().split("', 'embed").shift();
                var language = links[k].innerText;

                linksJSON.push({link:link,language:language});

            }

        }
        return linksJSON;

}


var casper = require('casper').create({
    viewportSize: {
        width: 1920,
        height: 1080
    },
    pageSettings: {
        userAgent: "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"
    }
});
var pages = (casper.cli.options.range)?range(casper.cli.options.range.split(",")[0],casper.cli.options.range.split(",")[1]):[1];

casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
})

var series=[];
fs.write('series.json','[]');

casper.on("page.error", function(msg, trace) {
    this.echo("Error: " + msg, "ERROR");
});

casper.start();
var startTime = new Date();
var endTime = false;
casper.then(function () {


    this.eachThen(pages, function(response) {

        var page = response.data;
        this.thenOpen('http://misterseries.com/series#page-' + page);

        this.waitForSelector(".row .pretty-figure figcaption > a",
            function () {

                console.log('** Page ' +page+' loaded **');
                series = series.concat(this.evaluate(getSeries)); //JSON.parse(fs.read('series.json')).concat(this.evaluate(getSeries));


            },
            function () {
                console.log("Couldn't load series in page "+page);

            }, 20000 // timeout limit in milliseconds
        );

        this.clear();
    });
})

casper.then(function () {

    this.eachThen(series, function(response) {
        var serie = response.data;
        var index = findIndex(serie.id,series);
        var seasons = [];

        this.thenOpen('http://misterseries.com/series/'+serie.id,function () {

            var data =  this.evaluate(function () {

                if(document.querySelector(".morecontent"))
                {
                    document.querySelector('.moreellipses').innerHTML ="";
                    document.querySelector('.morelink').innerHTML ="";
                    var longDescription = document.querySelector('.shortened').innerText+document.querySelector('.morecontent > span').innerText;

                }
                if(!longDescription)
                {
                    longDescription = document.querySelector('.shortened').innerText;
                }



                return {description:longDescription,cover:document.querySelector("#images-col img").getAttribute('src')};


            });



            series[index]["description"] = data.description;

            series[index]['cover'] =data.cover;

            seasons = range(1,this.evaluate(getSeasons));
        });

        this.then(function () {


            series[index]["episodes"] = [];

            this.eachThen(seasons,function (response) {
                var season = response.data;
                var episodes = [];
                this.thenOpen('http://misterseries.com/series/'+serie.id+'/seasons/'+season,function () {

                    episodes = range(1,this.evaluate(getEpisodes));

                })

                this.then(function () {



                    this.eachThen(episodes,function (response) {

                        var episode = response.data;


                        this.thenOpen('http://misterseries.com/series/'+serie.id+'/seasons/'+season+'/episodes/'+episode,function () {
                            var links = this.evaluate(getLinks);

                            var data = this.evaluate(function () {

                                var longText="";
                                if(document.querySelector('.list-unstyled + [data-bind] .morelink'))
                                {
                                    document.querySelector('.list-unstyled + [data-bind] .morelink').innerHTML = '';
                                    document.querySelector('.list-unstyled + [data-bind] .moreellipses').innerHTML ='';
                                     longText = document.querySelector('.list-unstyled + [data-bind] > .shortened').innerText+document.querySelector('.list-unstyled + [data-bind] .morecontent > span').innerText;

                                }

                                if(!longText)
                                {
                                     longText = document.querySelector('.list-unstyled + [data-bind] .shortened').innerText;
                                }


                                var name = document.querySelector(".streaming-details .episode-byline + a").innerText;

                                return {name:name,description:longText};
                            });

                            //series[index]["episodes"][episode] = links;
                            if(data)
                            {
                                series[index]["episodes"].push({links:links,name:data.name,description:data.description,season:season});
                                console.log("Loaded episode "+series[index]["episodes"].length+" - "+serie.name);
                            }
                            else
                            {
                                console.log("Episode")
                            }

                        });


                    })

                })

            });

            this.then(function () {
               console.log("Loaded serie '"+serie.name+"'- "+seasons.length+" seasons / "+series[index]["episodes"].length+" episodes") ;
            });

        });


        this.clear();



    });

});


casper.then(function () {

    fs.write('series.json', JSON.stringify(series), 'w');
    endTime = new Date();
    var minutesTook = Math.round(Math.abs(endTime - startTime) / 1000 / 60);

    console.log(series.length+' series loaded in aproximately'+minutesTook+" minutes");
})

casper.run();