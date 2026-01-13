"use client"

import { useState } from "react"
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

export function ContactForm() {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setLoading(false)
        toast.success("შეტყობინება გაიგზავნა წარმატებით!")
    }

    return (
        <section className="py-20 relative overflow-hidden">
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">სახელი</label>
                                <Input required placeholder="თქვენი სახელი" className="bg-background/50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">ელ. ფოსტა</label>
                                <Input required type="email" placeholder="example@mail.com" className="bg-background/50" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">თემა</label>
                            <Select>
                                <SelectTrigger className="bg-background/50">
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
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">შეტყობინება</label>
                            <Textarea required placeholder="მოგვიყევით თქვენი იდეის ან პროექტის შესახებ..." className="min-h-[120px] bg-background/50" />
                        </div>

                        <Button disabled={loading} type="submit" className="w-full text-lg h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
                            {loading ? (
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
