"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TbUsers, TbShield, TbUserPlus, TbTrash, TbEdit, TbCheck, TbX, TbSearch, TbClock, TbActivity, TbLogin, TbLogout, TbKey, TbDeviceDesktop, TbDeviceMobile, TbMail, TbLock, TbUser, TbEye, TbEyeOff, TbChevronUp, TbChevronDown, TbChevronLeft, TbChevronRight, TbDownload, TbBan, TbLockOpen, TbShieldCheck, TbShieldOff, TbDots, TbPower } from "react-icons/tb"

interface UserType {
    id: string
    name: string
    email: string
    avatar?: string
    role: "admin" | "editor" | "viewer"
    lastLogin: string
    status: "active" | "inactive" | "blocked"
    registeredAt: string
    sessions: number
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

const sampleUsers: UserType[] = [
    { id: "1", name: "Andrew Altair", email: "andrew@altair.ge", role: "admin", lastLogin: "2024-12-25 14:30", status: "active", registeredAt: "2024-01-15", sessions: 3 },
    { id: "2", name: "Editor User", email: "editor@example.com", role: "editor", lastLogin: "2024-12-24 10:15", status: "active", registeredAt: "2024-03-20", sessions: 1 },
    { id: "3", name: "Viewer User", email: "viewer@example.com", role: "viewer", lastLogin: "2024-12-20 08:00", status: "inactive", registeredAt: "2024-06-10", sessions: 0 },
    { id: "4", name: "Test Admin", email: "test@admin.com", role: "admin", lastLogin: "2024-12-23 12:00", status: "active", registeredAt: "2024-02-01", sessions: 2 },
    { id: "5", name: "Blocked User", email: "blocked@example.com", role: "viewer", lastLogin: "2024-12-15 09:00", status: "blocked", registeredAt: "2024-04-05", sessions: 0 },
]

const sampleActivity: ActivityLog[] = [
    { id: "1", user: "Andrew Altair", action: "Updated", target: "პოსტი: ChatGPT Tips", timestamp: "5 წთ წინ", type: "update" },
    { id: "2", user: "Andrew Altair", action: "Created", target: "ვიდეო: AI Tutorial", timestamp: "1 სთ წინ", type: "create" },
    { id: "3", user: "Editor User", action: "Deleted", target: "კომენტარი #123", timestamp: "2 სთ წინ", type: "delete" },
    { id: "4", user: "Andrew Altair", action: "Login", target: "Admin Panel", timestamp: "3 სთ წინ", type: "login" },
    { id: "5", user: "Viewer User", action: "Logout", target: "Admin Panel", timestamp: "1 დღე წინ", type: "logout" },
]

const sampleLoginHistory: LoginHistory[] = [
    { id: "1", user: "Andrew Altair", ip: "192.168.1.1", device: "Desktop", browser: "TbBrandChrome 120", timestamp: "2024-12-25 14:30", status: "success" },
    { id: "2", user: "Andrew Altair", ip: "192.168.1.1", device: "Mobile", browser: "Safari", timestamp: "2024-12-24 10:15", status: "success" },
    { id: "3", user: "Unknown", ip: "45.67.89.12", device: "Desktop", browser: "Firefox", timestamp: "2024-12-23 22:45", status: "failed" },
]

type SortField = "name" | "role" | "lastLogin" | "status"
type SortDirection = "asc" | "desc"

export default function UsersPage() {
    const [users, setUsers] = React.useState<UserType[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [activeTab, setActiveTab] = React.useState<"users" | "activity" | "logins">("users")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [showAddModal, setShowAddModal] = React.useState(false)
    const [showEditModal, setShowEditModal] = React.useState(false)
    const [showProfileModal, setShowProfileModal] = React.useState(false)
    const [selectedUser, setSelectedUser] = React.useState<UserType | null>(null)

    // Get auth token from localStorage
    const getAuthToken = () => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user')
            if (user) {
                try {
                    return JSON.parse(user).token
                } catch {
                    return null
                }
            }
        }
        return null
    }

