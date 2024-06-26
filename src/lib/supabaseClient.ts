import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://xrzyurtdmpdovnqsuowi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhyenl1cnRkbXBkb3ZucXN1b3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzMDEyODIsImV4cCI6MjAzNDg3NzI4Mn0.VusQZmSt_3ob4iWOonPyupjUWuGeaYeUciMMWHsYueY'
)
