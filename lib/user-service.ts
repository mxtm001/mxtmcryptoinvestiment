export interface UserProfile {
  uid: string
  email: string
  firstName: string
  lastName: string
  phone: string
  country: string
  balance: number
  totalInvested: number
  totalEarnings: number
  isVerified: boolean
  verificationStatus: "pending" | "approved" | "rejected" | "none"
  createdAt: Date
  lastLogin: Date
  role: "user" | "admin"
  status?: "active" | "pending" | "blocked"
  name?: string
  joined?: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  country: string
}

export interface LoginData {
  email: string
  password: string
}

export interface Transaction {
  id?: string
  userId: string
  type: "deposit" | "withdrawal" | "investment" | "earnings"
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "cancelled"
  description: string
  method?: string
  date?: string
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, any>
}

export interface Investment {
  id?: string
  userId: string
  planId: string
  planName: string
  plan?: string
  amount: number
  duration: number
  interestRate: number
  expectedReturn: number
  profit?: number
  status: "active" | "completed" | "cancelled"
  returnRate: number
  startDate: Date
  endDate: Date
  createdAt: Date
}

export interface VerificationData {
  documentType: string
  documentNumber?: string
  country?: string
  frontImage: string
  backImage?: string
  selfieImage: string
}

class UserService {
  private currentUser: UserProfile | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.loadCurrentUser()
    }
  }

  private loadCurrentUser(): void {
    try {
      const savedUser = localStorage.getItem("currentUser")
      if (savedUser) {
        const parsed = JSON.parse(savedUser)
        this.currentUser = {
          ...parsed,
          createdAt: new Date(parsed.createdAt),
          lastLogin: new Date(parsed.lastLogin),
        }
      }
    } catch (error) {
      console.error("Error loading current user:", error)
      this.currentUser = null
    }
  }

  private saveCurrentUser(user: UserProfile): void {
    if (typeof window !== "undefined") {
      this.currentUser = user
      localStorage.setItem("currentUser", JSON.stringify(user))
    }
  }

  getCurrentUserSync(): UserProfile | null {
    if (typeof window === "undefined") return null

    if (!this.currentUser) {
      try {
        const saved = localStorage.getItem("currentUser")
        if (saved) {
          const parsed = JSON.parse(saved)
          this.currentUser = {
            ...parsed,
            createdAt: new Date(parsed.createdAt),
            lastLogin: new Date(parsed.lastLogin),
          }
        }
      } catch (error) {
        console.error("Error loading user:", error)
        return null
      }
    }

    return this.currentUser
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    return this.getCurrentUserSync()
  }

  async register(data: RegisterData): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
    try {
      if (typeof window === "undefined") {
        return { success: false, message: "Registration not available" }
      }

      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
      const userExists = existingUsers.some((user: any) => user.email === data.email)

      if (userExists) {
        return {
          success: false,
          message: "Email is already registered",
        }
      }

      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const userProfile: UserProfile = {
        uid: userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        country: data.country,
        balance: 54000,
        totalInvested: 0,
        totalEarnings: 0,
        isVerified: true,
        verificationStatus: "approved",
        status: "active",
        createdAt: new Date(),
        lastLogin: new Date(),
        joined: new Date().toLocaleDateString(),
        role: "user",
      }

      existingUsers.push({
        ...userProfile,
        password: data.password,
      })
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))

      this.saveCurrentUser(userProfile)

      // Save login for quick access
      if (typeof window !== "undefined") {
        const { saveLogin } = await import("@/lib/saved-logins")
        saveLogin(data.email, `${data.firstName} ${data.lastName}`, data.country)
      }

      return { success: true, user: userProfile }
    } catch (error: any) {
      console.error("Registration error:", error)
      return {
        success: false,
        message: "Registration failed. Please try again.",
      }
    }
  }

  async login(data: LoginData): Promise<{ success: boolean; user?: UserProfile; message?: string }> {
    try {
      if (typeof window === "undefined") {
        return { success: false, message: "Login not available" }
      }

      // Get registered users
      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

      // Find user by email
      const foundUser = existingUsers.find((user: any) => user.email === data.email)

      if (!foundUser) {
        return {
          success: false,
          message: "No account found with this email address",
        }
      }

      // Check password
      if (foundUser.password !== data.password) {
        return {
          success: false,
          message: "Invalid password",
        }
      }

      // Create user profile (without password)
      const userProfile: UserProfile = {
        uid: foundUser.uid,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        name: foundUser.name,
        phone: foundUser.phone,
        country: foundUser.country,
        balance: foundUser.balance || 54000,
        totalInvested: foundUser.totalInvested || 0,
        totalEarnings: foundUser.totalEarnings || 0,
        isVerified: foundUser.isVerified !== undefined ? foundUser.isVerified : true,
        verificationStatus: foundUser.verificationStatus || "approved",
        status: foundUser.status || "active",
        createdAt: new Date(foundUser.createdAt),
        lastLogin: new Date(),
        joined: foundUser.joined || new Date().toLocaleDateString(),
        role: foundUser.role || (data.email === "admin@mxtminvestment.com" ? "admin" : "user"),
      }

      // Update last login in stored users
      const updatedUsers = existingUsers.map((user: any) =>
        user.email === data.email ? { ...user, lastLogin: new Date().toISOString() } : user,
      )
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

      // Save current user
      this.saveCurrentUser(userProfile)

      // Update saved logins
      if (typeof window !== "undefined") {
        const { updateLastUsed } = await import("@/lib/saved-logins")
        updateLastUsed(data.email)
      }

      return { success: true, user: userProfile }
    } catch (error: any) {
      console.error("Login error:", error)
      return {
        success: false,
        message: "Login failed. Please try again.",
      }
    }
  }

  async logout(): Promise<{ success: boolean }> {
    this.currentUser = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser")
    }
    return { success: true }
  }

  async getUserTransactions(): Promise<Transaction[]> {
    const mockTransactions: Transaction[] = [
      {
        id: "txn_1",
        userId: this.currentUser?.uid || "demo",
        type: "deposit",
        amount: 10000,
        currency: "BRL",
        status: "completed",
        description: "Depósito inicial",
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
      },
      {
        id: "txn_2",
        userId: this.currentUser?.uid || "demo",
        type: "investment",
        amount: 5000,
        currency: "BRL",
        status: "completed",
        description: "Investimento Plano Premium",
        createdAt: new Date(Date.now() - 43200000),
        updatedAt: new Date(Date.now() - 43200000),
      },
      {
        id: "txn_3",
        userId: this.currentUser?.uid || "demo",
        type: "earnings",
        amount: 750,
        currency: "BRL",
        status: "completed",
        description: "Lucro de investimento",
        createdAt: new Date(Date.now() - 21600000),
        updatedAt: new Date(Date.now() - 21600000),
      },
    ]

    return mockTransactions
  }

  async getUserInvestments(): Promise<Investment[]> {
    const mockInvestments: Investment[] = [
      {
        id: "inv_1",
        userId: this.currentUser?.uid || "demo",
        planId: "premium",
        planName: "Plano Premium",
        plan: "Plano Premium",
        amount: 10000,
        duration: 30,
        interestRate: 15,
        expectedReturn: 11500,
        profit: 1500,
        status: "active",
        returnRate: 15,
        startDate: new Date(Date.now() - 86400000),
        endDate: new Date(Date.now() + 2592000000),
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        id: "inv_2",
        userId: this.currentUser?.uid || "demo",
        planId: "gold",
        planName: "Plano Ouro",
        plan: "Plano Ouro",
        amount: 5000,
        duration: 15,
        interestRate: 12,
        expectedReturn: 5600,
        profit: 600,
        status: "active",
        returnRate: 12,
        startDate: new Date(Date.now() - 43200000),
        endDate: new Date(Date.now() + 1296000000),
        createdAt: new Date(Date.now() - 43200000),
      },
    ]

    return mockInvestments
  }

  async updateProfile(uid: string, updates: Partial<UserProfile>): Promise<{ success: boolean; message?: string }> {
    try {
      if (typeof window !== "undefined" && this.currentUser) {
        const updatedUser = { ...this.currentUser, ...updates }
        this.saveCurrentUser(updatedUser)

        // Update in registered users as well
        const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
        const updatedUsers = existingUsers.map((user: any) => (user.uid === uid ? { ...user, ...updates } : user))
        localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
      }
      return { success: true }
    } catch (error: any) {
      console.error("Update profile error:", error)
      return { success: false, message: "Failed to update profile" }
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; message?: string }> {
    return { success: true, message: "Password reset email sent successfully" }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    return { success: true, message: "Password updated successfully" }
  }

  async addTransaction(
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  ): Promise<{ success: boolean; transactionId?: string; message?: string }> {
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    return { success: true, transactionId }
  }

  async addInvestment(
    investment: Omit<Investment, "id" | "createdAt">,
  ): Promise<{ success: boolean; investmentId?: string; message?: string }> {
    const investmentId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    return { success: true, investmentId }
  }

  async submitVerification(
    userEmail: string,
    userName: string,
    verificationData: VerificationData,
  ): Promise<{ success: boolean; message: string }> {
    return { success: true, message: "Verification submitted and approved successfully!" }
  }

  async processDeposit(amount: number, method: string): Promise<{ success: boolean; message: string }> {
    return { success: true, message: "Deposit processed successfully!" }
  }
}

