import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Daily: delete uploaded files older than 24h that aren't attached to a lead.
crons.daily(
  "delete orphaned uploads",
  { hourUTC: 2, minuteUTC: 0 },
  internal.waitlist.cleanupOrphanFiles,
  {}
);

export default crons;
