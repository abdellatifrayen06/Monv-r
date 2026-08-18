import { FormEvent, useState } from 'react'
import { User, Mail, Phone, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '../api/client'
import { trackContact } from '../lib/metaPixel'
import { SEO } from '../components/SEO'

export function Contact() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSending(true)
    const form = new FormData(e.target as HTMLFormElement)
    try {
      await api('/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          phone: form.get('phone'),
          message: form.get('message'),
        }),
      })
      trackContact()
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Réessayez.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <SEO
        title="Contact"
        description="Contactez l'équipe MONVÉR pour toute question sur vos commandes, nos pièces en cuir, la livraison ou les retours. Une équipe à votre écoute."
        url="/contact"
      />
      {/* Hero */}
      <div className="bg-[#EFE9DF] border-b border-[#E1D8C8]">
        <div className="page-wrap py-12 md:py-16">
          <p className="eyebrow mb-3">Service client</p>
          <h1 className="font-display text-4xl md:text-5xl font-normal text-ink mb-3">Nous contacter</h1>
          <p className="text-gray-600 text-base max-w-lg">
            Une question sur une commande, le choix d’une pièce en cuir, la livraison ou un retour ?
            Notre équipe est à votre écoute.
          </p>
        </div>
      </div>

      <div className="page-wrap py-10">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Contact info */}
          <div>
            <h2 className="font-display font-semibold text-ink text-xl mb-6">Informations de contact</h2>
            <div className="space-y-4 mb-8">
              {[
                { icon: <Phone size={18} />, label: 'Téléphone', value: '+216 24 681 500', sub: 'Du lundi au samedi, 9h à 18h' },
                { icon: <Mail size={18} />, label: 'Email', value: 'monvercuir@gmail.com', sub: 'Réponse sous 24h' },
                { icon: <MessageSquare size={18} />, label: 'WhatsApp', value: '+216 24 681 500', sub: 'Messagerie instantanée' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-[#E1D8C8]">
                  <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm">{item.label}</p>
                    <p className="text-brand-600 font-semibold text-sm">{item.value}</p>
                    <p className="text-gray-400 text-xs">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div id="faq" className="bg-[#EFE9DF] rounded-lg border border-[#E1D8C8] p-6 scroll-mt-24">
              <h3 className="font-display text-xl font-normal text-ink mb-4">Questions fréquentes</h3>
              <div className="space-y-3">
                {[
                  { q: 'Comment entretenir mon produit en cuir ?', a: 'Essuyez avec un chiffon doux et sec, tenez à l’écart de l’humidité prolongée et rangez à l’abri de la lumière directe.' },
                  { q: 'Le cuir évolue-t-il avec le temps ?', a: 'Oui — le cuir se patine à l’usage et développe un caractère qui lui est propre au fil des mois.' },
                  { q: 'Comment choisir le bon portefeuille ou sac ?', a: 'Partez de votre usage quotidien : nombre de cartes, format à transporter, sobriété recherchée. Les dimensions sont indiquées sur chaque fiche produit.' },
                  { q: 'Quels sont les délais de livraison ?', a: '2 à 5 jours ouvrables selon votre gouvernorat, avec suivi de commande en ligne.' },
                  { q: 'Quelle est la politique de retour ?', a: 'Les échanges et retours sont possibles dans les 7 jours suivant la réception, l’article devant être intact et non utilisé.' },
                  { q: 'Livrez-vous partout en Tunisie ?', a: 'Oui, dans tous les gouvernorats, avec paiement à la livraison.' },
                ].map((faq) => (
                  <div key={faq.q} className="bg-white rounded-lg p-4">
                    <p className="font-semibold text-ink text-sm mb-1">{faq.q}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            {sent ? (
              <div className="text-center py-12 animate-scale-in">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={40} className="text-emerald-500" />
                </div>
                <h2 className="font-display font-semibold text-ink text-2xl mb-3">Message envoyé</h2>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="btn-ghost mt-6"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
                <h2 className="font-display font-semibold text-ink text-xl mb-6">Envoyer un message</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label className="input-label">Nom complet *</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input name="name" placeholder="Ahmed Ben Ali" required className="input pl-10" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="input-label">Email *</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input name="email" type="email" placeholder="email@exemple.com" required className="input pl-10" />
                      </div>
                    </div>
                    <div>
                      <label className="input-label">Téléphone</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input name="phone" type="tel" placeholder="+216 XX XXX XXX" className="input pl-10" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="input-label">Message *</label>
                    <textarea
                      name="message"
                      placeholder="Dites-nous comment nous pouvons vous aider..."
                      required
                      rows={5}
                      className="input resize-none"
                    />
                  </div>

                  {error && (
                    <div className="alert-error">
                      <AlertCircle size={15} />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary w-full justify-center py-3.5"
                  >
                    {sending ? (
                      <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Envoi...</>
                    ) : (
                      <><Send size={16} /> Envoyer le message</>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
