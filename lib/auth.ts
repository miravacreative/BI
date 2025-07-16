export interface User {
  id: string
  username: string
  role: "user" | "admin" | "developer"
  name: string
  phone?: string
  email?: string
  assignedPages?: string[]
  createdAt: Date
  lastLogin?: Date
  isActive: boolean
}

export type AuthUser = User

export interface Page {
  id: string
  title: string
  type: "powerbi" | "spreadsheet" | "html"
  subType?: "dashboard" | "report" | "analytics" | "custom"
  content: string
  embedUrl?: string
  htmlContent?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  isActive: boolean
  allowedRoles?: string[]
}

export interface ActivityLog {
  id: string
  userId: string
  action: string
  details: string
  timestamp: Date
  ipAddress?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Mock user database with real timestamps
const users: Record<string, User & { password: string }> = {
  admin: {
    id: "1",
    username: "admin",
    password: "admin",
    role: "admin",
    name: "administrator",
    phone: "081234567890",
    email: "ccc@jne.co.id",
    createdAt: new Date("2024-01-01"),
    lastLogin: new Date(),
    isActive: true,
   }, 
   developer: {
    id: "2",
    username: "Developer",
    password: "jnecbn09",
    role: "developer",
    name: "Developer-IT",
    phone: "081234567891",
    email: "dev@jne.com",
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isActive: true, 
  },
   user1: {
    id: "3",
    username: "user1",
    password: "user123",
    role: "user",
    name: "Bobby",
    phone: "081234567892",
    email: "Bobby@example.com",
    assignedPages: ["powerbi", "spreadsheet1"],
    createdAt: new Date("2024-02-01"),
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isActive: true,
  },
  user2: {
    id: "4",
    username: "user2",
    password: "user456",
    role: "user",
    name: "Ntuy",
    phone: "081234567893",
    email: "ntuy@example.com",
    assignedPages: ["spreadsheet1"],
    createdAt: new Date("2024-02-15"),
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isActive: false,
  },
}

// Mock pages database
const pages: Record<string, Page> = {
  powerbi: {
    id: "powerbi",
    title: "Power BI Dashboard",
    type: "powerbi",
    subType: "dashboard",
    content: "Power BI Analytics Dashboard for real-time business intelligence",
    embedUrl: "https://app.powerbi.com/embed/sample",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-02-20"),
    createdBy: "1",
    isActive: true,
    allowedRoles: ["admin", "developer", "user"],
  },
  spreadsheet1: {
    id: "spreadsheet1",
    title: "Sales Report",
    type: "spreadsheet",
    subType: "report",
    content: "Monthly Sales Analysis and Performance Metrics",
    embedUrl: "https://docs.google.com/spreadsheets/embed/sample1",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-02-25"),
    createdBy: "2",
    isActive: true,
    allowedRoles: ["admin", "developer", "user"],
  },
  spreadsheet2: {
    id: "spreadsheet2",
    title: "Inventory Management",
    type: "spreadsheet",
    subType: "analytics",
    content: "Real-time Inventory Tracking and Management System",
    embedUrl: "https://docs.google.com/spreadsheets/embed/sample2",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-28"),
    createdBy: "1",
    isActive: true,
    allowedRoles: ["admin", "developer"],
  },
  custom1: {
    id: "custom1",
    title: "Custom HTML Dashboard",
    type: "html",
    subType: "custom",
    content: "Custom HTML dashboard with interactive elements",
    htmlContent: `
      <div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
        <h2>Custom Dashboard</h2>
        <p>This is a custom HTML dashboard with interactive elements.</p>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px;">
          <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; text-align: center;">
            <h3>Metric 1</h3>
            <p style="font-size: 24px; font-weight: bold;">1,234</p>
          </div>
          <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; text-align: center;">
            <h3>Metric 2</h3>
            <p style="font-size: 24px; font-weight: bold;">5,678</p>
          </div>
          <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; text-align: center;">
            <h3>Metric 3</h3>
            <p style="font-size: 24px; font-weight: bold;">9,012</p>
          </div>
        </div>
      </div>
    `,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-28"),
    createdBy: "2",
    isActive: true,
    allowedRoles: ["admin", "developer"],
  },
}

// Activity logs for real tracking
let activityLogs: ActivityLog[] = [
  {
    id: "1",
    userId: "1",
    action: "login",
    details: "Admin logged in",
    timestamp: new Date(),
    ipAddress: "192.168.1.1",
  },
  {
    id: "2",
    userId: "3",
    action: "page_view",
    details: "Viewed Power BI Dashboard",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    ipAddress: "192.168.1.2",
  },
  {
    id: "3",
    userId: "2",
    action: "page_edit",
    details: "Updated Sales Report spreadsheet",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    ipAddress: "192.168.1.3",
  },
  {
    id: "4",
    userId: "4",
    action: "login",
    details: "User logged in",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    ipAddress: "192.168.1.4",
  },
]

export const authenticate = (username: string, password: string): User | null => {
  const user = users[username]
  console.log("Checking user:", user)

  if (user && user.password === password) {
    user.lastLogin = new Date()
    logActivity(user.id, "login", `${user.name} logged in`)
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  return null
}
export const getUserByPhone = (phone: string): (User & { password: string }) | null => {
  return Object.values(users).find((user) => user.phone === phone) || null
}

export const registerUser = (userData: {
  username: string
  password: string
  name: string
  phone: string
  email?: string
}): boolean => {
  if (users[userData.username]) {
    return false
  }

  const newUser = {
    id: Date.now().toString(),
    ...userData,
    role: "user" as const,
    assignedPages: [],
    createdAt: new Date(),
    isActive: true,
  }

  users[userData.username] = newUser
  logActivity(newUser.id, "register", `New user ${newUser.name} registered`)
  return true
}

export const createUser = (userData: {
  username: string
  password: string
  name: string
  phone: string
  email: string
  role: "user" | "admin" | "developer"
  assignedPages?: string[]
}): boolean => {
  if (users[userData.username]) {
    return false
  }

  const newUser = {
    id: Date.now().toString(),
    ...userData,
    assignedPages: userData.assignedPages || [],
    createdAt: new Date(),
    isActive: true,
  }

  users[userData.username] = newUser
  // Save to localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('dashboard_users', JSON.stringify(users))
  }
  logActivity("system", "user_create", `New user ${newUser.name} created with role ${newUser.role}`)
  return true
}

export const updateUserPassword = (userId: string, newPassword: string): boolean => {
  const userEntry = Object.entries(users).find(([_, user]) => user.id === userId)
  if (userEntry) {
    const [username, user] = userEntry
    users[username].password = newPassword
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard_users', JSON.stringify(users))
    }
    logActivity(userId, "password_change", `Password changed for user ${user.name}`)
    return true
  }
  return false
}

