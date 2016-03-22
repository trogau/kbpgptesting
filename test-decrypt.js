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
			//callback(data);
			keyfile = data;
		}
	});
	
	fs.readFile(encryptedfilepath, "ascii", function (err, data) { 
		if (err) {
			console.log("Can't read file?!"); 
		}
		else
		{	
			callback(data, keyfile);
		}
	});

}

keyfilepath = process.argv[2];
encryptedfilepath = process.argv[3];

getKeyFile(keyfilepath, function(sf, kf) { 
	//console.log(data + "\n\n---------------\n\n" + kf);

	loadKey(kf, function(key) {  
	
		var ring = new kbpgp.keyring.KeyRing;
		var kms = [key];
		
		console.log("\t\t\t" + key.get_all_pgp_key_ids()[0].toString('hex'));
		console.log("\t\t\t" + key.get_all_pgp_key_ids()[1].toString('hex'));
		
		for (var i in kms) {
			ring.add_key_manager(kms[i]);
		}
		
		kbpgp.unbox({strict: false, keyfetch: ring, armored: sf }, function(err, literals) {
		  if (err != null) {
			return console.log("Problem: " + err);
		  } else {
			console.log("Decrypted message");
			console.log(literals[0].toString());
			var ds = km = null;
			ds = literals[0].get_data_signer();
			if (ds) { km = ds.get_key_manager(); }
			if (km) {
			  console.log("Signed by PGP fingerprint: " + km.get_pgp_fingerprint().toString('hex'));
			}
		  }
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
			//console.log("Key was: " + alice_pgp_key);
			//console.log("couldn't load alice key:\t" + err);
		}
	});
}