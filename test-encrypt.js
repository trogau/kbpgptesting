var kbpgp = require('kbpgp');
var fs = require('fs');
var util = require("util");

var alice_pgp_key;

function getKeyFile(filepath, callback) {
	var keyfile; 
	
	fs.readFile(keyfilepath, "ascii", function (err, data) { 
		if (err) {
			console.log("Can't read file?!"); 
		}
		else
		{	
			callback(data);
			//keyfile = data;
		}
	});
}

keyfilepath = process.argv[2];


getKeyFile(keyfilepath, function(kf) { 

	loadKey(kf, function(key) {  

		var params = {
		  msg:         "Chuck chucky, bo-bucky! This is Alice here!",
		  encrypt_for: key/*,
		  sign_with:   key*/
		};

		kbpgp.box (params, function(err, result_string, result_buffer) {
			console.log(err, result_string, result_buffer);
			console.log("\n\n" + result_string + "\n");
			
			fs.writeFile("kbpgp-encrypted-output.txt", result_string, function(err) {
				if (err) {
					return console.log(err);
				}
			});
		});	
	} );
});

function loadKey(keyfile, callback)
{
	kbpgp.KeyManager.import_from_armored_pgp({ armored: keyfile }, function(err, alice) {
		if (!err) {
			console.log("Key loaded");
			//console.log(util.inspect(alice, { depth: 1, colors:true	}));
			//console.log("Userid: " + alice.pgp.userids[0].userid.toString());
			
			var material = alice.pgp.key(alice.pgp.primary);
			console.log("Key fingerprint:\t" + material.get_fingerprint().toString('hex'));
			console.log("Key ID: \t\t" + material.get_key_id().toString('hex'));
			console.log("Short key ID: \t\t" + material.get_short_key_id().toString('hex'));
			
			callback(alice);
		}
		else
		{
			console.log ("Boo");
			//console.log("Key was: " + alice_pgp_key);
			//console.log("couldn't load alice key:\t" + err);
		}
	});
}