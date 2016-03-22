# kbpgptesting
Testing code for kbpgp 

1) Run 'node test-generate.js' to generate a new key pair

2) Run 'node test-encrypt.js kbpgp-pubkey.txt' to do a test encryption (parameter is the public key generated in step 1)

3) Run 'node test-decrypt.js kbpgp-privkey.txt kbpgp-encrypted-output.txt' (parameters are private key generated in step 1 and encrypted file generated in step 2)
