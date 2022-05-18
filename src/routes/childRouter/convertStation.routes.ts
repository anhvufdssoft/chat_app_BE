import { Request, Response } from 'express';

export class ConverStationRoutes {
  public routes(app): void {
    app.route('/saveConvertStation').get((req: Request, res: Response) => {
      res.status(200).send({
        message: 'Get List Success',
      });
    });
  }
}

// const { Router } = require('express');
// const { ConvertStation } = require('../models/convertStationModel');
// const convertStationRouter = Router();
// const {
//   postSaveConverStation,
// } = require('../controllers/convertStation.controller');
// const {
//   getConverStationByUserId,
// } = require('../middlewares/messages/converStation.middleware');

// convertStationRouter.post(
//   '/saveConvertStation',
//   getConverStationByUserId(ConvertStation),
//   postSaveConverStation,
// );

// module.exports = {
//   convertStationRouter,
// };
