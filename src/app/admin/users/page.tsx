"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    Shield,
    UserPlus,
    Trash2,
    Edit2,
    Check,
    X,
    Search,
    Clock,
    Activity,
    LogIn,
    LogOut,
    Key,
    Monitor,
    Smartphone
} from "lucide-react"

interface User {
    id: string
    name: string
    email: string
    role: "admin" | "editor" | "viewer"
    lastLogin: string
    status: "active" | "inactive"
}

interface ActivityLog {
    id: string
    user: string
    action: string
    target: string
    timestamp: string
    type: "create" | "update" | "delete" | "login" | "logout"
}

interface LoginHistory {
    id: string
    user: string
    ip: string
    device: string
    browser: string
    timestamp: string
    status: "success" | "failed"
}

const sampleUsers: User[] = [
    { id: "1", name: "Andrew Altair", email: "andrew@altair.ge", role: "admin", lastLogin: "2024-12-25 14:30", status: "active" },
    { id: "2", name: "Editor User", email: "editor@example.com", role: "editor", lastLogin: "2024-12-24 10:15", status: "active" },
    { id: "3", name: "Viewer User", email: "viewer@example.com", role: "viewer", lastLogin: "2024-12-20 08:00", status: "inactive" },
]

const sampleActivity: ActivityLog[] = [
    { id: "1", user: "Andrew Altair", action: "Updated", target: "პოსტი: ChatGPT Tips", timestamp: "5 წთ წინ", type: "update" },
    { id: "2", user: "Andrew Altair", action: "Created", target: "ვიდეო: AI Tutorial", timestamp: "1 სთ წინ", type: "create" },
    { id: "3", user: "Editor User", action: "Deleted", target: "კომენტარი #123", timestamp: "2 სთ წინ", type: "delete" },
    { id: "4", user: "Andrew Altair", action: "Login", target: "Admin Panel", timestamp: "3 სთ წინ", type: "login" },
    { id: "5", user: "Viewer User", action: "Logout", target: "Admin Panel", timestamp: "1 დღე წინ", type: "logout" },
]

const sampleLoginHistory: LoginHistory[] = [
    { id: "1", user: "Andrew Altair", ip: "192.168.1.1", device: "Desktop", browser: "Chrome 120", timestamp: "2024-12-25 14:30", status: "success" },
    { id: "2", user: "Andrew Altair", ip: "192.168.1.1", device: "Mobile", browser: "Safari", timestamp: "2024-12-24 10:15", status: "success" },
    { id: "3", user: "Unknown", ip: "45.67.89.12", device: "Desktop", browser: "Firefox", timestamp: "2024-12-23 22:45", status: "failed" },
]

const roleColors = {
    admin: "bg-red-500",
    editor: "bg-blue-500",
    viewer: "bg-gray-500"
}

const roleLabels = {
    admin: "ადმინი",
    editor: "ედიტორი",
    viewer: "მნახველი"
}

export default function UsersPage() {
    const [users, setUsers] = React.useState<User[]>(sampleUsers)
    const [activeTab, setActiveTab] = React.useState<"users" | "activity" | "logins">("users")
    const [searchQuery, setSearchQuery] = React.useState("")

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const changeRole = (userId: string, role: "admin" | "editor" | "viewer") => {
        setUsers(users.map(u => u.id === userId ? { ...u, role } : u))
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Users className="w-8 h-8 text-indigo-500" />
                        მომხმარებლები
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {users.length} მომხმარებელი
                    </p>
                </div>
                <Button className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    მომხმარებლის დამატება
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b">
                {[
                    { id: "users", label: "მომხმარებლები", icon: Users },
                    { id: "activity", label: "აქტივობა", icon: Activity },
                    { id: "logins", label: "შესვლების ისტორია", icon: Clock },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${activeTab === tab.id
                                ? "border-indigo-500 text-indigo-500"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Users Tab */}
            {activeTab === "users" && (
                <>
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="ძიება..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <table className="w-full">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-medium">მომხმარებელი</th>
                                        <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">როლი</th>
                                        <th className="text-left px-4 py-3 font-medium hidden md:table-cell">ბოლო შესვლა</th>
                                        <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">სტატუსი</th>
                                        <th className="text-right px-4 py-3 font-medium">მოქმედება</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-muted/30">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                        {user.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden sm:table-cell">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => changeRole(user.id, e.target.value as User["role"])}
                                                    className="bg-muted rounded px-2 py-1 text-sm"
                                                >
                                                    <option value="admin">ადმინი</option>
                                                    <option value="editor">ედიტორი</option>
                                                    <option value="viewer">მნახველი</option>
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-sm">
                                                {user.lastLogin}
                                            </td>
                                            <td className="px-4 py-3 hidden lg:table-cell">
                                                <Badge variant={user.status === "active" ? "default" : "secondary"}>
                                                    {user.status === "active" ? "აქტიური" : "არააქტიური"}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Key className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">აქტივობის ჟურნალი</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {sampleActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/30">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === "create" ? "bg-green-500/10 text-green-500" :
                                        activity.type === "update" ? "bg-blue-500/10 text-blue-500" :
                                            activity.type === "delete" ? "bg-red-500/10 text-red-500" :
                                                activity.type === "login" ? "bg-indigo-500/10 text-indigo-500" :
                                                    "bg-gray-500/10 text-gray-500"
                                    }`}>
                                    {activity.type === "login" ? <LogIn className="w-4 h-4" /> :
                                        activity.type === "logout" ? <LogOut className="w-4 h-4" /> :
                                            <Activity className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium">
                                        <span className="text-indigo-500">{activity.user}</span>{" "}
                                        {activity.action}{" "}
                                        <span className="text-muted-foreground">{activity.target}</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Logins Tab */}
            {activeTab === "logins" && (
                <Card>
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 font-medium">მომხმარებელი</th>
                                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">IP</th>
                                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">მოწყობილობა</th>
                                    <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">თარიღი</th>
                                    <th className="text-right px-4 py-3 font-medium">სტატუსი</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {sampleLoginHistory.map((login) => (
                                    <tr key={login.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-3 font-medium">{login.user}</td>
                                        <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                                            {login.ip}
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                {login.device === "Desktop" ? (
                                                    <Monitor className="w-4 h-4 text-muted-foreground" />
                                                ) : (
                                                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                                                )}
                                                <span className="text-sm">{login.browser}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-sm">
                                            {login.timestamp}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end">
                                                <Badge variant={login.status === "success" ? "default" : "destructive"}>
                                                    {login.status === "success" ? "წარმატებული" : "წარუმატებელი"}
                                                </Badge>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
