import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Contact | Dilara's Finesse",
}

const fieldClass =
  'w-full border border-brand-border bg-brand-white px-4 py-3 text-sm text-brand-charcoal outline-none focus:border-brand-charcoal'
const labelClass = 'mb-2 block text-[11px] font-medium uppercase tracking-brand'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-brand-white px-5 py-16 font-storefront text-brand-charcoal sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[760px]">
        <h1 className="font-editorial text-[39px] font-normal sm:text-[53px]">
          Get in touch with us
        </h1>
        <p className="mt-5 text-sm leading-[1.9] text-brand-muted">
          We value your input! Whether you have questions, feedback, or concerns,
          feel free to reach out to us by filling out the form below. Don&apos;t
          forget to include your name and email address so we can get back to you.
        </p>

        <form className="mt-10">
          <fieldset disabled className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="first-name" className={labelClass}>First name *</label>
                <input id="first-name" name="firstName" autoComplete="given-name" required className={fieldClass} />
              </div>
              <div>
                <label htmlFor="last-name" className={labelClass}>Last name *</label>
                <input id="last-name" name="lastName" autoComplete="family-name" required className={fieldClass} />
              </div>
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>Email *</label>
              <input id="email" name="email" type="email" autoComplete="email" required className={fieldClass} />
            </div>
            <div>
              <label htmlFor="message" className={labelClass}>Message *</label>
              <textarea id="message" name="message" placeholder="Type your message here..." required rows={6} className={fieldClass} />
            </div>
            <p id="contact-unavailable" className="text-sm leading-relaxed text-brand-muted">
              Contact form submission is not available yet. Please email us instead.
            </p>
            <button type="submit" disabled aria-describedby="contact-unavailable" className="bg-brand-charcoal px-8 py-3 text-[11px] font-medium uppercase tracking-brand text-brand-white opacity-50">
              Submit
            </button>
          </fieldset>
        </form>

        <div className="mt-12 space-y-2 border-t border-brand-border pt-7 text-sm leading-relaxed text-brand-muted">
          <p>
            For press inquiries, please send an email to{' '}
            <a href="mailto:dilarafinesse@gmail.com" className="underline hover:text-brand-charcoal">dilarafinesse@gmail.com</a>.
          </p>
          <p>
            For wholesale inquiries, please send an email to{' '}
            <a href="mailto:dilarafinesse@gmail.com" className="underline hover:text-brand-charcoal">dilarafinesse@gmail.com</a>.
          </p>
        </div>
      </div>
    </main>
  )
}
