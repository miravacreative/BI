import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Interface Anda tetap sama
export interface User {
  id: string;
  username: string;
  role: "user" | "admin" | "developer";
  name: string;
  phone?: string;
  email?: string;
  assignedPages?: string[];
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  password?: string; // Tambahkan ini untuk proses insert, tapi akan dihapus saat pengambilan data
}

export type AuthUser = Omit<User, 'password'>;

export interface Page {
  id: string;
  title: string;
  type: "powerbi" | "spreadsheet" | "html";
  subType?: "dashboard" | "report" | "analytics" | "custom";
  content: string;
  embedUrl?: string;
  htmlContent?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
  allowedRoles?: string[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: Date;
  ipAddress?: string;
}

// --- FUNGSI AUTENTIKASI ---
export const authenticate = async (username: string, password: string): Promise<User | null> => {
  try {
  const { data, error } = await supabase
    .from('users') // PASTIKAN nama tabel ini 'users' atau sesuai dengan di Supabase
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error || !data) {
    console.error('Authentication error:', error);
    return null;
  }

  // Update waktu login terakhir
  await supabase.from('users').update({ lastLogin: new Date().toISOString() }).eq('id', data.id);
  
  await logActivity(data.id, "login", `${data.name} logged in`);

  const { password: _, ...userWithoutPassword } = data;
  return userWithoutPassword;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

export const getUserByPhone = async (phone: string): Promise<(User & { password: string }) | null> => {
  try {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();
    
    if (error || !data) {
        return null;
    }
    return data;
  } catch (error) {
    console.error('Error getting user by phone:', error);
    return null;
  }
};

// --- MANAJEMEN PENGGUNA ---

export const registerUser = async (userData: {
  username: string;
  password: string;
  name: string;
  phone: string;
  email?: string;
}): Promise<boolean> => {
  try {
    const newUser = {
        ...userData,
        role: "user" as const,
        assignedPages: [],
        isActive: true,
    };

    const { error } = await supabase.from('users').insert([newUser]);

    if (error) {
        console.error('Registration error:', error);
        return false;
    }
    
    const { data: createdUser } = await supabase
      .from('users')
      .select('id, name')
      .eq('username', userData.username)
      .single();
      
    if (createdUser) {
        await logActivity(createdUser.id, "register", `New user ${createdUser.name} registered`);
    }

    return true;
  } catch (error) {
    console.error('Registration error:', error);
    return false;
  }
};

export const createUser = async (userData: any): Promise<boolean> => {
    const { error } = await supabase.from('users').insert([userData]);
    if (error) {
        console.error('Error creating user:', error);
        return false;
    }
    await logActivity("system", "user_create", `New user ${userData.name} created with role ${userData.role}`);
    return true;
};

export const updateUserPassword = async (userId: string, newPassword: string): Promise<boolean> => {
    const { error } = await supabase.from('users').update({ password: newPassword }).eq('id', userId);
    if (error) {
        console.error('Error updating password:', error);
        return false;
    }
    await logActivity(userId, "password_change", `Password changed for user ID ${userId}`);
    return true;
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return (data || []).map(({ password, ...user }) => user);
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<boolean> => {
    const { error } = await supabase.from('users').update(updates).eq('id', userId);
    if (error) {
        console.error('Error updating user:', error);
        return false;
    }
    await logActivity(userId, "user_update", `User data updated`);
    return true;
};

export const updateUserStatus = async (userId: string, isActive: boolean): Promise<boolean> => {
    const { error } = await supabase.from('users').update({ isActive }).eq('id', userId);
    if (error) {
        return false;
    }
    await logActivity(userId, "status_change", `User status changed to ${isActive ? "active" : "inactive"}`);
    return true;
};

export const deleteUser = async (userId: string): Promise<boolean> => {
    const { error } = await supabase.from('users').delete().eq('id', userId);
    if (error) {
        console.error('Error deleting user:', error);
        return false;
    }
    await logActivity(userId, "delete", `User deleted`);
    return true;
};

export const assignPagesToUser = async (userId: string, pageIds: string[]): Promise<boolean> => {
    const { error } = await supabase.from('users').update({ assignedPages: pageIds }).eq('id', userId);
    if (error) {
        console.error('Error assigning pages:', error);
        return false;
    }
    await logActivity(userId, "page_assignment", `Pages assigned: ${pageIds.join(", ")}`);
    return true;
};

// --- MANAJEMEN HALAMAN (PAGES) ---

export const getAllPages = async (): Promise<Page[]> => {
  try {
    const { data, error } = await supabase.from('pages').select('*');
    if (error) {
        console.error("Error fetching pages:", error);
        return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error fetching pages:", error);
    return [];
  }
};

export const getPageById = async (id: string): Promise<Page | null> => {
    const { data, error } = await supabase.from('pages').select('*').eq('id', id).single();
    if (error) {
        return null;
    }
    return data;
};

export const createPage = async (pageData: Omit<Page, "id" | "createdAt" | "updatedAt">): Promise<Page | null> => {
    const { data, error } = await supabase.from('pages').insert([pageData]).select().single();
    if (error) {
        console.error('Error creating page:', error);
        return null;
    }
    await logActivity(pageData.createdBy, "page_create", `Created page: ${pageData.title}`);
    return data;
};

export const updatePage = async (pageId: string, updates: Partial<Page>): Promise<boolean> => {
    const { error } = await supabase.from('pages').update({ ...updates, updatedAt: new Date().toISOString() }).eq('id', pageId);
    if (error) {
        console.error('Error updating page:', error);
        return false;
    }
    await logActivity(updates.createdBy || "system", "page_update", `Updated page ID: ${pageId}`);
    return true;
};

export const deletePage = async (pageId: string, userId: string): Promise<boolean> => {
    const pageData = await getPageById(pageId); // Ambil data halaman dulu untuk log
    const { error } = await supabase.from('pages').delete().eq('id', pageId);
    if (error) {
        console.error('Error deleting page:', error);
        return false;
    }
    await logActivity(userId, "page_delete", `Deleted page: ${pageData?.title || pageId}`);
    return true;
};

// --- LOG AKTIVITAS ---

export const logActivity = async (userId: string, action: string, details: string): Promise<void> => {
  try {
    const activity: Omit<ActivityLog, 'id' | 'timestamp'> = {
        userId,
        action,
        details,
        ipAddress: "127.0.0.1",
    };
    await supabase.from('activity_logs').insert([activity]);
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export const getActivityLogs = async (limit = 50): Promise<ActivityLog[]> => {
  try {
    const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);
    
    if (error) {
        return [];
    }
    return data || [];
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }
};

// --- STATISTIK ---

export const getDashboardStats = async () => {
  try {
    const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
    const { count: activeUsers } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('isActive', true);
    const { count: totalPages } = await supabase.from('pages').select('*', { count: 'exact', head: true });
    const { count: activePages } = await supabase.from('pages').select('*', { count: 'exact', head: true }).eq('isActive', true);
    
    return {
        totalUsers: totalUsers ?? 0,
        activeUsers: activeUsers ?? 0,
        totalPages: totalPages ?? 0,
        activePages: activePages ?? 0,
        dailyTraffic: 0, 
        monthlyTraffic: 0,
        recentRegistrations: 0,
        lastActivity: new Date(),
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalPages: 0,
      activePages: 0,
      dailyTraffic: 0,
      monthlyTraffic: 0,
      recentRegistrations: 0,
      lastActivity: new Date(),
    };
  }
};

// --- DATA STATIS ---

export const getPageSubTypes = () => {
  return {
    powerbi: ["dashboard", "report", "analytics"],
    spreadsheet: ["report", "analytics", "data-entry"],
    html: ["custom", "widget", "form", "landing"],
  };
};
