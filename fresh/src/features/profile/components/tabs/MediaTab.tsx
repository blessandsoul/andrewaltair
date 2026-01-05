/**
 * Media Tab - Avatar and cover image management
 */

"use client"

import * as React from "react"
import { TbPhoto as TbPhoto, TbUser, TbUpload, TbTrash } from "react-icons/tb"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

export function MediaTab() {
    const { user } = useAuth()
    const avatarInputRef = React.useRef<HTMLInputElement>(null)
    const coverInputRef = React.useRef<HTMLInputElement>(null)
    const [coverImage, setCoverImage] = React.useState<string | null>(null)

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setCoverImage(reader.result as string)
            reader.readAsDataURL(file)
            // TODO: Upload to server
        }
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // TODO: Upload to server with crop modal
            console.log("Avatar selected:", file)
        }
    }

    return (
        <Card className="border-border/50 shadow-xl backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TbPhoto className="w-5 h-5 text-primary" />
                    მედია პარამეტრები
                </CardTitle>
                <CardDescription>მართეთ თქვენი ავატარი და ფონი</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="p-4 rounded-lg border border-border">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                        <TbUser className="w-4 h-4" />
                        ავატარი
                    </h3>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent p-1">
                            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                                ) : (
                                    <TbUser className="w-12 h-12 text-muted-foreground" />
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Button onClick={() => avatarInputRef.current?.click()} className="gap-2">
                                <TbUpload className="w-4 h-4" />
                                ატვირთვა
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                რეკომენდებული: 400x400px, JPG ან PNG
                            </p>
                        </div>
                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>
                </div>

                {/* Cover Section */}
                <div className="p-4 rounded-lg border border-border">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                        <TbPhoto className="w-4 h-4" />
                        ფონის სურათი
                    </h3>
                    <div className="space-y-4">
                        <div className="aspect-[3/1] rounded-lg overflow-hidden bg-gradient-to-r from-primary via-accent to-primary">
                            {coverImage ? (
                                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/50">
                                    <TbPhoto className="w-12 h-12" />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => coverInputRef.current?.click()} className="gap-2">
                                <TbUpload className="w-4 h-4" />
                                ატვირთვა
                            </Button>
                            {coverImage && (
                                <Button
                                    variant="outline"
                                    className="gap-2 text-destructive hover:text-destructive"
                                    onClick={() => setCoverImage(null)}
                                >
                                    <TbTrash className="w-4 h-4" />
                                    წაშლა
                                </Button>
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            რეკომენდებული: 1500x500px, JPG ან PNG
                        </p>
                        <input
                            ref={coverInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleCoverChange}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
