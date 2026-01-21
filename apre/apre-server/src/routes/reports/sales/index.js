/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre sales report API for the sales reports
 */

<<<<<<< HEAD
"use strict";

const express = require("express");
const { mongo } = require("../../../utils/mongo");
=======
'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');
>>>>>>> 4a157f7b7cdbe68441b146a79284a2c913eddb3c

const router = express.Router();

/**
 * @description
 *
 * GET /regions
 *
 * Fetches a list of distinct sales regions.
 *
 * Example:
 * fetch('/regions')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
<<<<<<< HEAD
router.get("/regions", (req, res, next) => {
  try {
    mongo(async (db) => {
      const regions = await db.collection("sales").distinct("region");
      res.send(regions);
    }, next);
  } catch (err) {
    console.error("Error getting regions: ", err);
=======
router.get('/regions', (req, res, next) => {
  try {
    mongo (async db => {
      const regions = await db.collection('sales').distinct('region');
      res.send(regions);
    }, next);
  } catch (err) {
    console.error('Error getting regions: ', err);
>>>>>>> 4a157f7b7cdbe68441b146a79284a2c913eddb3c
    next(err);
  }
});

/**
 * @description
 *
 * GET /regions/:region
 *
 * Fetches sales data for a specific region, grouped by salesperson.
 *
 * Example:
 * fetch('/regions/north')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
<<<<<<< HEAD
router.get("/regions/:region", (req, res, next) => {
  try {
    mongo(async (db) => {
      const salesReportByRegion = await db
        .collection("sales")
        .aggregate([
          { $match: { region: req.params.region } },
          {
            $group: {
              _id: "$salesperson",
              totalSales: { $sum: "$amount" },
            },
          },
          {
            $project: {
              _id: 0,
              salesperson: "$_id",
              totalSales: 1,
            },
          },
          {
            $sort: { salesperson: 1 },
          },
        ])
        .toArray();
      res.send(salesReportByRegion);
    }, next);
  } catch (err) {
    console.error("Error getting sales data for region: ", err);
=======
router.get('/regions/:region', (req, res, next) => {
  try {
    mongo (async db => {
      const salesReportByRegion = await db.collection('sales').aggregate([
        { $match: { region: req.params.region } },
        {
          $group: {
            _id: '$salesperson',
            totalSales: { $sum: '$amount'}
          }
        },
        {
          $project: {
            _id: 0,
            salesperson: '$_id',
            totalSales: 1
          }
        },
        {
          $sort: { salesperson: 1 }
        }
      ]).toArray();
      res.send(salesReportByRegion);
    }, next);
  } catch (err) {
    console.error('Error getting sales data for region: ', err);
>>>>>>> 4a157f7b7cdbe68441b146a79284a2c913eddb3c
    next(err);
  }
});

<<<<<<< HEAD
/**
 * GET /monthly
 * Returns monthly sales totals (and order counts) grouped by month.
 * Output example: [{ month: "2026-01", total: 12345, orders: 18 }]
 */
router.get("/monthly", (req, res, next) => {
  try {
    mongo(async (db) => {
      const DATE_FIELD = "date";
      const AMOUNT_FIELD = "amount";

      const pipeline = [
        // only docs with a valid date
        {
          $match: {
            [DATE_FIELD]: { $type: "date" },
          },
        },
        // group by calendar month (YYYY-MM)
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: `$${DATE_FIELD}` },
            },
            total: { $sum: `$${AMOUNT_FIELD}` },
            orders: { $sum: 1 },
          },
        },
        { $project: { _id: 0, month: "$_id", total: 1, orders: 1 } },
        { $sort: { month: 1 } },
      ];

      const results = await db
        .collection("sales")
        .aggregate(pipeline)
        .toArray();
      res.json(results);
    }, next);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
=======
module.exports = router;
>>>>>>> 4a157f7b7cdbe68441b146a79284a2c913eddb3c
