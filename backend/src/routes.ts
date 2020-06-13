import express from 'express'

import multer from 'multer'
import multerConfig from './config/multer'

import ItemController from './controller/ItemController'
import PointController from './controller/PointController'

const routes = express.Router()
const upload = multer(multerConfig)

routes.get('/items', ItemController.index)

routes.post('/points', upload.single('image'), PointController.create)
routes.get('/points', PointController.index)
routes.get('/points/:id', PointController.show)

export default routes
