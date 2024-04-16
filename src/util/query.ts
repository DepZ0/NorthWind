import { QueryResult } from "pg";

export function getExecutionTime(response: QueryResult<any>): string | undefined {
  let duration;
  for (let row of response.rows) {
    if (row["QUERY PLAN"].includes("Execution Time: ")) {
      duration = row["QUERY PLAN"].replace("Execution Time: ", "");
      break;
    }
  }
  return duration;
}
