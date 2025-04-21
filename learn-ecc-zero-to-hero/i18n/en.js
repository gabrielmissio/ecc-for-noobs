export default {
  // Global
  language: 'English',
  welcome_title: '📚 Learn Elliptic Curve Cryptography',
  welcome_description: 'This interactive educational tool helps you understand the foundations of modern cryptography used in Bitcoin, Ethereum, and other blockchain platforms. You\'ll explore key generation, address formats, message signing, and more — all based on the secp256k1 curve used in ECDSA (Elliptic Curve Digital Signature Algorithm).',
  about_title: '📘 About This Tool',

  // ecc-wallet module
  keygen_title: '🔑 Key Generator',
  keygen_description: 'Every blockchain wallet starts here: a random private key (integer between one and 2²⁵⁶ - 2³² - 977). Learn how it creates a unique public key, and how public keys are transformed into addresses used by Bitcoin and Ethereum.',
  keygen_generateBtn_label: 'Generate Address',
  keygen_details: 'Key pair details',
  keygen_private_key: 'Private Key: ',
  keygen_public_key: 'Public Key (Uncompressed): ',
  keygen_addresses: 'Addresses (Bitcoin e Ethereum)',

  // sign-verify module
  signing_title: '✍️ Message Signing (ECDSA)',
  signing_description: 'This section demonstrates how you can digitally sign a message using a private key and later verify it using a public key. This is a core concept behind blockchain transaction authenticity.',
  signing_private_key_placeholder: 'Private key (hex, 64 chars)...',
  signing_message_to_sign_placeholder: 'Message to sign',
  signing_sign_btn_label: 'Sign Message',
  signing_verify_btn_label: 'Verify Signature',
  // signing_signature_label: 'Signature: ',
  signing_signature_result_label: 'Verification Result: ',

  signing_sign_block_title: '🔐 Sign a Message',
  signing_verify_block_title: '✅ Verify a Signature',

  signing_private_key_label: 'Private Key',
  signing_message_label: 'Message',
  signing_signature_label: 'Signature (hex):',
  signing_public_key_result_label: 'Public Key (Uncompressed):',

  signing_verifier_pubkey_label: 'Public Key',
  signing_verifier_message_label: 'Message',
  signing_verifier_signature_label: 'Signature',

  signing_verifier_pubkey_placeholder: 'Public key (hex, 130 chars)...',
  signing_verifier_message_placeholder: 'Message to verify...',
  signing_verifier_signature_placeholder: 'Paste the signature...',

  signing_signature_r_label: 'R',
  signing_signature_s_label: 'S',
  signing_verifier_r_placeholder: 'R component of signature (hex)...',
  signing_verifier_s_placeholder: 'S component of signature (hex)...',



  // vanity-search module
  vanity_title: '🎯 Vanity Address Generator',
  vanity_description: 'Vanity addresses are custom-looking blockchain addresses that start with chosen characters. Try generating one! It\'s an example of brute-force searching over many keypairs.',
  vanity_prefix_placeholder: 'Prefix (e.g. 0xdead or 1btc)...',
  vanity_start_btn_label: 'Start',
  vanity_stop_btn_label: 'Stop',
  vanity_status_label: 'Status:',
  vanity_address_label: 'Address:',
  vanity_private_key_label: 'Private Key:',
  vanity_attempts_label: 'Attempts:',
  vanity_time_label: 'Time:',
  vanity_prefix_help_title: '📘 What do prefixes mean?',

  // pow-demo module
  pow_title: '⛏️ Proof of Work Simulator',
  pow_description: 'Learn how Proof of Work operates by simulating mining. Adjust the difficulty, input a message, and let your browser find a nonce that results in a hash starting with a target number of zeros.',
  pow_difficulty_label: 'Difficulty (leading zeros)',
  pow_message_label: 'Block Message / Data',
  pow_message_placeholder: 'Hello, blockchain!...',
  pow_start_btn: '⛏️ Start Mining',
  pow_stop_btn: '🛑 Stop',
  pow_output_title: '📦 Mining Output',
  pow_status_label: 'Status:',
  pow_nonce_label: 'Nonce:',
  pow_hash_label: 'Hash:',
  pow_attempts_label: 'Attempts:',
  pow_elapsed_label: 'Time Elapsed:',

  // lorem ipsum
  how_it_works_title: '🧠 How It Works',
  how_it_works_description: 'This section breaks down how each cryptographic operation is implemented under the hood. Whether you\'re new to blockchain or want to deepen your ECC understanding, these insights will help.',
  how_it_works_keygen_html: '🔑 Key Generation: Your private key is just a number between 1 and n-1. From it, a public key is derived using elliptic curve multiplication: Q = k × G.',
  how_it_works_eth_address_html: '📬 Ethereum Address: Derived from the last 20 bytes of the keccak256 hash of the public key.',
  how_it_works_btc_address_html: '💸 Bitcoin Address: Derived using HASH160 (SHA256 + RIPEMD160), followed by Base58Check encoding.',
  how_it_works_signing_html: '✍️ Signing: A SHA256 hash of the message is signed using ECDSA, producing a signature pair { r, s }.',
  how_it_works_verification_html: '✔️ Verification: The signature is validated using the public key against the message hash.',
  how_it_works_vanity_html: '🎯 Vanity Generator: Repeats key generation until an address starts with your desired prefix — a fun demo of computational effort!',
  how_it_works_pow_html: '⛏️ Proof of Work: Repeatedly hashes the block data + nonce until a hash is found that begins with a target number of leading zeros.',

  // Lorem ipsum
  about_description1: 'This educational playground was built to teach developers, students, and crypto enthusiasts how elliptic curve cryptography powers blockchain security — especially on secp256k1, used by both Bitcoin and Ethereum.',
  about_description2: 'If you\'re learning, inspect the code, tweak parameters, and try unexpected inputs — it\'s a safe space to experiment with ECC fundamentals. 🚀',
}
