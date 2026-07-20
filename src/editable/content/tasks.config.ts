import type { TaskKey } from "@/lib/site-config";

export const slot4TaskSupport = {
  article: false,
  classified: false,
  sbm: false,
  profile: false,
  pdf: true,
  listing: true,
  image: false,
} satisfies Record<TaskKey, boolean>;

export const slot4TaskNotes = {
  article: "Field notes archive and article detail backlinks",
  classified: "Notice board pages and detail backlinks",
  sbm: "Saved-shelf pages and detail backlinks",
  profile: "People index pages",
  pdf: "Reference Library shelf and detail backlinks",
  listing: "Local Directory shelf and detail backlinks",
  image: "Image stories and detail backlinks",
} satisfies Record<TaskKey, string>;
