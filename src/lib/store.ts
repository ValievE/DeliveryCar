import { reactive } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'

export const store = {
  state: reactive({
    user: {} as User
  })
}
