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
    <section id="contact" className="bg-[#f5f2ea] py-24">
      <div className="container mx-auto px-4">
        <h2 className="font-alta text-4xl sm:text-5xl md:text-6xl text-[#0A291C] text-center mb-16">CONTACTEZ-NOUS</h2>

        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
          {isSuccess ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-6">
              <p>Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.</p>
            </div>
          ) : null}

          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
              <p>{error}</p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-[#0A291C] font-medium mb-1">
                Nom complet
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Votre nom"
              />
              {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-[#0A291C] font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="votre@email.com"
              />
              {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-[#0A291C] font-medium mb-1">
                Téléphone
              </label>
              <input
                id="phone"
                type="tel"
                {...register("phone")}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Votre numéro de téléphone"
              />
              {errors.phone && <p className="mt-1 text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-[#0A291C] font-medium mb-1">
                Message
              </label>
              <textarea
                id="message"
                {...register("message")}
                rows={5}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                  errors.message ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Votre message..."
              ></textarea>
              {errors.message && <p className="mt-1 text-red-500 text-sm">{errors.message.message}</p>}
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-block bg-[#0A291C] text-white px-8 py-4 rounded-md text-lg tracking-wide hover:bg-[#0A291C]/80 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 inline mr-2" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer le message"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
