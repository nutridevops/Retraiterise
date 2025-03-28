"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  phone: z.string().min(10, { message: "Veuillez entrer un numéro de téléphone valide" }),
  message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères" }),
})

type FormValues = z.infer<typeof formSchema>

export function ContactFormSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Une erreur est survenue lors de l'envoi du message")
      }

      setIsSuccess(true)
      reset()
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="bg-[#0A291C] py-24">
      <div className="container mx-auto px-4">
        <h2 className="font-alta text-4xl sm:text-5xl md:text-6xl text-[#D4AF37] text-center mb-16">CONTACTEZ-NOUS</h2>

        <div className="max-w-3xl mx-auto">
          {isSuccess ? (
            <div className="bg-green-900 border border-[#D4AF37] text-[#D4AF37] p-5 rounded-md mb-6">
              <p className="text-lg">Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.</p>
            </div>
          ) : null}

          {error ? (
            <div className="bg-red-900 border border-red-500 text-white p-5 rounded-md mb-6">
              <p className="text-lg">{error}</p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <label htmlFor="name" className="block text-[#D4AF37] font-medium mb-2 text-lg">
                Nom complet
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className={`w-full px-5 py-4 bg-[#111] border rounded-none focus:outline-none focus:border-[#D4AF37] ${
                  errors.name ? "border-red-500" : "border-[#D4AF37]"
                } text-white text-lg`}
                placeholder="Votre nom"
              />
              {errors.name && <p className="mt-2 text-red-400 text-base">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="email" className="block text-[#D4AF37] font-medium mb-2 text-lg">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={`w-full px-5 py-4 bg-[#111] border rounded-none focus:outline-none focus:border-[#D4AF37] ${
                    errors.email ? "border-red-500" : "border-[#D4AF37]"
                  } text-white text-lg`}
                  placeholder="votre@email.com"
                />
                {errors.email && <p className="mt-2 text-red-400 text-base">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-[#D4AF37] font-medium mb-2 text-lg">
                  Téléphone (optionnel)
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  className={`w-full px-5 py-4 bg-[#111] border rounded-none focus:outline-none focus:border-[#D4AF37] ${
                    errors.phone ? "border-red-500" : "border-[#D4AF37]"
                  } text-white text-lg`}
                  placeholder="Votre numéro de téléphone"
                />
                {errors.phone && <p className="mt-2 text-red-400 text-base">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-[#D4AF37] font-medium mb-2 text-lg">
                Message
              </label>
              <textarea
                id="message"
                {...register("message")}
                rows={5}
                className={`w-full px-5 py-4 bg-[#111] border rounded-none focus:outline-none focus:border-[#D4AF37] ${
                  errors.message ? "border-red-500" : "border-[#D4AF37]"
                } text-white text-lg`}
                placeholder="Votre message..."
              ></textarea>
              {errors.message && <p className="mt-2 text-red-400 text-base">{errors.message.message}</p>}
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-block bg-[#D4AF37] text-[#0A291C] font-bold px-10 py-4 text-xl tracking-wide hover:bg-[#c29c3d] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-6 w-6 inline mr-2" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer"
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-12 text-center">
            <p className="text-[#D4AF37]/70 text-base">
              Pour toute question ou information supplémentaire, n'hésitez pas à nous contacter à{" "}
              <a href="mailto:info.neuroperformancetraining@gmail.com" className="text-[#D4AF37] hover:underline">
                info.neuroperformancetraining@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
