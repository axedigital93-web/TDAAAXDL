import React from 'react';
import { Instagram, Linkedin, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import AppImage from '../image/AppImage';

const Footer: React.FC = () => {
  return (
    <footer id="nous-contacter" className="bg-gray-900 text-white pt-12 md:pt-20 pb-10">
      <div className="container mx-auto max-w-7xl px-6 md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 mb-12 md:mb-16">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start">
            <div className="mb-6">
                <img src={AppImage.logoAxeDigitalWhite} alt="Axe Digital" className="h-16 md:h-20 w-auto" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 text-center md:text-left">
              Cabinet de consulting IA & Solutions numériques adaptées aux entreprises africaines.
            </p>
            <div className="flex gap-3 md:gap-4">
              {/* <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-blue transition-colors">
                <Instagram size={18} />
              </a> */}
              <a href="https://www.linkedin.com/company/axe-digital-community/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-blue transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="https://www.facebook.com/share/17iATtAdNC/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-blue transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://wa.me/237671715511" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-blue transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-blue transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.18 1.12 1.24 2.69 1.95 4.3 2.02v3.76c-1.66-.03-3.27-.51-4.66-1.43-.16-.1-.3-.21-.45-.33v6.52c-.04 2.11-.8 4.16-2.21 5.67-1.57 1.76-3.88 2.78-6.27 2.79-2.31 0-4.52-.94-6.07-2.61C1.09 18.73.2 16.39.27 13.98c-.08-2.35.77-4.68 2.37-6.39C4.24 5.86 6.5 4.9 8.8 4.9c.39 0 .78.03 1.17.09v3.83c-.39-.09-.78-.13-1.18-.12-1.39-.02-2.73.57-3.64 1.63-.93 1.07-1.38 2.51-1.25 3.93.1 1.34.82 2.55 1.93 3.28.98.66 2.16.89 3.3.64 1.16-.27 2.16-1.07 2.69-2.12.27-.55.4-1.16.39-1.78V.02z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Entreprise */}
          <div className="text-center md:text-left">
            <h4 className="font-bold text-lg mb-6">Entreprise</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#nos-realisations" className="hover:text-brand-blue transition-colors">Nos réalisations</a></li>
              <li><a href="#solutions-ia" className="hover:text-brand-blue transition-colors">Nos solutions</a></li>
              <li><a href="#axe-stacks" className="hover:text-brand-blue transition-colors">Axe Stack</a></li>
              <li><a href="#nos-formules" className="hover:text-brand-blue transition-colors">Nos formules</a></li>
              <li><a href="#ils-nous-font-confiance" className="hover:text-brand-blue transition-colors">Ils nous font confiance</a></li>
              <li><a href="#nous-contacter" className="hover:text-brand-blue transition-colors">Nous contacter</a></li>
            </ul>
          </div>

          {/* Légal */}
          <div className="text-center md:text-left">
            <h4 className="font-bold text-lg mb-6">Informations légales</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#mentions-legales" className="hover:text-brand-blue transition-colors">Mentions légales</a></li>
              <li><a href="#politique-confidentialite" className="hover:text-brand-blue transition-colors">Politique de confidentialité</a></li>
              <li><a href="#conditions-generales" className="hover:text-brand-blue transition-colors">Conditions générales</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="font-bold text-lg mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <MapPin className="flex-shrink-0 text-brand-blue" size={18} />
                <span>Ange Raphael, fin barrière ESSEC</span>
              </li>
              <li className="flex items-center gap-x-3 justify-center md:justify-start">
                <Mail className="flex-shrink-0 text-brand-blue" size={19} />
                <a href="mailto:contact@axedigital.agency" className="hover:text-white break-all">contact@axedigital.agency</a>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Phone className="flex-shrink-0 text-brand-blue" size={18} />
                <span>(+237) 656523837</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-gray-500 text-sm">
            © 2026 Axe Digital. Tous droits réservés.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm text-gray-500">
            <a href="#mentions-legales" className="hover:text-white transition-colors">Mentions Légales</a>
            <a href="#politique-confidentialite" className="hover:text-white transition-colors">Politique de Confidentialité</a>
            <a href="#conditions-generales" className="hover:text-white transition-colors">Conditions Générales</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;