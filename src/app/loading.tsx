import { TbSparkles } from 'react-icons/tb'

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-4">
                {/* Animated Logo */}
                <div className="relative inline-block">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-xl opacity-50 animate-pulse" />

                    {/* Logo Container */}
                    <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center animate-pulse">
                        <TbSparkles className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Loading Text */}
                <div className="space-y-2">
                    <p className="text-lg font-medium text-foreground">
                        იტვირთება...
                    </p>

                    {/* Loading Bar */}
                    <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden mx-auto">
                        <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-loading-bar" />
                    </div>
                </div>
            </div>
        </div>
    )
}
