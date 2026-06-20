export type ExtractionFieldName =
  | "billing_month"
  | "consumption_kwh"
  | "total_amount_rm"
  | "billing_days";

export type ExtractionTelemetryRecord = {
  timestamp: string;
  source: string;
  confidence: number | null;
  missingFields: string[];
  correctedFields: ExtractionFieldName[];
  originalValues: Partial<Record<ExtractionFieldName, string | number | null>>;
  finalValues: Partial<Record<ExtractionFieldName, string | number | null>>;
};

type SourceReliabilitySummary = {
  totalRecords: number;
  correctionRate: number;
  averageConfidence: number | null;
  topCorrectedFields: ExtractionFieldName[];
};

const EXTRACTION_TELEMETRY_KEY = "ek_extraction_telemetry";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function loadExtractionTelemetry(): ExtractionTelemetryRecord[] {
  if (typeof window === "undefined") return [];
  return safeParse<ExtractionTelemetryRecord[]>(
    window.localStorage.getItem(EXTRACTION_TELEMETRY_KEY),
    []
  );
}

export function exportExtractionTelemetryJson() {
  return JSON.stringify(loadExtractionTelemetry(), null, 2);
}

export function saveExtractionTelemetry(record: ExtractionTelemetryRecord) {
  if (typeof window === "undefined") return;
  const existing = loadExtractionTelemetry();
  const updated = [record, ...existing].slice(0, 100);
  window.localStorage.setItem(EXTRACTION_TELEMETRY_KEY, JSON.stringify(updated));
}

export function getSourceReliabilitySummary(source: string): SourceReliabilitySummary | null {
  const sourceRecords = loadExtractionTelemetry().filter((record) => record.source === source);
  if (sourceRecords.length === 0) return null;

  const correctedCount = sourceRecords.filter((record) => record.correctedFields.length > 0).length;
  const fieldCounts = new Map<ExtractionFieldName, number>();
  const confidenceValues = sourceRecords
    .map((record) => record.confidence)
    .filter((value): value is number => typeof value === "number");

  for (const record of sourceRecords) {
    for (const field of record.correctedFields) {
      fieldCounts.set(field, (fieldCounts.get(field) ?? 0) + 1);
    }
  }

  const topCorrectedFields = [...fieldCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([field]) => field);

  return {
    totalRecords: sourceRecords.length,
    correctionRate: correctedCount / sourceRecords.length,
    averageConfidence:
      confidenceValues.length > 0
        ? confidenceValues.reduce((sum, value) => sum + value, 0) / confidenceValues.length
        : null,
    topCorrectedFields,
  };
}

export function getAllSourceReliabilitySummaries() {
  const records = loadExtractionTelemetry();
  const uniqueSources = [...new Set(records.map((record) => record.source))];
  return uniqueSources
    .map((source) => {
      const summary = getSourceReliabilitySummary(source);
      if (!summary) return null;
      return {
        source,
        ...summary,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.totalRecords - a.totalRecords);
}
