/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre agent performance API for the agent performance reports
 */

"use strict";

const express = require("express");
const { mongo } = require("../../../utils/mongo");
const createError = require("http-errors");

const router = express.Router();

/**
 * @description
 *
 * GET /call-duration-by-date-range
 *
 * Fetches call duration data for agents within a specified date range.
 *
 * Example:
 * fetch('/call-duration-by-date-range?startDate=2023-01-01&endDate=2023-01-31')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get("/call-duration-by-date-range", (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return next(createError(400, "Start date and end date are required"));
    }

    console.log(
      "Fetching call duration report for date range:",
      startDate,
      endDate,
    );

    mongo(async (db) => {
      const data = await db
        .collection("agentPerformance")
        .aggregate([
          {
            $match: {
              date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
              },
            },
          },
          {
            $lookup: {
              from: "agents",
              localField: "agentId",
              foreignField: "agentId",
              as: "agentDetails",
            },
          },
          {
            $unwind: "$agentDetails",
          },
          {
            $group: {
              _id: "$agentDetails.name",
              totalCallDuration: { $sum: "$callDuration" },
            },
          },
          {
            $project: {
              _id: 0,
              agent: "$_id",
              callDuration: "$totalCallDuration",
            },
          },
          {
            $group: {
              _id: null,
              agents: { $push: "$agent" },
              callDurations: { $push: "$callDuration" },
            },
          },
          {
            $project: {
              _id: 0,
              agents: 1,
              callDurations: 1,
            },
          },
        ])
        .toArray();

      res.send(data);
    }, next);
  } catch (err) {
    console.error("Error in /call-duration-by-date-range", err);
    next(err);
  }
});

/**
 * GET /api/reports/agent-performance/teams
 * Returns distinct team names
 */
router.get("/teams", (req, res, next) => {
  try {
    mongo(async (db) => {
      const teams = await db.collection("agentPerformance").distinct("team");
      res.send(teams);
    }, next);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/reports/agent-performance/metrics
 * Returns distinct metric types (e.g., Customer Satisfaction, Sales Conversion)
 */
router.get("/metrics", (req, res, next) => {
  try {
    mongo(async (db) => {
      const metricTypes = await db
        .collection("agentPerformance")
        .distinct("performanceMetrics.metricType");
      res.send(metricTypes);
    }, next);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/reports/agent-performance/teams/:team
 *
 * Returns: [{ agent: "1023", score: 85 }]
 * - If metricType is provided: avg value for that metric per agentId
 * - If not provided: avg across ALL metrics per agentId
 */
router.get("/teams/:team", (req, res, next) => {
  try {
    const teamParam = req.params.team;
    const metricType = req.query.metricType;

    mongo(async (db) => {
      const pipeline = [
        // match team (case/space safe)
        {
          $match: {
            $expr: {
              $eq: [
                { $toLower: { $trim: { input: "$team" } } },
                { $toLower: { $trim: { input: teamParam } } },
              ],
            },
          },
        },
        // expand metrics array
        { $unwind: "$performanceMetrics" },
      ];

      // If user selected a metric type, filter to it
      if (metricType) {
        pipeline.push({
          $match: {
            $expr: {
              $eq: [
                {
                  $toLower: {
                    $trim: { input: "$performanceMetrics.metricType" },
                  },
                },
                { $toLower: { $trim: { input: metricType } } },
              ],
            },
          },
        });
      }

      // group per agentId
      pipeline.push(
        {
          $group: {
            _id: "$agentId",
            score: { $avg: "$performanceMetrics.value" },
          },
        },
        {
          $project: {
            _id: 0,
            agent: { $toString: "$_id" },
            score: { $round: ["$score", 2] },
          },
        },
        { $sort: { score: -1 } },
      );

      const rows = await db
        .collection("agentPerformance")
        .aggregate(pipeline)
        .toArray();
      res.send(rows);
    }, next);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
