/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre customer feedback API for the customer feedback reports
 */

"use strict";

const express = require("express");
const { mongo } = require("../../../utils/mongo");
const createError = require("http-errors");

const router = express.Router();

/**
 * GET /reports/customer-feedback/by-product
 *
 * Returns customer feedback aggregated by product.
 *
 * Response example:
 * [
 *   { product: "Internet", responses: 42, avgRating: 4.21 },
 *   { product: "Mobile", responses: 18, avgRating: 3.78 }
 * ]
 */
router.get("/by-product", (req, res, next) => {
  try {
    mongo(async (db) => {
      const collection = db.collection("customerFeedback");

      const results = await collection
        .aggregate([
          {
            $match: {
              product: { $exists: true, $ne: null, $ne: "" },
              rating: { $exists: true, $ne: null },
            },
          },
          {
            $group: {
              _id: "$product",
              responses: { $sum: 1 },
              avgRating: { $avg: "$rating" },
            },
          },
          {
            $project: {
              _id: 0,
              product: "$_id",
              responses: 1,
              avgRating: { $round: ["$avgRating", 2] },
            },
          },
          { $sort: { responses: -1, product: 1 } },
        ])
        .toArray();

      res.send(results);
    }, next);
  } catch (err) {
    console.error("Error getting customer feedback by product:", err);
    next(createError(500, "Unable to fetch customer feedback by product"));
  }
});

module.exports = router;
