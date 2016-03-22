var kbpgp = require('kbpgp');
var fs = require('fs');
var util = require("util");

var alice_pgp_key;

kbpgp.KeyManager.generate_rsa({ userid : "test <user@example.com>" }, function(err, alice) {
	if (!err) {
		// sign alice's subkeys
		alice.sign({}, function(err) {
			//console.log(alice);
			// export demo; dump the private with a passphrase
			alice.export_pgp_private ({
				passphrase: 'booyeah'
			}, function(err, pgp_private) {
					console.log("private key: ", pgp_private);
					fs.writeFile("kbpgp-privkey.txt", pgp_private, function(err) {
						if (err) {
							return console.log(err);
						}
					});	
			});
			alice.export_pgp_public({}, function(err, pgp_public) {
				console.log("public key: ", pgp_public);
					fs.writeFile("kbpgp-pubkey.txt", pgp_public, function(err) {
						if (err) {
							return console.log(err);
						}
					});
			});
		});
	}
});
      