export const getAllUsers = (): User[] => {
  // Load from localStorage if available
  if (typeof window !== 'undefined') {
    const savedUsers = localStorage.getItem('dashboard_users')
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers)
//
      Object.values(parsedUsers).forEach((user: any) => {
        if (user.createdAt) user.createdAt = new Date(user.createdAt)
        if (user.lastLogin) user.lastLogin = new Date(user.lastLogin)
      })

      Object.assign(users, parsedUsers)
    }
  }

  return Object.values(users).map(({ password, ...user }) => user)
}


export const getUserById = (id: string): User | null => {
  if (typeof window !== 'undefined') {
    const savedUsers = localStorage.getItem('dashboard_users')
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers)
      Object.keys(parsedUsers).forEach((key) => {
        const u = parsedUsers[key]
        u.createdAt = new Date(u.createdAt)
        if (u.lastLogin) u.lastLogin = new Date(u.lastLogin)
      })
      Object.assign(users, parsedUsers)
    }
  }
  const user = Object.values(users).find((u) => u.id === id)
  if (user) {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

export const getAllPages = (): Page[] => {
  if (typeof window !== 'undefined') {
    const savedPages = localStorage.getItem('dashboard_pages')
    if (savedPages) {
      const parsedPages = JSON.parse(savedPages)
      Object.keys(parsedPages).forEach((key) => {
        const p = parsedPages[key]
        p.createdAt = new Date(p.createdAt)
        p.updatedAt = new Date(p.updatedAt)
      })
      Object.assign(pages, parsedPages)
    }
  }
  return Object.values(pages)
}

export const getPageById = (id: string): Page | null => {
  if (typeof window !== 'undefined') {
    const savedPages = localStorage.getItem('dashboard_pages')
    if (savedPages) {
      const parsedPages = JSON.parse(savedPages)
      Object.keys(parsedPages).forEach((key) => {
        const p = parsedPages[key]
        p.createdAt = new Date(p.createdAt)
        p.updatedAt = new Date(p.updatedAt)
      })
      Object.assign(pages, parsedPages)
    }
  }
  return pages[id] || null
}

export const updateUser = (userId: string, updates: Partial<User>): boolean => {
  const userEntry = Object.entries(users).find(([_, user]) => user.id === userId)
  if (userEntry) {
    const [username, user] = userEntry
    users[username] = { ...user, ...updates }
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard_users', JSON.stringify(users))
    }
    logActivity(userId, "user_update", `User ${user.name} updated`)
    return true
  }
  return false
}

