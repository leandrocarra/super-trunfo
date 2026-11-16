export type HealthResponse = {
  status: string;
  service: string;
};

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";
}

function isHealthResponse(value: unknown): value is HealthResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    "service" in value &&
    typeof value.status === "string" &&
    typeof value.service === "string"
  );
}

export async function getHealth(): Promise<HealthResponse | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/health`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data: unknown = await response.json();
    return isHealthResponse(data) ? data : null;
  } catch {
    return null;
  }
}
