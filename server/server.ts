import postgres from "postgres";
import * as http from "http";
import getReqData from "./utils";
import * as dotenv from "dotenv";

dotenv.config();

const sql = postgres(process.env.CONNECTION_STRING!, {
  ssl: "prefer",
});

type StudentGrade = {
  student_id: number;
  student_grade: number;
};

const addGrade = async (entry: StudentGrade): Promise<any> => {
  let record;
  try {
    const exists: boolean =
      (
        await sql<
          StudentGrade[]
        >`SELECT id FROM student_grades WHERE id = ${entry.student_id}`
      ).length > 0;
    if (exists) {
      record =
        await sql`UPDATE student_grades SET grade = ${entry.student_grade} WHERE id = ${entry.student_id}`;
    } else {
      record =
        await sql`INSERT INTO student_grades (id, grade) VALUES (${entry.student_id}, ${entry.student_grade})`;
    }
    return Promise.resolve(record);
  } catch (err) {
    console.log(err);
    Promise.reject(err);
  }
};

const getGrades = async (): Promise<any> => {
  try {
    const records = await sql`SELECT * FROM student_grades ORDER BY id`;
    return records;
  } catch (err) {
    console.log(err);
  }
};

const PORT: string | number = process.env.PORT || 8080;

const server = http.createServer(async (req: any, res: any) => {
  const headers: Object = {
    "Access-Control-Allow-Origin": "*" /* @dev First, read about security */,
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT",
    "Access-Control-Max-Age": 2592000, // 30 days
    "Access-Control-Allow-Headers": "*",
    /** add other headers as per requirement */
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  if (req.url == "/api" && req.method == "PUT") {
    let data: any = await getReqData(req);
    const result = await addGrade(JSON.parse(data));
    res.writeHead(200, { ...headers, "Content-Type": "application/json" });
    res.write(JSON.stringify(result));
    res.end();
    return;
  }

  if (req.url == "/api" && req.method == "GET") {
    const result = await getGrades();
    res.writeHead(200, { ...headers, "Content-Type": "application/json" });
    res.write(JSON.stringify(result));
    res.end();
    return;
  }

  res.writeHead(405, headers);
  res.end(`${req.method} is not allowed for the request.`);
});

server.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
