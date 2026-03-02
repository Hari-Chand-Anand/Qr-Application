import { z } from "zod";

// Accept either:
// - a tab name (e.g. "DY-4411PSF__SERVICE"), OR
// - a direct CSV URL (gviz/export), OR
// - a Google Sheets tab URL that includes gid=...
const TabOrUrl = z
  .string()
  .trim()
  .min(1, "Service tab name or CSV link is required")
  .max(300)
  .refine(
    (v) => {
      // If it's a URL, it must be a valid URL.
      if (/^https?:\/\//i.test(v)) {
        try {
          // eslint-disable-next-line no-new
          new URL(v);
          return true;
        } catch {
          return false;
        }
      }
      // Otherwise treat as a tab name.
      return true;
    },
    { message: "Must be a valid URL (if you paste a link) or a tab name" }
  );

export const MachineSchema = z.object({
  id: z.string().optional(),
  machineId: z
    .string()
    .trim()
    .min(3, "Machine ID must be at least 3 characters")
    .max(64)
    .regex(/^[a-zA-Z0-9._-]+$/, "Use only letters, numbers, dot, dash, underscore")
    .optional()
    .or(z.literal("")),
  name: z.string().trim().min(2, "Name is required").max(120),
  driveLink: z.string().trim().url("Valid Google Drive link required"),

  // ✅ now supports tab name OR URL
  sheetsLink: TabOrUrl,

  // Optional company assignment
  companyId: z.string().trim().optional().or(z.literal("")),

  whatsappNumber: z.string().trim().optional().or(z.literal("")),
  whatsappTemplate: z.string().trim().optional().or(z.literal("")),
});

export const CompanySchema = z.object({
  id: z.string().optional(),
  code: z
    .string()
    .trim()
    .min(2, "Company code is required")
    .max(32)
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, dash, underscore"),
  name: z.string().trim().min(2, "Company name is required").max(120),

  // Allow Sheet ID or full URL
  sheet: z
    .string()
    .trim()
    .min(10, "Google Sheet ID or URL is required")
    .max(300),
});

export type MachineInput = z.infer<typeof MachineSchema>;
export type CompanyInput = z.infer<typeof CompanySchema>;
