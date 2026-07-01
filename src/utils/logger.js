import { getToken } from "../services/notificationService";

export async function Log(stack, level, packageName, message) {
  console.log("Sending log...");

  try {
    const token = getToken();
    const response = await fetch(
      "/evaluation-service/logs",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stack,
          level,
          package: packageName,
          message,
        }),
      }
    );

    console.log("Status:", response.status);

    const data = await response.text();
    console.log(data);

    return data;
  } catch (err) {
    console.error("Logging failed:", err);
  }
}