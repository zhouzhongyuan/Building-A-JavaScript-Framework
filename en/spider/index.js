const request  = require('superagent');
const cheerio = require('cheerio')
const fs = require('fs');

// request
//     .get('http://dailyjs.com/tag/lmaf/page/16/')
//     .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
//     .end(function(err, res){
//         if(err){
//             console.log(err)
//         }
//         console.log(res.text)
//         // download file
//         fs.writeFile('16.html', res.text, (err) => {
//             if (err) throw err;
//             console.log('It\'s saved!');
//         });
//
//     });


/*
// 所有标题和链接
fs.readFile('16.html', (err, data) => {
    if (err) throw err;
    // search
    let $ = cheerio.load(data);
    const h1List = $('h1');
    console.log( h1List.length );
    h1List.each(function (index, item) {
        console.log($($(item).html()).attr('href'), $(item).text());
    })
});*/
getArticle('/2010/06/16/framework-part-17/', "Let's Make a Framework: Animations Part 3")
function getArticle(link, title){
    link = 'http://dailyjs.com' + link;
    let order = link.split('-')[2];
    order = order.slice(0, order.length - 1);
    order = order.length === 1 ? `0{order}` : order;
    title = `${order}-${title}.html`;
    request
        .get(link)
        .set('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
        .end(function(err, res){
            if(err){
                console.log(err)
            }
            fs.writeFile(title, res.text, (err) => {
                if (err) throw err;
                console.log('It\'s saved!');
            });

        });
}
