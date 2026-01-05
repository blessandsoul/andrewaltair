export default function AdminLoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // This layout bypasses the main admin layout to show just the login page
    return <>{children}</>
}
