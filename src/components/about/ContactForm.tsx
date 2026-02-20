"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { TbSend } from "react-icons/tb"

const contactSchema = z.object({
    name: z.string().min(2, 'სახელი უნდა იყოს მინიმუმ 2 სიმბოლო'),
    email: z.string().email('გთხოვთ შეიყვანოთ სწორი ელფოსტა'),
    phone: z.string().optional(),
    service: z.string().optional(),
    message: z.string().min(10, 'შეტყობინება უნდა იყოს მინიმუმ 10 სიმბოლო'),
})
type ContactFormData = z.infer<typeof contactSchema>

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            service: "",
            message: "",
        },
    })

    const onSubmit = async (formData: ContactFormData) => {
        setIsSubmitting(true)

        const data = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || "",
            service: formData.service || "not-selected",
            message: formData.message,
            urgency: "medium",
            source: "about_page"
        }

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error('Failed to send message')
            }

            toast.success("შეტყობინება წარმატებით გაიგზავნა!")
            reset()
        } catch (error) {
            toast.error("შეცდომა გაგზავნისას. გთხოვთ სცადოთ მოგვიანებით.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-secondary/20"></div>
            <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-card border border-border/50 rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
                >
                    {/* Decoration */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">მოდი ვითანამშრომლოთ</h2>
                        <p className="text-muted-foreground">შეავსე ფორმა და მალე დაგიკავშირდები</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="about-name" className="text-sm font-medium">სახელი</label>
                                <Input
                                    id="about-name"
                                    {...register('name')}
                                    placeholder="თქვენი სახელი"
                                    className="bg-background/50"
                                    aria-invalid={!!errors.name}
                                    aria-describedby={errors.name ? 'about-name-error' : undefined}
                                />
                                {errors.name && (
                                    <p id="about-name-error" className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="about-email" className="text-sm font-medium">ელ. ფოსტა</label>
                                <Input
                                    id="about-email"
                                    type="email"
                                    {...register('email')}
                                    placeholder="example@mail.com"
                                    className="bg-background/50"
                                    aria-invalid={!!errors.email}
                                    aria-describedby={errors.email ? 'about-email-error' : undefined}
                                />
                                {errors.email && (
                                    <p id="about-email-error" className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="about-phone" className="text-sm font-medium">ტელეფონის ნომერი</label>
                            <Input
                                id="about-phone"
                                type="tel"
                                {...register('phone')}
                                placeholder="+995 555 00 00 00"
                                className="bg-background/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="about-service" className="text-sm font-medium">თემა</label>
                            <Controller
                                name="service"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger id="about-service" className="bg-background/50">
                                            <SelectValue placeholder="აირჩიეთ თემა" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="consulting">AI კონსულტაცია</SelectItem>
                                            <SelectItem value="training">ტრეინინგი / ვორქშოპი</SelectItem>
                                            <SelectItem value="collaboration">კოლაბორაცია</SelectItem>
                                            <SelectItem value="media">მედია / ინტერვიუ</SelectItem>
                                            <SelectItem value="other">სხვა</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="about-message" className="text-sm font-medium">შეტყობინება</label>
                            <Textarea
                                id="about-message"
                                {...register('message')}
                                placeholder="მოგვიყევით თქვენი იდეის ან პროექტის შესახებ..."
                                className="min-h-[120px] bg-background/50"
                                aria-invalid={!!errors.message}
                                aria-describedby={errors.message ? 'about-message-error' : undefined}
                            />
                            {errors.message && (
                                <p id="about-message-error" className="text-sm text-red-500">{errors.message.message}</p>
                            )}
                        </div>

                        <Button disabled={isSubmitting} type="submit" className="w-full text-lg h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                            {isSubmitting ? (
                                "იგზავნება..."
                            ) : (
                                <>
                                    <TbSend className="mr-2" />
                                    გაგზავნა
                                </>
                            )}
                        </Button>
                    </form>

                </motion.div>
            </div>
        </section>
    )
}
