export default {
  // Global
  language: 'Português',
  welcome_title: '📚 Aprenda Criptografia de Curvas Elípticas',
  welcome_description: 'Esta ferramenta educacional interativa ajuda você a entender os fundamentos da criptografia moderna usada no Bitcoin, Ethereum e outras plataformas de blockchain. Você irá explorar geração de chaves, formatos de endereços, assinaturas de mensagens e mais — tudo baseado na curva secp256k1 usada pelo ECDSA (Elliptic Curve Digital Signature Algorithm).',
  how_it_works_title: '🧠 Como Funciona',
  about_title: '📘 Sobre Esta Ferramenta',

  // ecc-wallet module
  keygen_title: '🔑 Gerador de Chaves',
  keygen_description: 'Toda carteira blockchain começa aqui: uma chave privada aleatória (numero inteiro entre um e 2²⁵⁶ - 2³² - 977). Aprenda como ela gera uma chave pública única e como essas chaves são transformadas em endereços utilizados pelo Bitcoin e Ethereum.',
  keygen_generateBtn_label: 'Gerar Endereço',
  keygen_details: 'Detalhes do par de chaves',
  keygen_private_key: 'Chave Privada: ',
  keygen_public_key: 'Chave Pública (Não Compactada): ',
  keygen_addresses: 'Endereços (Bitcoin e Ethereum)',

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
}
