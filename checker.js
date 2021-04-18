const request = require('request');
const colors = require('colors');
const chalk = require('chalk');
const prompt = require('prompt');
const fs = require('fs');
const proxies = fs.readFileSync('proxies.txt', 'utf-8').replace(/\r/gi, '').split('\n');
const usernames = [...new Set(require('fs').readFileSync('usernames.txt', 'utf-8').replace(/\r/g, '').split('\n'))];

const ProxyAgent = require('proxy-agent');



process.on('uncaughtException', e => {});
process.on('uncaughtRejection', e => {});
process.warn = () => {};

var available = 0;
var unavailable = 0;
var rate = 0;
var checked = 0;

function write(content, file) {
    fs.appendFile(file, content, function(err) {
    });
}

function pcheck(username,type) {
    var proxy = proxies[Math.floor(Math.random() * proxies.length)];
	var agent = new ProxyAgent(`${type}://` + proxy);
    request({
        method: "GET",
        url: `https://www.last.fm/user/${username}`,
		agent,
        json: true,
    }, (err, res, body) => {
        if (res && res.statusCode === 200) {
            unavailable++;
            console.log(chalk.red("[%s] (%s/%s/%s) [Unavailable] Username: %s | Proxy: %s"), res.statusCode, available, checked, usernames.length, username, proxy);
            write(username + "\n", "usernames/unavailable.txt");
		}
		else if (res && res.statusCode === 404) {
			available++;
			console.log(chalk.green(`[%s] (%s/%s/%s) [Available] Username: %s | Proxy: %s`), res.statusCode, available, checked, usernames.length, username, proxy);
			write(username + "\n", "usernames/available.txt");

        } else if (res && res.statusCode === 429) {
            rate++;
            console.log(chalk.red("[%s] (%s) Proxy: %s has been rate limited".inverse), res.statusCode, rate, proxy);
            pcheck(username);
		}
		else{
			pcheck(username)
		}

        checked = available + unavailable;
        process.title = `[313][LastFM Usernames Checker] - ${checked}/${usernames.length} Total Checked | ${available} Available | ${unavailable} Unavailable | ${rate} Rate Limited`;
    });
}

function check(username) {
    var proxy = proxies[Math.floor(Math.random() * proxies.length)];
    request({
        method: "GET",
        url: `https://www.last.fm/user/${username}`,
        json: true,
    }, (err, res, body) => {
        if (res && res.statusCode === 200) {
            unavailable++;
            console.log(chalk.red("[%s] (%s/%s/%s) [Unavailable] Username: %s  "), res.statusCode, available, checked, usernames.length, username);
            write(username + "\n", "usernames/unavailable.txt");
		}
		else if (res && res.statusCode === 404) {
			available++;
			console.log(chalk.green(`[%s] (%s/%s/%s) [Available] Username: %s `), res.statusCode, available, checked, usernames.length, username);
			write(username + "\n", "usernames/available.txt");

        } else if (res && res.statusCode === 429) {
            rate++;
            console.log(chalk.red("[%s] (%s) you have been rate limited (consider using a VPN)".inverse), res.statusCode, rate);
            check(username);
		}
		else{
			check(username)
		}

        checked = available + unavailable;
        process.title = `[313][LastFM Usernames Checker] - ${checked}/${usernames.length} Total Checked | ${available} Available | ${unavailable} Unavailable | ${rate} Rate Limited`;
    });
}





//Program Startup

function printAsciiLogo() {
  console.log(chalk.inverse`
			▄▄▌   ▄▄▄· .▄▄ · ▄▄▄▄▄·▄▄▄• ▌ ▄ ·.    ▄▄·  ▄ .▄▄▄▄ . ▄▄· ▄ •▄ ▄▄▄ .▄▄▄  
			██•  ▐█ ▀█ ▐█ ▀. •██  ▐▄▄··██ ▐███▪  ▐█ ▌▪██▪▐█▀▄.▀·▐█ ▌▪█▌▄▌▪▀▄.▀·▀▄ █·
			██▪  ▄█▀▀█ ▄▀▀▀█▄ ▐█.▪██▪ ▐█ ▌▐▌▐█·  ██ ▄▄██▀▐█▐▀▀▪▄██ ▄▄▐▀▀▄·▐▀▀▪▄▐▀▀▄ 
			▐█▌▐▌▐█ ▪▐▌▐█▄▪▐█ ▐█▌·██▌.██ ██▌▐█▌  ▐███▌██▌▐▀▐█▄▄▌▐███▌▐█.█▌▐█▄▄▌▐█•█▌
			.▀▀▀  ▀  ▀  ▀▀▀▀  ▀▀▀ ▀▀▀ ▀▀  █▪▀▀▀  ·▀▀▀ ▀▀▀ · ▀▀▀ ·▀▀▀ ·▀  ▀ ▀▀▀ .▀  ▀
						Coded By Luci
`);
}
printAsciiLogo();
process.title = `[313][LastFM Usernames Checker] Created By Luci`;
console.log(chalk.red("[WARN] Some Usernames could be banned! ".inverse));
console.log("[1] Proxied Checking ".inverse);
console.log("[2] Proxyless Checker (Proxies)".inverse);
prompt.start();	
	console.log(""); 
	prompt.get(['options'], function(err, result) {
	console.log('');
	var options = result.options;
		switch(options) {
		case "1":
			console.log(chalk.inverse("[INFO] Press Corrosponding Number to Select Proxy Type! ")); 
			console.log(`[1] https
[2] socks4
[3] socks5`); 
			prompt.get(['type'], function(err, result) {
			console.log('');
			var type = result.type;
			switch(type) {
				case "1": 
					var type = "https";
					break
				case "2":
					var type = "socks4";
					break
				case "3":
					var type = "socks5";
					break
				default:
					var type = "https";
					break
			}
			console.log(`[LastFM Username Checker]: Started!`.inverse);
			console.log(`[Checking %s Usernames with %s Proxies!]`.inverse, usernames.length, proxies.length);
			for (var i in usernames) pcheck(usernames[i],type);
			})
			break;
			
		case "2":
			console.log(`[LastFM Username Checker]: Started!`.inverse);
			console.log(`[Checking %s Usernames with No Proxies!]`.inverse, usernames.length,);
			for (var i in usernames) check(usernames[i]);
			break;
		}
			
		
	})
	
	
