// Replace with your domain
const domain = "aws.com"

/*
Redirect rules, each rule defines one or multiple locations for a subdomain of the domain defined above.
If you define multiple locations the key of each location defines the path to which the location is applied
You can define a default location for each subdomain using "*" as path.
The default redirect location for all requests is set in the handler below, replace it with yours.
*/
const redirects = {
    "twitch": "https://twitch.tv/aws",
    "console": {
        "*": "https://console.aws.amazon.com",
        "/lambda": "https://console.aws.amazon.com/lambda",
    },
};

exports.handler = async (event, context) => {
    let request = event.Records[0].cf.request;
    var host = request.headers['host'][0].value;

    // Default redirect location replace it with yours
    var location = 'https://aws.amazon.com' + request.uri;

    if (host.endsWith("." + domain)) {
        var subdomain = host.replace("." + domain, "");
        if (subdomain in redirects) {
            var redirect = redirects[subdomain];
            if(redirect.constructor == String) {
                location = redirect;
            } else if(redirect.constructor == Object) {
                if(request.uri in redirect) {
                    location = redirect[request.uri];
                } else if("*" in redirect) {
                    location = redirect["*"];
                }
            }
        }
    }
    
    const response = {
        status: '302',
        statusDescription: 'Found',
        headers: {
            'location': [{
                key: 'Location',
                value: location,
            }],
            'cache-control': [{
                key: 'Cache-Control',
                value: "max-age=3600"
            }],
        },
    };
    return response;
};