    // Fetch users from MongoDB API
    React.useEffect(() => {
        async function fetchUsers() {
            const token = getAuthToken()

            // Allow fetching even without token (using Admin Session Cookie)
            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            try {
                const res = await fetch(`/api/users?limit=20`, {
                    headers,
                    credentials: 'include' // 🍪 Ensure cookies are sent!
                })

                if (res.ok) {
                    const data = await res.json()
                    const formattedUsers = (data.users || []).map((u: { id?: string; username?: string; email?: string; role?: string; lastLogin?: string; status?: string; twoFA?: boolean; createdAt?: string; sessions?: number; fullName?: string; avatar?: string }) => ({
                        id: u.id,
                        name: u.fullName || u.username || 'Unknown',
                        email: u.email || '',
                        avatar: u.avatar,
                        role: u.role || 'viewer',
                        lastLogin: u.lastLogin ? new Date(u.lastLogin).toLocaleString('ka-GE') : 'არასდროს',
                        status: u.status || 'active',
                        registeredAt: u.createdAt?.split('T')[0] || '',
                        sessions: u.sessions || 0
                    }))
                    setUsers(formattedUsers)
                } else {
                    console.error('Failed to fetch users:', res.status, res.statusText)
                    // Optional: Show a toast or error state here
                }
            } catch (error) {
                console.error('Error fetching users:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUsers()
    }, [])

    // Bulk selection
    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

    // Filters
    const [roleFilter, setRoleFilter] = React.useState<string>("all")
    const [statusFilter, setStatusFilter] = React.useState<string>("all")

    // Sorting
    const [sortField, setSortField] = React.useState<SortField>("name")
    const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc")

    // Pagination
    const [currentPage, setCurrentPage] = React.useState(1)
    const [itemsPerPage, setItemsPerPage] = React.useState(20)

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = roleFilter === "all" || user.role === roleFilter
        const matchesStatus = statusFilter === "all" || user.status === statusFilter
        return matchesSearch && matchesRole && matchesStatus
    })

    // Sort users
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        let comparison = 0
        switch (sortField) {
            case "name":
                comparison = a.name.localeCompare(b.name)
                break
            case "role":
                comparison = a.role.localeCompare(b.role)
                break
            case "lastLogin":
                comparison = a.lastLogin.localeCompare(b.lastLogin)
                break
            case "status":
                comparison = a.status.localeCompare(b.status)
                break
        }
        return sortDirection === "asc" ? comparison : -comparison
    })

    // Paginate users
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
    const paginatedUsers = sortedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const toggleSelectAll = () => {
        if (selectedIds.size === paginatedUsers.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(paginatedUsers.map(u => u.id)))
        }
    }

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds)
        if (newSet.has(id)) {
            newSet.delete(id)
        } else {
            newSet.add(id)
        }
        setSelectedIds(newSet)
    }

    const bulkDelete = async () => {
        if (confirm(`წაშალოთ ${selectedIds.size} მომხმარებელი?`)) {
            const token = getAuthToken()
            try {
                await Promise.all(Array.from(selectedIds).map(id =>
                    fetch(`/api/users/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ))
                setUsers(users.filter(u => !selectedIds.has(u.id)))
                setSelectedIds(new Set())
            } catch (error) {
                console.error('Bulk delete error:', error)
                alert('შეცდომა წაშლისას')
            }
        }
    }

    const bulkChangeRole = async (role: UserType["role"]) => {
        const token = getAuthToken()
        try {
            await Promise.all(Array.from(selectedIds).map(id =>
                fetch(`/api/users/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ role })
                })
            ))
            setUsers(users.map(u => selectedIds.has(u.id) ? { ...u, role } : u))
            setSelectedIds(new Set())
        } catch (error) {
            console.error('Bulk change role error:', error)
        }
    }

    const bulkBlock = async () => {
        const token = getAuthToken()
        try {
            await Promise.all(Array.from(selectedIds).map(id =>
                fetch(`/api/users/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: 'blocked' })
                })
            ))
            setUsers(users.map(u => selectedIds.has(u.id) ? { ...u, status: "blocked" } : u))
            setSelectedIds(new Set())
        } catch (error) {
            console.error('Bulk block error:', error)
        }
    }

    const changeRole = async (userId: string, role: "admin" | "editor" | "viewer") => {
        const token = getAuthToken()
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role })
            })
            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, role } : u))
            }
        } catch (error) {
            console.error('Change role error:', error)
        }
    }

    const addUser = async (newUser: Omit<UserType, "id" | "lastLogin" | "status" | "twoFA" | "registeredAt" | "sessions">) => {
        const token = getAuthToken()
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: newUser.email.split('@')[0],
                    email: newUser.email,
                    fullName: newUser.name,
                    role: newUser.role,
                    password: 'temp123456' // Temporary password
                })
            })
            if (res.ok) {
                const data = await res.json()
                const user: UserType = {
                    ...newUser,
                    id: data.user.id,
                    lastLogin: "არასდროს",
                    status: "active",
                    registeredAt: new Date().toISOString().split('T')[0],
                    sessions: 0
                }
                setUsers([...users, user])
                setShowAddModal(false)
            } else {
                const error = await res.json()
                alert(error.error || 'შეცდომა დამატებისას')
            }
        } catch (error) {
            console.error('Add user error:', error)
            alert('შეცდომა დამატებისას')
        }
    }

    const updateUser = async (updatedUser: UserType) => {
        const token = getAuthToken()
        try {
            const res = await fetch(`/api/users/${updatedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fullName: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role
                })
            })
            if (res.ok) {
                setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u))
                setShowEditModal(false)
                setSelectedUser(null)
            }
        } catch (error) {
            console.error('Update user error:', error)
        }
    }

    const deleteUser = async (userId: string) => {
        if (confirm("წაშალოთ მომხმარებელი?")) {
            const token = getAuthToken()
            try {
                const res = await fetch(`/api/users/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (res.ok) {
                    setUsers(users.filter(u => u.id !== userId))
                } else {
                    const error = await res.json()
                    alert(error.error || 'შეცდომა წაშლისას')
                }
            } catch (error) {
                console.error('Delete user error:', error)
            }
        }
    }

    const toggleBlock = async (userId: string) => {
        const user = users.find(u => u.id === userId)
        if (!user) return
        const token = getAuthToken()
        const newStatus = user.status === "blocked" ? "active" : "blocked"
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            })
            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u))
            }
        } catch (error) {
            console.error('Toggle block error:', error)
        }
    }


    const forceLogout = (userId: string) => {
        if (confirm("დაასრულოთ მომხმარებლის ყველა სესია?")) {
            setUsers(users.map(u => u.id === userId ? { ...u, sessions: 0 } : u))
            alert("სესიები დასრულებულია")
        }
    }

    const exportToCSV = () => {
        const headers = ["სახელი", "ელ.ფოსტა", "როლი", "სტატუსი", "ბოლო შესვლა", "რეგისტრაცია"]
        const rows = filteredUsers.map(u => [
            u.name, u.email, u.role, u.status, u.lastLogin, u.registeredAt
        ])
        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "users.csv"
        a.click()
    }

    const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
        <th
            className="text-left px-6 py-4 font-medium cursor-pointer hover:bg-muted/50 select-none"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-1">
                {children}
                {sortField === field && (
                    sortDirection === "asc" ? <TbChevronUp className="w-4 h-4" /> : <TbChevronDown className="w-4 h-4" />
                )}
            </div>
        </th>
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <TbUsers className="w-8 h-8 text-indigo-500" />
                        მომხმარებლები
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {users.length} მომხმარებელი
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={exportToCSV}>
                        <TbDownload className="w-4 h-4" />
                        ექსპორტი
                    </Button>
                    <Button className="gap-2" onClick={() => setShowAddModal(true)}>
                        <TbUserPlus className="w-4 h-4" />
                        დამატება
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b">
                {[
                    { id: "users", label: "მომხმარებლები", icon: TbUsers },
                    { id: "activity", label: "აქტივობა", icon: TbActivity },
                    { id: "logins", label: "შესვლების ისტორია", icon: TbClock },
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
                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="ძიება..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="როლი" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">ყველა როლი</SelectItem>
                                <SelectItem value="admin">ადმინი</SelectItem>
                                <SelectItem value="editor">ედიტორი</SelectItem>
                                <SelectItem value="viewer">მნახველი</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="სტატუსი" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">ყველა</SelectItem>
                                <SelectItem value="active">აქტიური</SelectItem>
                                <SelectItem value="inactive">არააქტიური</SelectItem>
                                <SelectItem value="blocked">დაბლოკილი</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Bulk Actions */}
                    {selectedIds.size > 0 && (
                        <div className="flex items-center gap-4 p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                            <span className="text-sm font-medium">{selectedIds.size} არჩეული</span>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => bulkChangeRole("editor")}>
                                    ედიტორი
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => bulkChangeRole("viewer")}>
                                    მნახველი
                                </Button>
                                <Button size="sm" variant="outline" onClick={bulkBlock}>
                                    <TbBan className="w-4 h-4 mr-1" />
                                    დაბლოკვა
                                </Button>
                                <Button size="sm" variant="destructive" onClick={bulkDelete}>
                                    <TbTrash className="w-4 h-4 mr-1" />
                                    წაშლა
                                </Button>
                            </div>
                        </div>
                    )}

                    <Card>
                        <CardContent className="p-0">
                            <table className="w-full">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 w-10">
                                            <Checkbox
                                                checked={paginatedUsers.length > 0 && selectedIds.size === paginatedUsers.length}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </th>
                                        <SortHeader field="name">მომხმარებელი</SortHeader>
                                        <SortHeader field="role">როლი</SortHeader>
                                        <SortHeader field="lastLogin">ბოლო შესვლა</SortHeader>
                                        <SortHeader field="status">სტატუსი</SortHeader>
                                        <th className="text-right px-6 py-4 font-medium">მოქმედება</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {paginatedUsers.map((user) => (
                                        <tr key={user.id} className={`hover:bg-muted/30 ${user.status === "blocked" ? "opacity-60" : ""}`}>
                                            <td className="px-6 py-4">
                                                <Checkbox
                                                    checked={selectedIds.has(user.id)}
                                                    onCheckedChange={() => toggleSelect(user.id)}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div
                                                    className="flex items-center gap-3 cursor-pointer"
                                                    onClick={() => { setSelectedUser(user); setShowProfileModal(true) }}
                                                >
                                                    <Avatar>
                                                        <AvatarImage src={user.avatar} alt={user.name} />
                                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
                                                            {user.name[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium hover:text-indigo-500">{user.name}</p>
                                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Select
                                                    value={user.role}
                                                    onValueChange={(value) => changeRole(user.id, value as UserType["role"])}
                                                >
                                                    <SelectTrigger className="w-[130px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="admin">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                                                ადმინი
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="editor">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                                ედიტორი
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="viewer">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 rounded-full bg-gray-500" />
                                                                მნახველი
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground text-sm">
                                                {user.lastLogin}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={
                                                    user.status === "active" ? "default" :
                                                        user.status === "blocked" ? "destructive" : "secondary"
                                                }>
                                                    {user.status === "active" ? "აქტიური" :
                                                        user.status === "blocked" ? "დაბლოკილი" : "არააქტიური"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => { setSelectedUser(user); setShowEditModal(true) }}
                                                    >
                                                        <TbEdit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => toggleBlock(user.id)}
                                                    >
                                                        {user.status === "blocked" ? (
                                                            <TbLockOpen className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <TbBan className="w-4 h-4 text-orange-500" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive"
                                                        onClick={() => deleteUser(user.id)}
                                                    >
                                                        <TbTrash className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">გვერდზე:</span>
                            <Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1) }}>
                                <SelectTrigger className="w-[70px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-sm text-muted-foreground">
                                {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedUsers.length)} / {sortedUsers.length}
                            </span>
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                <TbChevronLeft className="w-4 h-4" />
                            </Button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                                Math.max(0, currentPage - 3),
                                Math.min(totalPages, currentPage + 2)
                            ).map(page => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <TbChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
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
                            <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/30">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === "create" ? "bg-green-500/10 text-green-500" :
                                    activity.type === "update" ? "bg-blue-500/10 text-blue-500" :
                                        activity.type === "delete" ? "bg-red-500/10 text-red-500" :
                                            activity.type === "login" ? "bg-indigo-500/10 text-indigo-500" :
                                                "bg-gray-500/10 text-gray-500"
                                    }`}>
                                    {activity.type === "login" ? <TbLogin className="w-4 h-4" /> :
                                        activity.type === "logout" ? <TbLogout className="w-4 h-4" /> :
                                            <TbActivity className="w-4 h-4" />}
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
                                    <th className="text-left px-6 py-4 font-medium">მომხმარებელი</th>
                                    <th className="text-left px-6 py-4 font-medium">IP</th>
                                    <th className="text-left px-6 py-4 font-medium">მოწყობილობა</th>
                                    <th className="text-left px-6 py-4 font-medium">თარიღი</th>
                                    <th className="text-right px-6 py-4 font-medium">სტატუსი</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {sampleLoginHistory.map((login) => (
                                    <tr key={login.id} className="hover:bg-muted/30">
                                        <td className="px-6 py-4 font-medium">{login.user}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{login.ip}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {login.device === "Desktop" ? (
                                                    <TbDeviceDesktop className="w-4 h-4 text-muted-foreground" />
                                                ) : (
                                                    <TbDeviceMobile className="w-4 h-4 text-muted-foreground" />
                                                )}
                                                <span className="text-sm">{login.browser}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground text-sm">{login.timestamp}</td>
                                        <td className="px-6 py-4">
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

            {/* Add User Modal */}
            {showAddModal && (
                <AddUserModal onClose={() => setShowAddModal(false)} onAdd={addUser} />
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => { setShowEditModal(false); setSelectedUser(null) }}
                    onSave={updateUser}
                />
            )}

            {/* Profile Modal */}
            {showProfileModal && selectedUser && (
                <ProfileModal
                    user={selectedUser}
                    onClose={() => { setShowProfileModal(false); setSelectedUser(null) }}
                    onForceLogout={() => forceLogout(selectedUser.id)}
                />
            )}
        </div>
    )
}

// Add User Modal
function AddUserModal({ onClose, onAdd }: {
    onClose: () => void
    onAdd: (user: Omit<UserType, "id" | "lastLogin" | "status" | "registeredAt" | "sessions">) => void
}) {
    const [formData, setFormData] = React.useState({ name: "", email: "", password: "", confirmPassword: "", role: "viewer" as UserType["role"] })
    const [showPassword, setShowPassword] = React.useState(false)
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.name.trim()) newErrors.name = "სახელი სავალდებულოა"
        if (!formData.email.trim()) newErrors.email = "ელ.ფოსტა სავალდებულოა"
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "არასწორი ფორმატი"
        if (!formData.password) newErrors.password = "პაროლი სავალდებულოა"
        else if (formData.password.length < 6) newErrors.password = "მინიმუმ 6 სიმბოლო"
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "პაროლები არ ემთხვევა"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) onAdd({ name: formData.name, email: formData.email, role: formData.role })
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <TbUserPlus className="w-5 h-5 text-indigo-500" />
                        ახალი მომხმარებელი
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}><TbX className="w-4 h-4" /></Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2"><TbUser className="w-4 h-4 text-muted-foreground" />სახელი</label>
                            <Input placeholder="სრული სახელი" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2"><TbMail className="w-4 h-4 text-muted-foreground" />ელ.ფოსტა</label>
                            <Input type="email" placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2"><TbLock className="w-4 h-4 text-muted-foreground" />პაროლი</label>
                            <div className="relative">
                                <Input type={showPassword ? "text" : "password"} placeholder="მინიმუმ 6 სიმბოლო" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    {showPassword ? <TbEyeOff className="w-4 h-4" /> : <TbEye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2"><TbLock className="w-4 h-4 text-muted-foreground" />პაროლის დადასტურება</label>
                            <Input type={showPassword ? "text" : "password"} placeholder="გაიმეორეთ პაროლი" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
                            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2"><TbShield className="w-4 h-4 text-muted-foreground" />როლი</label>
                            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as UserType["role"] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" />ადმინი</div></SelectItem>
                                    <SelectItem value="editor"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" />ედიტორი</div></SelectItem>
                                    <SelectItem value="viewer"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-500" />მნახველი</div></SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onClose}>გაუქმება</Button>
                            <Button type="submit" className="gap-2"><TbCheck className="w-4 h-4" />რეგისტრაცია</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

// Edit User Modal
function EditUserModal({ user, onClose, onSave }: { user: UserType; onClose: () => void; onSave: (user: UserType) => void }) {
    const [formData, setFormData] = React.useState({ name: user.name, email: user.email, role: user.role })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({ ...user, ...formData })
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2"><TbEdit className="w-5 h-5 text-indigo-500" />რედაქტირება</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}><TbX className="w-4 h-4" /></Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">სახელი</label>
                            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">ელ.ფოსტა</label>
                            <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">როლი</label>
                            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as UserType["role"] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">ადმინი</SelectItem>
                                    <SelectItem value="editor">ედიტორი</SelectItem>
                                    <SelectItem value="viewer">მნახველი</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={onClose}>გაუქმება</Button>
                            <Button type="submit" className="gap-2"><TbCheck className="w-4 h-4" />შენახვა</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

// Profile Modal
function ProfileModal({ user, onClose, onForceLogout }: { user: UserType; onClose: () => void; onForceLogout: () => void }) {
    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>პროფილი</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}><TbX className="w-4 h-4" /></Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                            {user.name[0]}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{user.name}</h3>
                            <p className="text-muted-foreground">{user.email}</p>
                            <Badge className="mt-1">{user.role}</Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-muted/30">
                            <p className="text-sm text-muted-foreground">რეგისტრაცია</p>
                            <p className="font-medium">{user.registeredAt}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/30">
                            <p className="text-sm text-muted-foreground">ბოლო შესვლა</p>
                            <p className="font-medium">{user.lastLogin}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/30">
                            <p className="text-sm text-muted-foreground">აქტიური სესიები</p>
                            <p className="font-medium">{user.sessions}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/30">
                            <p className="text-sm text-muted-foreground">სტატუსი</p>
                            <Badge variant={user.status === "active" ? "default" : user.status === "blocked" ? "destructive" : "secondary"}>
                                {user.status === "active" ? "აქტიური" : user.status === "blocked" ? "დაბლოკილი" : "არააქტიური"}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button variant="outline" className="w-full gap-2" onClick={onForceLogout} disabled={user.sessions === 0}>
                            <TbPower className="w-4 h-4" />
                            ყველა სესიის დასრულება ({user.sessions})
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
