export function corsAllowList() {
  let allowList;

  if (process.env.NODE_ENV === "production") {
    allowList = ["https://www.jobsapp.com", "https://app.jobsapp.com"];
  } else {
    allowList = [
      "http://localhost",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "http://localhost:8000",
      "http://localhost:8080",
    ];
  }
  return allowList;
}
