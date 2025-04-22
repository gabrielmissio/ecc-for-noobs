export default {
  // Global
  language: 'Português',
  welcome_title: '📚 Aprenda Criptografia de Curvas Elípticas',
  welcome_description: 'Esta ferramenta educacional interativa ajuda você a entender os fundamentos da criptografia moderna usada no Bitcoin, Ethereum e outras plataformas de blockchain. Você irá explorar geração de chaves, formatos de endereços, assinaturas de mensagens e mais — tudo baseado na curva secp256k1 usada pelo ECDSA (Elliptic Curve Digital Signature Algorithm).',
  about_title: '📘 Sobre Esta Ferramenta',

  // ecc-wallet module
  keygen_title: '🔑 Gerador de Chaves',
  keygen_description: 'Toda carteira blockchain começa aqui: uma chave privada aleatória (numero inteiro entre 1 e 2²⁵⁶ - 2³² - 977). Aprenda como ela gera uma chave pública única e como essas chaves são transformadas em endereços utilizados pelo Bitcoin e Ethereum.',
  keygen_private_key_placeholder: 'Chave privada (hex, 64 caracteres)...',
  keygen_generateBtn_label: 'Gerar Chave Aleatória',
  keygen_details: 'Detalhes do par de chaves',
  keygen_private_key: 'Chave Privada: ',
  keygen_public_key: 'Chave Pública (Não Compactada): ',
  keygen_addresses: 'Endereços',
  // keygen_addresses: 'Endereços (Bitcoin e Ethereum)',

  // sign-verify module
  signing_title: '✍️ Assinatura de Mensagens (ECDSA)',
  signing_description: 'Esta seção demonstra como assinar digitalmente uma mensagem usando uma chave privada e verificar essa assinatura com a chave pública. Este é um conceito essencial para garantir a autenticidade das transações em blockchain.',
  signing_private_key_placeholder: 'Chave privada (hex, 64 caracteres)...',
  signing_message_to_sign_placeholder: 'Mensagem para assinar',
  signing_sign_btn_label: 'Assinar Mensagem',
  signing_verify_btn_label: 'Verificar Assinatura',
  signing_signature_label: 'Assinatura: ',
  signing_signature_result_label: 'Resultado da verificação: ',

  // vanity-search module
  vanity_title: '🎯 Gerador de Endereços Personalizados',
  vanity_description: 'Endereços personalizados são endereços blockchain que começam com prefixos definidos por você. Tente gerar um! É um exemplo prático de busca por força bruta entre muitas chaves possíveis.',
  vanity_prefix_placeholder: 'Prefixo (ex: 0xdead ou 1btc)...',
  vanity_start_btn_label: 'Iniciar',
  vanity_stop_btn_label: 'Parar',
  vanity_status_label: 'Status:',
  vanity_address_label: 'Endereço:',
  vanity_private_key_label: 'Chave Privada:',
  vanity_attempts_label: 'Tentativas:',
  vanity_time_label: 'Tempo:',
  vanity_prefix_help_title: '📘 O que significam os prefixos?',

  // pow-demo module
  pow_title: '⛏️ Simulador de Prova de Trabalho (Proof-of-Work)',
  pow_description: 'Aprenda como a Prova de Trabalho funciona simulando mineração. Ajuste a dificuldade, insira uma mensagem e deixe seu navegador encontrar um nonce que resulte em um hash começando com zeros.',
  pow_difficulty_label: 'Dificuldade (zeros iniciais)',
  pow_message_label: 'Mensagem / Dados do Bloco',
  pow_message_placeholder: 'Olá, blockchain!...',
  pow_start_btn: '⛏️ Iniciar Mineração',
  pow_stop_btn: '🛑 Parar',
  pow_output_title: '📦 Resultado da Mineração',
  pow_status_label: 'Status:',
  pow_nonce_label: 'Nonce:',
  pow_hash_label: 'Hash:',
  pow_attempts_label: 'Tentativas:',
  pow_elapsed_label: 'Tempo:',

  // lorem ipsum
  how_it_works_title: '🧠 Como Funciona',
  how_it_works_description: 'Esta seção explica como cada operação criptográfica é implementada por baixo dos panos. Seja você novo em blockchain ou queira aprofundar seu entendimento de ECC, esses insights irão ajudar.',
  how_it_works_keygen_html: '🔑 Geração de Chaves: Sua chave privada é apenas um número entre 1 e n-1. A partir dela, a chave pública é derivada usando multiplicação por curva elíptica: Q = k × G.',
  how_it_works_eth_address_html: '📬 Endereço Ethereum: Derivado dos últimos 20 bytes do hash keccak256 da chave pública.',
  how_it_works_btc_address_html: '💸 Endereço Bitcoin: Derivado usando HASH160 (SHA256 + RIPEMD160), seguido de codificação Base58Check.',
  how_it_works_signing_html: '✍️ Assinatura: Um hash SHA256 da mensagem é assinado usando ECDSA, produzindo um par de assinatura { r, s }.',
  how_it_works_verification_html: '✔️ Verificação: A assinatura é validada usando a chave pública em relação ao hash da mensagem.',
  how_it_works_vanity_html: '🎯 Gerador de Endereços Personalizados: Repete a geração de chaves até que um endereço comece com o prefixo desejado — uma demonstração divertida de esforço computacional!',
  how_it_works_pow_html: '⛏️ Prova de Trabalho: Calcula repetidamente o hash dos dados do bloco + nonce até encontrar um hash que comece com o número desejado de zeros à esquerda.',

  // lorem ipsum
  about_description1: 'Este playground educacional foi criado para ensinar desenvolvedores, estudantes e entusiastas de cripto como a criptografia de curvas elípticas garante a segurança da blockchain — especialmente a curva secp256k1, usada pelo Bitcoin e Ethereum.',
  about_description2: 'Se você está aprendendo, inspecione o código, ajuste os parâmetros e teste entradas inesperadas — é um ambiente seguro para experimentar os fundamentos da ECC. 🚀',

}