export const userService = new UserService()

// Helper functions
export const getUserByEmail = (email: string): UserProfile | null => {
  if (typeof window === "undefined") return null

  const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const foundUser = existingUsers.find((user: any) => user.email === email)

  if (!foundUser) return null

  return {
    uid: foundUser.uid,
    email: foundUser.email,
    firstName: foundUser.firstName,
    lastName: foundUser.lastName,
    name: foundUser.name,
    phone: foundUser.phone,
    country: foundUser.country,
    balance: foundUser.balance || 54000,
    totalInvested: foundUser.totalInvested || 0,
    totalEarnings: foundUser.totalEarnings || 0,
    isVerified: foundUser.isVerified !== undefined ? foundUser.isVerified : true,
    verificationStatus: foundUser.verificationStatus || "approved",
    status: foundUser.status || "active",
    createdAt: new Date(foundUser.createdAt),
    lastLogin: new Date(foundUser.lastLogin),
    joined: foundUser.joined || new Date().toLocaleDateString(),
    role: foundUser.role || "user",
  }
}

export const getUserTransactions = (email: string): Transaction[] => {
  // Return mock transactions for now
  return [
    {
      id: "txn_1",
      userId: email,
      type: "deposit",
      amount: 10000,
      currency: "BRL",
      status: "completed",
      description: "Depósito inicial",
      method: "PIX",
      date: new Date(Date.now() - 86400000).toLocaleDateString(),
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
    },
    {
      id: "txn_2",
      userId: email,
      type: "investment",
      amount: 5000,
      currency: "BRL",
      status: "completed",
      description: "Investimento Plano Premium",
      method: "Balance",
      date: new Date(Date.now() - 43200000).toLocaleDateString(),
      createdAt: new Date(Date.now() - 43200000),
      updatedAt: new Date(Date.now() - 43200000),
    },
  ]
}

