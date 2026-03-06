import React, { useState } from "react";
import { Vortex } from "./ui/vortex";

interface VortexSectionProps {
  lang: 'en' | 'it';
}

function VortexSection({ lang }: VortexSectionProps) {
  const [isShowroomModalOpen, setIsShowroomModalOpen] = useState(false);
  const footerData = {
    en: {
      company: "Gemma Europa B.V.",
      rights: "All rights reserved",
      address: "Schupstraat 18-20, 2018 Antwerpen, Belgium",
      companyNo: "Company No. (KBO): BE 0656.953.680",
      email: "sales@gemmaeuropa.com",
      showroom: {
        address: "Via Borgonuovo, 10, 20121 Milano MI, Italia",
        phone: "+39 02 2318 5211"
      },
      links: {
        home: "Home",
        collections: "Collections",
        about: "About",
        showroom: "Showroom Milan",
        faq: "FAQ"
      },
      social: {
        instagram: "Instagram",
        facebook: "Facebook",
        pinterest: "Pinterest"
      }
    },
    it: {
      company: "Gemma Europa B.V.",
      rights: "Tutti i diritti riservati",
      address: "Schupstraat 18-20, 2018 Anversa, Belgio",
      companyNo: "Numero d'azienda (KBO): BE 0656.953.680",
      email: "sales@gemmaeuropa.com",
      showroom: {
        address: "Via Borgonuovo, 10, 20121 Milano MI, Italia",
        phone: "+39 02 2318 5211"
      },
      links: {
        home: "Home",
        collections: "Collezioni",
        about: "Chi Siamo",
        showroom: "Showroom Milano",
        faq: "FAQ"
      },
      social: {
        instagram: "Instagram",
        facebook: "Facebook",
        pinterest: "Pinterest"
      }
    }
  };
  const data = footerData[lang];

  return (
    // MODIFICA 1: Altezza diventa flessibile su mobile, fissa su desktop
    <div className="w-full rounded-md h-auto md:h-[18rem] overflow-hidden">
      <Vortex
        backgroundColor="black"
        // MODIFICA 2: Più padding verticale su mobile
        className="flex items-center flex-col justify-center px-4 py-12 md:px-2 md:py-4 w-full h-full"
        rangeY={150} particleCount={100} baseHue={240}
      >
        <div className="max-w-7xl mx-auto px-4 w-full">
          {/* MODIFICA 3: Layout a 1 colonna su mobile, 2 su tablet, 4 su desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
            
            {/* Blocco 1: Info Showroom */}
            <div className="sm:col-span-1">
              <h2 className="font-bodoni text-lg font-bold text-white mb-3">Showroom</h2>
              <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setIsShowroomModalOpen(true)}
                    className="text-gray-300 text-sm underline-offset-2 hover:underline text-left"
                  >
                    {data.showroom.address}
                  </button>
                  <p className="text-gray-300 text-sm font-medium">
                      <a href={`tel:${data.showroom.phone}`} className="hover:text-white transition-colors underline">{data.showroom.phone}</a>
                  </p>
              </div>
            </div>

            {/* Blocco 2: Navigazione */}
            <div className="sm:col-span-1">
              <h3 className="font-bodoni text-lg font-bold text-white mb-3">Navigation</h3>
              <ul className="space-y-2">
                <li><a href={lang === 'en' ? '/en/collections' : '/it/collezioni'} className="text-gray-300 hover:text-white transition-colors text-sm">{data.links.collections}</a></li>
                <li><a href={lang === 'en' ? '/en/#about' : '/it/#chi-siamo'} className="text-gray-300 hover:text-white transition-colors text-sm">{data.links.about}</a></li>
                <li><a href={lang === 'en' ? '/en/showroom-milan' : '/it/showroom-milano'} className="text-gray-300 hover:text-white transition-colors text-sm">{data.links.showroom}</a></li>
                <li><a href={lang === 'en' ? '/en/faq' : '/it/faq'} className="text-gray-300 hover:text-white transition-colors text-sm">{data.links.faq}</a></li>
              </ul>
            </div>

            {/* Blocco 3: Social */}
            <div className="sm:col-span-1">
              <h3 className="font-bodoni text-lg font-bold text-white mb-3">
                {lang === 'en' ? "Follow Us" : "Seguici"}
              </h3>
              <div className="flex justify-center sm:justify-start space-x-4">
                <a href="https://www.instagram.com/porratigioielli/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                {/* Facebook button hidden as requested */}
                {/* 
                <a href="https://www.facebook.com/porratijewelry/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                */}
              </div>
            </div>

            {/* Blocco 4: Info Aziendali */}
            <div className="sm:col-span-1 border-t border-gray-700 sm:border-none pt-8 sm:pt-0">
               <h2 className="font-bodoni text-lg font-bold text-white mb-3">{data.company}</h2>
               <p className="text-gray-400 text-xs">{data.address}</p>
               <p className="text-gray-500 text-xs mt-2">{data.companyNo}</p>
               <p className="text-gray-500 text-xs mt-4">
                  &copy; {new Date().getFullYear()} {data.company}. {data.rights}.
              </p>
            </div>

          </div>
        </div>

        {isShowroomModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-nero-assoluto rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl border border-grigio-antracite/40">
              <h3 className="font-bodoni text-xl text-bianco-sporco mb-3">
                {lang === 'en' ? 'Showroom Milan' : 'Showroom Milano'}
              </h3>
              <p className="text-greige-chiaro text-sm mb-4">
                {lang === 'en'
                  ? 'Choose how you want to open the showroom location.'
                  : 'Scegli come aprire la posizione dello showroom.'}
              </p>
              <div className="space-y-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Via+Borgonuovo,+10,+20121+Milano+MI,+Italy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-2 rounded-full bg-bianco-sporco text-nero-assoluto text-sm font-medium hover:bg-white transition-colors"
                >
                  {lang === 'en' ? 'Open in Google Maps' : 'Apri in Google Maps'}
                </a>
                <a
                  href={lang === 'en' ? '/en/showroom-milan' : '/it/showroom-milano'}
                  className="block w-full text-center px-4 py-2 rounded-full border border-bianco-sporco text-bianco-sporco text-sm font-medium hover:bg-bianco-sporco hover:text-nero-assoluto transition-colors"
                >
                  {lang === 'en' ? 'Open showroom page' : 'Apri pagina showroom'}
                </a>
              </div>
              <button
                type="button"
                onClick={() => setIsShowroomModalOpen(false)}
                className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-200"
              >
                {lang === 'en' ? 'Close' : 'Chiudi'}
              </button>
            </div>
          </div>
        )}

      </Vortex>
    </div>
  );
}

export default VortexSection;