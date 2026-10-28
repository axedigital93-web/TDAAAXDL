// Utilitaire pour les redirections WhatsApp
export const WHATSAPP_PHONE = '237671715511';

/**
 * Ouvre WhatsApp avec un message pré-rempli
 * @param message - Le message à envoyer (sera encodé automatiquement)
 */
export const openWhatsApp = (message: string): void => {
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`, '_blank');
};

// Messages pré-définis
export const WHATSAPP_MESSAGES = {
  commander: 'Bonjour, je souhaite commander vos services. Pouvez-vous me fournir plus d\'informations ?',
  appel: 'Bonjour, je souhaite passer un appel pour discuter de vos services.',
  contact: 'Bonjour, je souhaite obtenir plus d\'informations sur vos services.',
  pack: (packName: string) => `Bonjour, je suis intéressé(e) par le pack ${packName}. Pouvez-vous me donner plus de détails ?`,
};