export const getUserInvestments = (email: string): Investment[] => {
  // Return mock investments for now
  return [
    {
      id: "inv_1",
      userId: email,
      planId: "premium",
      planName: "Plano Premium",
      plan: "Plano Premium",
      amount: 10000,
      duration: 30,
      interestRate: 15,
      expectedReturn: 11500,
      profit: 1500,
      status: "active",
      returnRate: 15,
      startDate: new Date(Date.now() - 86400000),
      endDate: new Date(Date.now() + 2592000000),
      createdAt: new Date(Date.now() - 86400000),
    },
  ]
}

export const updateUserStatus = (email: string, status: string) => {
  if (typeof window === "undefined") return { success: false }

  const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const updatedUsers = existingUsers.map((user: any) => (user.email === email ? { ...user, status } : user))
  localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
  return { success: true }
}

export const addProfitToUser = (email: string, amount: number) => {
  if (typeof window === "undefined") return { success: false }

  const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const updatedUsers = existingUsers.map((user: any) =>
    user.email === email ? { ...user, balance: (user.balance || 0) + amount } : user,
  )
  localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
  return { success: true }
}

export const deductFromUserBalance = (email: string, amount: number) => {
  if (typeof window === "undefined") return { success: false }

  const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
  const updatedUsers = existingUsers.map((user: any) =>
    user.email === email ? { ...user, balance: (user.balance || 0) - amount } : user,
  )
  localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))
  return { success: true }
}

export const getUserVerifications = (): any[] => {
  return []
}

export const getVerificationById = (id: string): any => {
  return null
}

export const updateVerificationStatus = (id: string, status: string): void => {
  // Mock function
}

export const updateVerificationNotes = (id: string, notes: string): void => {
  // Mock function
}

export const processDeposit = async (
  amount: number,
  method: string,
): Promise<{ success: boolean; message: string }> => {
  return userService.processDeposit(amount, method)
}

export const submitVerification = async (
  userEmail: string,
  userName: string,
  verificationData: VerificationData,
): Promise<{ success: boolean; message: string }> => {
  return userService.submitVerification(userEmail, userName, verificationData)
}
