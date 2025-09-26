import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key')) {
  console.warn('Supabase environment variables not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Auth helper functions
export const signUp = async (email: string, password: string, userData: {
  full_name: string
  phone?: string
  date_of_birth?: string
  gender?: string
}) => {
  try {
    // Check if Supabase is properly configured
    if (supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key')) {
      return {
        data: null,
        error: {
          message: 'Supabase is not configured. Please connect to Supabase using the "Connect to Supabase" button or set up your environment variables.',
          code: 'supabase_not_configured'
        }
      }
    }

    // First create the auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    if (error) {
      return { data, error }
    }
    
    // Create comprehensive profile entry if user was successfully created
    if (data.user) {
      const profileData = {
        id: data.user.id,
        email: email.toLowerCase(),
        full_name: userData.full_name,
        phone: userData.phone || null,
        date_of_birth: userData.date_of_birth || null,
        gender: userData.gender || null,
        is_email_verified: false,
        is_phone_verified: false,
        account_status: 'active'
      }
      
      const profileResult = await supabase
        .from('user_profiles')
        .insert([profileData])
      
      if (profileResult.error) {
        console.error('Profile creation failed:', profileResult.error)
        // Don't fail signup if profile creation fails
      } else {
        console.log('User profile created successfully')
      }
      
      // Create default user preferences
      const preferencesResult = await supabase
        .from('user_preferences')
        .insert([{
          user_id: data.user.id,
          dietary_restrictions: [],
          health_goals: [],
          preferred_brands: [],
          budget_range: { min: 0, max: 10000 },
          notification_preferences: {
            email: true,
            sms: false,
            push: true
          },
          privacy_settings: {
            profile_public: false,
            show_activity: false
          },
          language_preference: 'en',
          currency_preference: 'INR'
        }])
      
      if (preferencesResult.error) {
        console.warn('User preferences creation failed:', preferencesResult.error)
      }
    }
    
    return { data, error }
  } catch (error: any) {
    console.error('SignUp error:', error)
    return { 
      data: null, 
      error: {
        message: error.message || 'Network error. Please check your internet connection and try again.',
        code: error.code || 'network_error'
      }
    }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    // Check if Supabase is properly configured
    if (supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your-anon-key')) {
      return {
        data: null,
        error: {
          message: 'Supabase is not configured. Please connect to Supabase using the "Connect to Supabase" button.',
          code: 'supabase_not_configured'
        }
      }
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      // Handle authentication errors with user-friendly messages
      if (error.message.includes('Invalid login credentials')) {
        return {
          data: null,
          error: {
            message: 'Invalid email or password. Please check your credentials and try again.',
            code: 'invalid_credentials'
          }
        }
      }
      if (error.message.includes('Email not confirmed')) {
        return {
          data: null,
          error: {
            message: 'Please check your email and click the confirmation link before signing in.',
            code: 'email_not_confirmed'
          }
        }
      }
      return { data: null, error }
    }
    
    // Track user session
    if (data.user) {
      await trackUserSession(data.user.id)
    }
    
    return { data, error }
  } catch (error: any) {
    console.error('SignIn error:', error)
    return { 
      data: null, 
      error: {
        message: error.message || 'Network error. Please check your internet connection and try again.',
        code: error.code || 'network_error'
      }
    }
  }
}

// Password reset functionality
export const resetPassword = async (email: string) => {
  try {
    // First check if user exists
    const { data: existingUser, error: userCheckError } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('email', email.toLowerCase())
      .single()
    
    if (userCheckError || !existingUser) {
      return { 
        data: null, 
        error: { 
          message: 'No account found with this email address.',
          code: 'user_not_found'
        }
      }
    }

    // Send password reset email
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

// Update password after reset
export const updatePassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    return { data: null, error }
  }
}

// Track user login session
const trackUserSession = async (userId: string) => {
  try {
    await supabase.from('user_sessions').insert({
      user_id: userId,
      ip_address: await getUserIP(),
      user_agent: navigator.userAgent,
      device_info: {
        platform: navigator.platform,
        language: navigator.language,
        screen: `${screen.width}x${screen.height}`
      }
    })
  } catch (error) {
    console.error('Error tracking session:', error)
  }
}

// Get user IP (simplified)
const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch {
    return 'unknown'
  }
}

export const signOut = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    // Update session as logged out
    if (user) {
      await supabase
        .from('user_sessions')
        .update({ 
          logout_at: new Date().toISOString(),
          is_active: false 
        })
        .eq('user_id', user.id)
        .eq('is_active', true)
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error: any) {
    return { error }
  }
}

// Enhanced profile management
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select(`
      *,
      user_addresses(*),
      user_preferences(*)
    `)
    .eq('id', userId)
    .single()
  return { data, error }
}

export const updateUserProfile = async (userId: string, updates: {
  full_name?: string
  phone?: string
  date_of_birth?: string
  gender?: string
  avatar_url?: string
}) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
  return { data, error }
}

// Address management
export const addUserAddress = async (userId: string, address: {
  address_type: 'shipping' | 'billing' | 'both'
  is_default?: boolean
  full_name: string
  phone: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  country?: string
  landmark?: string
}) => {
  const { data, error } = await supabase
    .from('user_addresses')
    .insert({ user_id: userId, ...address })
  return { data, error }
}

export const getUserAddresses = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
  return { data, error }
}

// User preferences
export const updateUserPreferences = async (userId: string, preferences: {
  dietary_restrictions?: string[]
  health_goals?: string[]
  preferred_brands?: string[]
  budget_range?: { min: number; max: number }
  notification_preferences?: object
  privacy_settings?: object
  language_preference?: string
  currency_preference?: string
}) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({ user_id: userId, ...preferences })
  return { data, error }
}

export const getUserPreferences = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}

// User sessions
export const getUserSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('login_at', { ascending: false })
    .limit(10)
  return { data, error }
}

export const signInDemo = async (email: string, password: string) => {
  try {
    // In demo mode, simulate successful login
    if (supabaseUrl === 'https://demo.supabase.co') {
      return {
        data: {
          user: {
            id: 'demo-user-id',
            email: email,
            user_metadata: { full_name: 'Demo User' }
          },
          session: {
            access_token: 'demo-token',
            user: {
              id: 'demo-user-id',
              email: email
            }
          }
        },
        error: null
      }
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  } catch (err) {
    return { 
      data: null, 
      error: { message: 'Connection failed. Please check your network.' }
    }
  }
}

export const signOutDemo = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Profile management
export const createProfile = async (userId: string, profileData: {
  full_name: string
  phone?: string
}) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        full_name: profileData.full_name,
        phone: profileData.phone
      }
    ])
  return { data, error }
}

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export const updateProfile = async (userId: string, updates: {
  full_name?: string
  phone?: string
  avatar_url?: string
}) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  return { data, error }
}