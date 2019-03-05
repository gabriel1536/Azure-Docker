const fs = require('fs');
const path = require('path');

//NOTE: 
// THIS IS JUST AN EXAMPLE THAT YOU CAN SERVE YOUR HTML PAGE WITH AZURE FUNCTIONS

module.exports = async function (context, req) {
    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            headers: {
                "Content-Type": "text/html"
            },
            // status: 200, /* Defaults to 200 */
            body: "<h1>Hello " + (req.query.name || req.body.name) + "</h1>"
        };
    }
    else  {
        let filepath = "index.html";

        let html = fs.readFileSync(path.resolve(__dirname, filepath), 'utf8');

        context.res = {
            status: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: "<h3>" + html + "</h3>"
        };
    }
};