import axios from "axios";
import qnDB from "../dbClass/qnDB.js";

const CF_API = "https://codeforces.com/api/problemset.problems";

class uploadClassController {
    constructor(qnDBInstance) {
        this.qnDB = qnDBInstance;
    }

    async uploadQuestions(req, res) {
        try {
            const { data } = await axios.get(CF_API);

            if (data.status !== "OK") {
                return res.status(500).json({ error: "CF API failed" });
            }

            const problems = data.result.problems;
            const stats = data.result.problemStatistics;

            const solvedMap = {};
            for (const s of stats) {
                solvedMap[`${s.contestId}${s.index}`] = s.solvedCount;
            }

            const maxSolved = Math.max(...stats.map(s => s.solvedCount));

            // 3️⃣ Prepare documents
            const docs = [];

            for (const p of problems) {
                if (!p.contestId || !p.index || !p.rating) continue;

                const id = `${p.contestId}${p.index}`;
                const solvedCount = solvedMap[id] ?? 0;

                docs.push({
                    _id: id,
                    contestId: p.contestId,
                    index: p.index,
                    name: p.name,
                    rating: p.rating,
                    tags: p.tags,
                    solvedCount,
                    url: `https://codeforces.com/contest/${p.contestId}/problem/${p.index}`,
                    popularityScore:
                        Math.log10(solvedCount + 1) / Math.log10(maxSolved + 1),
                    updatedAt: new Date()
                });
            }

            // 4️⃣ Upsert into DB
            await this.qnDB.bulkUpsert(docs);

            return res.status(200).json({
                message: "Questions uploaded successfully",
                count: docs.length
            });

        } catch (err) {
            console.error("Upload error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

export default new uploadClassController(qnDB);
