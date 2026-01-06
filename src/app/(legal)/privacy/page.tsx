import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TbArrowLeft, TbShield, TbLock, TbFileText, TbEye, TbDatabase, TbServer, TbCookie } from "react-icons/tb"

export const metadata: Metadata = {
    title: 'კონფიდენციალურობის პოლიტიკა | Andrew Altair',
    description: 'Andrew Altair-ის კონფიდენციალურობის პოლიტიკა და მომხმარებლის მონაცემების დაცვის პირობები.',
}

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
                <div className="absolute inset-0 noise-overlay"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="container relative mx-auto px-4 py-16 sm:py-24 max-w-4xl">
                {/* Back Button */}
                <div className="mb-8">
                    <Button variant="ghost" className="pl-0 hover:pl-2 transition-all" asChild>
                        <Link href="/">
                            <TbArrowLeft className="w-4 h-4 mr-2" />
                            მთავარზე დაბრუნება
                        </Link>
                    </Button>
                </div>

                {/* Header Section */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
                        <TbShield className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                        <span className="text-gradient">კონფიდენციალურობის პოლიტიკა</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <span>ბოლო განახლება:</span>
                        <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                            {new Date().toLocaleDateString('ka-GE')}
                        </Badge>
                    </div>
                </div>

                {/* Main Content Card */}
                <Card className="glass-strong border-primary/10 overflow-hidden">
                    <CardContent className="p-8 sm:p-12">
                        <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground">
                            <p className="lead text-xl text-muted-foreground leading-relaxed">
                                Andrew Altair-ის ვებგვერდზე ("andrewaltair.ge") თქვენი მონაცემების
                                კონფიდენციალურობა ჩვენთვის უმნიშვნელოვანესია. ეს პოლიტიკა განმარტავს,
                                თუ რა ინფორმაციას ვაგროვებთ და როგორ ვიყენებთ მას.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-6 my-12 not-prose">
                                <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50">
                                    <TbLock className="w-8 h-8 text-primary mb-4" />
                                    <h3 className="text-lg font-bold mb-2">უსაფრთხოება</h3>
                                    <p className="text-muted-foreground text-sm">თქვენი მონაცემები დაცულია თანამედროვე ენკრიფციის სტანდარტებით.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50">
                                    <TbEye className="w-8 h-8 text-primary mb-4" />
                                    <h3 className="text-lg font-bold mb-2">გამჭვირვალობა</h3>
                                    <p className="text-muted-foreground text-sm">ჩვენ ღიად ვაცხადებთ თუ როგორ ვიყენებთ თქვენს ინფორმაციას.</p>
                                </div>
                            </div>

                            <h2>1. რა ინფორმაციას ვაგროვებთ</h2>

                            <h3>პირადი ინფორმაცია</h3>
                            <p>ჩვენ შესაძლოა მოვაგროვოთ შემდეგი ინფორმაცია:</p>
                            <ul>
                                <li><strong>ელ. ფოსტა</strong> - რეგისტრაციის და საინფორმაციო ბიულეტენისთვის</li>
                                <li><strong>სახელი</strong> - თქვენი იდენტიფიკაციისთვის</li>
                                <li><strong>IP მისამართი</strong> - უსაფრთხოებისა და ანალიტიკისთვის</li>
                            </ul>

                            <h3>ტექნიკური ინფორმაცია</h3>
                            <p>ავტომატურად გროვდება:</p>
                            <ul>
                                <li>ბრაუზერის ტიპი და ვერსია</li>
                                <li>მოწყობილობის ტიპი</li>
                                <li>გვერდების ნახვის ისტორია</li>
                                <li>რეფერალის წყაროები</li>
                            </ul>

                            <hr className="my-8 border-border" />

                            <div className="flex items-center gap-3 mb-6 not-prose">
                                <TbCookie className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold m-0">2. Cookies (ქუქი-ფაილები)</h2>
                            </div>
                            <p>
                                ჩვენ ვიყენებთ cookies-ს ვებგვერდის ფუნქციონალისთვის და ანალიტიკისთვის:
                            </p>
                            <ul>
                                <li><strong>აუცილებელი Cookies</strong> - სესიის მართვა, თემის პარამეტრები</li>
                                <li><strong>ანალიტიკური Cookies</strong> - Google Analytics (თქვენი თანხმობით)</li>
                            </ul>
                            <p>
                                თქვენ შეგიძლიათ უარი თქვათ cookies-ზე თქვენი ბრაუზერის პარამეტრებიდან,
                                თუმცა ამან შესაძლოა გავლენა მოახდინოს ვებგვერდის ფუნქციონალზე.
                            </p>

                            <hr className="my-8 border-border" />

                            <h2>3. როგორ ვიყენებთ თქვენს მონაცემებს</h2>
                            <ul>
                                <li>ანგარიშის მართვა და ავთენტიფიკაცია</li>
                                <li>საინფორმაციო ბიულეტენის გაგზავნა (თქვენი თანხმობით)</li>
                                <li>სერვისების გაუმჯობესება და ანალიტიკა</li>
                                <li>უსაფრთხოების უზრუნველყოფა</li>
                                <li>კანონმდებლობის მოთხოვნების დაცვა</li>
                            </ul>

                            <hr className="my-8 border-border" />

                            <h2>4. მონაცემთა გაზიარება</h2>
                            <p>
                                ჩვენ <strong>არ ვყიდით</strong> თქვენს პირად მონაცემებს მესამე მხარეებზე.
                                მონაცემები შესაძლოა გაზიარდეს:
                            </p>
                            <ul>
                                <li>სერვის-პროვაიდერებთან (MongoDB Atlas, Vercel)</li>
                                <li>ანალიტიკური სერვისებთან (Google Analytics)</li>
                                <li>სამართალდამცავ ორგანოებთან (კანონით გათვალისწინებულ შემთხვევებში)</li>
                            </ul>

                            <hr className="my-8 border-border" />

                            <div className="flex items-center gap-3 mb-6 not-prose">
                                <TbServer className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold m-0">5. მონაცემთა დაცვა</h2>
                            </div>
                            <p>
                                ჩვენ ვიყენებთ ინდუსტრიულ სტანდარტებს მონაცემების დასაცავად:
                            </p>
                            <ul>
                                <li>HTTPS ენკრიფცია</li>
                                <li>პაროლების ჰეშირება (bcrypt)</li>
                                <li>უსაფრთხო სერვერული ინფრასტრუქტურა</li>
                                <li>რეგულარული აუდიტები</li>
                            </ul>

                            <hr className="my-8 border-border" />

                            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 not-prose">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <TbFileText className="w-5 h-5 text-primary" />
                                    6. თქვენი უფლებები (GDPR)
                                </h2>
                                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                                    <li>მოითხოვოთ თქვენი მონაცემების ასლი</li>
                                    <li>მოითხოვოთ მონაცემების შესწორება</li>
                                    <li>მოითხოვოთ მონაცემების წაშლა</li>
                                    <li>გააუქმოთ თანხმობა მარკეტინგულ კომუნიკაციაზე</li>
                                </ul>
                            </div>

                            <div className="my-8"></div>

                            <h2>7. მონაცემთა შენახვა</h2>
                            <p>
                                ჩვენ ვინახავთ თქვენს მონაცემებს იმდენ ხანს, რამდენადაც საჭიროა
                                სერვისების მიწოდებისთვის და კანონმდებლობის დაცვისთვის.
                            </p>

                            <h2>8. ბავშვთა კონფიდენციალურობა</h2>
                            <p>
                                ჩვენი სერვისები არ არის განკუთვნილი 16 წლამდე პირებისთვის.
                                ჩვენ შეგნებულად არ ვაგროვებთ არასრულწლოვანთა მონაცემებს.
                            </p>

                            <h2>9. ცვლილებები პოლიტიკაში</h2>
                            <p>
                                ჩვენ შესაძლოა პერიოდულად განვაახლოთ ეს პოლიტიკა.
                                მნიშვნელოვანი ცვლილებების შემთხვევაში, შეგატყობინებთ ვებგვერდზე ან ელ. ფოსტით.
                            </p>

                            <hr className="my-8 border-border" />

                            <h2>10. კონტაქტი</h2>
                            <p>
                                კონფიდენციალურობასთან დაკავშირებული კითხვებისთვის დაგვიკავშირდით:
                            </p>
                            <ul>
                                <li>ელ. ფოსტა: <a href="mailto:andrewaltair@icloud.com">andrewaltair@icloud.com</a> / <a href="mailto:andr3waltair@gmail.com">andr3waltair@gmail.com</a></li>
                                <li>Telegram: <a href="https://t.me/andr3waltairchannel">@andr3waltairchannel</a></li>
                            </ul>
                        </article>
                    </CardContent>
                </Card>

                <div className="text-center mt-8">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Andrew Altair. ყველა უფლება დაცულია.
                    </p>
                </div>
            </div>
        </div>
    )
}
