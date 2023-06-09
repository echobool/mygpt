export type PkgListType = {
  id: number
  name: string
  genre: string
  created_at: number
  expiry_date: number
  number_use: number
  old_price: number
  price: number
  remarks: string
  state: number
  recommend: number
  sort: number
  gate: number
}


export type UserType = {
  id: number
  nickname: string
  avatar: string
  phone: string
  email: string
  status: number
  agent: AgentType
}


export type AgentType = {
  user_id: number
  balance: number
  real_name: string
  order_id: number
  agent_level: string
  agent_level_name: string
  status: number
  sub_domain: string
  domain: string
  created_at: number
  bank_name: string
  card_no: string
  card_id: string
  card_id_front: string
  card_id_back: string
  logo: string
  site_name: string
  icp: string
  member_num: number
  agent_num:number
  total_revenue:number
  extracted_money:number
  phone: string
}

