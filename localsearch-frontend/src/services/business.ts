import { BusinessEntry } from "@/types";
import axios from "axios";

const endpoint = 'http://localhost:5050/business'

export function getBusiness(businessId: string): Promise<BusinessEntry> {
  return axios.get(`${endpoint}/${businessId}`).then(res => res.data)
}