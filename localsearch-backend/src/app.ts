// import express
import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors';
import { BusinessEntry } from './types'
import axios from 'axios'

const app: Application = express()
app.use(cors({
  origin: ['http://localhost:8081']
}));
app.use(express.json());

const endpoint = 'https://storage.googleapis.com/coding-session-rest-api'

const getBusinessEntry = (id: string): Promise<Partial<BusinessEntry>> => {
  return axios.get(`${endpoint}/${id}`)
    .then((response) => {
      return response.data
      const { displayed_what, displayed_where, opening_hours } = response.data
      return { displayed_what, displayed_where, opening_hours }
    })
    .catch((error) => {
      console.error(error)
      throw error
    })
}

// get route
app.get('/business/:id', (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id
  getBusinessEntry(id).then((businessEntry: Partial<BusinessEntry>) => {
    res.send(businessEntry)
  })
})

// listen on port 5050
app.listen(5050, () => {
  console.log('Server running on port 5050')
})