export const updateUserStatus = (userId: string, isActive: boolean): boolean => {
  const user = Object.values(users).find((u) => u.id === userId)
  if (user) {
    user.isActive = isActive
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard_users', JSON.stringify(users))
    }
    logActivity(userId, "status_change", `User status changed to ${isActive ? "active" : "inactive"}`)
    return true
  }
  return false
}

export const deleteUser = (userId: string): boolean => {
  const userEntry = Object.entries(users).find(([_, user]) => user.id === userId)
  if (userEntry) {
    delete users[userEntry[0]]
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard_users', JSON.stringify(users))
    }
    logActivity(userId, "delete", `User deleted`)
    return true
  }
  return false
}

export const assignPagesToUser = (userId: string, pageIds: string[]): boolean => {
  const user = Object.values(users).find((u) => u.id === userId)
  if (user) {
    user.assignedPages = pageIds
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard_users', JSON.stringify(users))
    }
    logActivity(userId, "page_assignment", `Pages assigned: ${pageIds.join(", ")}`)
    return true
  }
  return false
}

export const createPage = (pageData: Omit<Page, "id" | "createdAt" | "updatedAt">): Page => {
  const newPage: Page = {
    ...pageData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  pages[newPage.id] = newPage
  // Save to localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('dashboard_pages', JSON.stringify(pages))
  }
  logActivity(pageData.createdBy, "page_create", `Created page: ${pageData.title}`)
  return newPage
}

export const updatePage = (pageId: string, updates: Partial<Page>): boolean => {
  if (pages[pageId]) {
    pages[pageId] = { ...pages[pageId], ...updates, updatedAt: new Date() }
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard_pages', JSON.stringify(pages))
    }
    logActivity(updates.createdBy || "system", "page_update", `Updated page: ${pages[pageId].title}`)
    return true
  }
  return false
}

export const deletePage = (pageId: string, userId: string): boolean => {
  if (pages[pageId]) {
    const pageTitle = pages[pageId].title
    delete pages[pageId]
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard_pages', JSON.stringify(pages))
    }
    logActivity(userId, "page_delete", `Deleted page: ${pageTitle}`)
    return true
  }
  return false
}

export const logActivity = (userId: string, action: string, details: string): void => {
  const timestamp = new Date()

  const activity: ActivityLog = {
    id: Date.now().toString(),
    userId,
    action,
    details,
    timestamp,
    ipAddress: "192.168.1." + Math.floor(Math.random() * 255),
  }

  activityLogs.unshift(activity)

  if (activityLogs.length > 1000) {
    activityLogs = activityLogs.slice(0, 1000)
  }
}

  activityLogs.unshift(activity) // Add to beginning

  // Keep only last 1000 activities
  if (activityLogs.length > 1000) {
    activityLogs = activityLogs.slice(0, 1000)
  }
}

export const getActivityLogs = (limit = 50): ActivityLog[] => {
  return activityLogs.slice(0, limit)
}

export const getDashboardStats = () => {
  const totalUsers = Object.keys(users).length
  const activeUsers = Object.values(users).filter((u) => u.isActive).length
  const totalPages = Object.keys(pages).length
  const activePages = Object.values(pages).filter((p) => p.isActive).length

  // Calculate traffic from activity logs
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const todayActivities = activityLogs.filter((log) => log.timestamp >= todayStart)

  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthlyActivities = activityLogs.filter((log) => log.timestamp >= thisMonth)

  // Recent registrations (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const recentRegistrations = Object.values(users).filter((u) => u.createdAt >= thirtyDaysAgo).length

  return {
    totalUsers,
    activeUsers,
    totalPages,
    activePages,
    dailyTraffic: todayActivities.length,
    monthlyTraffic: monthlyActivities.length,
    recentRegistrations,
    lastActivity: activityLogs[0]?.timestamp || new Date(),
  }
}

export const getPageSubTypes = () => {
  return {
    powerbi: ["dashboard", "report", "analytics"],
    spreadsheet: ["report", "analytics", "data-entry"],
    html: ["custom", "widget", "form", "landing"],
  }
}
