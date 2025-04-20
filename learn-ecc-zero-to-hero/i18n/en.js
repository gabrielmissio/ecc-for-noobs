export default {
  // Global
  language: 'English',
  welcome_title: '📚 Learn Elliptic Curve Cryptography',
  welcome_description: 'This interactive educational tool helps you understand the foundations of modern cryptography used in Bitcoin, Ethereum, and other blockchain platforms. You\'ll explore key generation, address formats, message signing, and more — all based on the secp256k1 curve used in ECDSA (Elliptic Curve Digital Signature Algorithm).',
  how_it_works_title: '🧠 How It Works',
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
  signing_signature_label: 'Signature: ',
  signing_signature_result_label: 'Verification Result: ',

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
}
