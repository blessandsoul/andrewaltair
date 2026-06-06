import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TbArrowLeft, TbBrandChrome, TbInfoCircle } from "react-icons/tb"

export const metadata = {
    title: "პაროლის აღდგენა | Andrew Altair",
}

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background via-background to-primary/5">
            <div className="w-full max-w-md">
                <Card className="border-border/50 shadow-xl backdrop-blur-sm">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-2xl">პაროლის აღდგენა</CardTitle>
                        <CardDescription>ელფოსტით აღდგენა ამჟამად მიუწვდომელია</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-muted-foreground">
                            <TbInfoCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <p>
                                პაროლის ელფოსტით აღდგენა ჯერ არ არის ხელმისაწვდომი. გთხოვ, შეხვიდე{" "}
                                <strong className="text-foreground">Google-ით</strong> იმავე ელფოსტით — შენი ანგარიში
                                ავტომატურად დაუკავშირდება.
                            </p>
                        </div>

                        <a href="/api/auth/google" className="block w-full">
                            <Button variant="outline" className="w-full gap-2">
                                <TbBrandChrome className="w-4 h-4" />
                                Google-ით შესვლა
                            </Button>
                        </a>

                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <TbArrowLeft className="w-4 h-4" />
                            შესვლა
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
