export type Stop = {
  venue: string
  activity: string
  duration_mins: number
}

export type Plan = {
  id: string
  area: string
  vibe: 'chill' | 'active' | 'foodie' | 'adventurous'
  group_size_min: number
  group_size_max: number
  title: string
  hook: string
  stops: Stop[]
  cost_per_person: number
  claimed_by: string | null
  claimed_at: string | null
}