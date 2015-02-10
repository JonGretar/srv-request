# SRV Request

Extends [Request](https://github.com/request/request) with lookup of DNS SRV records.

Use just as you would Request except that instead of the hostname in the URI you use the SRV record host. A random host will be chosen from the SRV results.

Given the following example setup created using [SkyDNS](https://github.com/skynetservices/skydns) and [Registrator](https://github.com/progrium/registrator):

```sh
root@server1:~# dig SRV myservice.skydns.local
...
;; QUESTION SECTION:
;myservice.skydns.local.	IN	SRV
;; ANSWER SECTION:
myservice.skydns.local. 33 IN	SRV	10 100 8110 server1-myservice-8000.myservice.skydns.local.
myservice.skydns.local. 33 IN	SRV	10 100 8110 server2-myservice-8000.myservice.skydns.local.
;; ADDITIONAL SECTION:
server1-myservice-8000.myservice.skydns.local. 33 IN A 10.10.10.30
server2-myservice-8000.myservice.skydns.local. 33 IN A 10.10.10.40
...
```

You will make your request as such:

```javascript
var request = require('request');
request('http://myservice.skydns.local/v1/ping', function (error, response, body) {
	console.log(error, body)
});
```

The HTTP requests will then be made to the URI: `http://server1-myservice-8000.myservice.skydns.local:8110/v1/ping`.
