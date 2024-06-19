const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

const cache = {};

function setCache(key, value, ttl) {
    const now = Date.now();
    cache[key] = { value, expiry: now + ttl };
}

function getCache(key) {
    const now = Date.now();
    const cachedItem = cache[key];
    if (!cachedItem) return null;
    if (now > cachedItem.expiry) {
        delete cache[key];
        return null;
    }
    return cachedItem.value;
}

async function getData(dates) {
    try {
        const start = dates.start;
        const end = dates.end;
        const cacheKey = `stats:${start}:${end}`;
        const cacheTTL = 5 * 60 * 1000;

        const cachedData = getCache(cacheKey);
        if (cachedData) return cachedData;

        const pipeline = [];

        // Combine the conditions for undefined and empty string
        if (start && end) {
            pipeline.push({ $match: { updatedAt: { $gte: new Date(start), $lt: new Date(end) } } });
        }

        pipeline.push({
            $facet: {
                count1: [{ $match: { partnerSent: true } }, { $count: "count" }],
                count2: [
                    { $match: { partnerSent: false, partner: "MoneyTap" } },
                    { $count: "count" },
                ],
                count3: [
                    { $match: { partnerSent: true, "accounts.name": "Fibe" } },
                    { $count: "count" },
                ],
                count4: [
                    { $match: { partnerSent: true, "accounts.name": "Zype" } },
                    { $count: "count" },
                ],
                count5: [
                    { $match: { partnerSent: true, "accounts.name": "Cashe" } },
                    { $count: "count" },
                ],
                count6: [
                    {
                        $match: {
                            $expr: {
                                $gt: [
                                    {
                                        $cond: {
                                            if: { $isArray: "$accounts" },
                                            then: { $size: "$accounts" },
                                            else: 0,
                                        },
                                    },
                                    2,
                                ],
                            },
                        },
                    },
                    { $count: "count" },
                ],
            },
        });

        console.log("pipeline")
        console.log(pipeline)
        const result = await User.aggregate(pipeline);
        const formatNumber = (number) => {
            return new Intl.NumberFormat("en-IN").format(number);
        };
        const res = {
            "Total Pushed Leads": formatNumber(result[0].count1[0] ? result[0].count1[0].count : 0),
            "Leads Pending": formatNumber(result[0].count2[0] ? result[0].count2[0].count : 0),
            "Total Fibe Leads": formatNumber(result[0].count3[0] ? result[0].count3[0].count : 0),
            "Total Zype Leads": formatNumber(result[0].count4[0] ? result[0].count4[0].count : 0),
            "Total Cashe Leads": formatNumber(result[0].count5[0] ? result[0].count5[0].count : 0),
            "User with 2+ Accounts": formatNumber(
                result[0].count6[0] ? result[0].count6[0].count : 0,
            ),
        };

        setCache(cacheKey, res, cacheTTL);

        return res;
    } catch (error) {
        console.log("Error:", error);
        return { error: "Error Occurred" };
    }
}

router.post("/stats", async function (req, res) {
    const { dates } = req.body;
    console.log(dates);
    const data = await getData(dates);
    console.log(data);
    res.status(200).json({ data });
});

module.exports = router;
