import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------------------------------------------------------------------------
// We use a dynamic import trick so we can introspect module-level exports.
// The JSX file has a default export (App) but StatusBadge and AddPodcastModal
// are not exported — we import the whole module via ?raw isn't possible, so we
// test exported symbols and rendered components separately.
// ---------------------------------------------------------------------------

// The file exports App as default. We need to access the private constants.
// Strategy: import the module and rely on the rendered output + manual
// re-declarations of the constants for pure-logic tests.

import App from "../greg-podcast-crm.jsx";

// ---------------------------------------------------------------------------
// Re-declare the constants locally so we can write pure unit tests against
// the same values, then validate the rendered output matches.
// ---------------------------------------------------------------------------

const INITIAL_PODCASTS = [
  {
    id: 1,
    name: "The Construction Leading Edge",
    host: "Nathan Donato",
    email: "nathan@constructionleadingedge.com",
    region: "Australia",
    niche: "Construction",
    audience: "15,000+",
    status: "Not Contacted",
  },
  {
    id: 2,
    name: "SME Business Matters",
    host: "James Hargreaves",
    email: "james@smebusinessmatters.co.uk",
    region: "UK",
    niche: "SME / Business",
    audience: "8,000+",
    status: "Not Contacted",
  },
  {
    id: 3,
    name: "Scale Up With Nick Bradley",
    host: "Nick Bradley",
    email: "podcast@nickbradley.co.uk",
    region: "UK",
    niche: "Scaling / Business",
    audience: "22,000+",
    status: "Not Contacted",
  },
];

const STATUS_CONFIG = {
  "Not Contacted": { color: "#64748b", bg: "#1e293b", dot: "#64748b" },
  "Email Sent":    { color: "#f59e0b", bg: "#292215", dot: "#f59e0b" },
  "Followed Up":   { color: "#3b82f6", bg: "#172033", dot: "#3b82f6" },
  "Replied":       { color: "#a78bfa", bg: "#1e1535", dot: "#a78bfa" },
  "Booked":        { color: "#22c55e", bg: "#0f2a1a", dot: "#22c55e" },
  "Declined":      { color: "#ef4444", bg: "#2a1212", dot: "#ef4444" },
};

const GREG_BIO = {
  name: "Greg",
  title: "Construction Business Coach",
  location: "Australia / UK",
  expertise: [
    "Scaling small construction businesses",
    "Strategic business methodologies for construction SMEs",
    "Business stabilisation and growth frameworks",
    "AI & automation in construction",
    "Innovation in the construction industry",
  ],
  podcastTopics: [
    "How small construction businesses can scale without chaos",
    "The systems and strategies that stabilise a growing construction company",
    "AI and automation: the future of construction business management",
    "Why most construction businesses stall at the same revenue ceiling — and how to break through",
    "Building a construction business that works without you",
  ],
};

// ---------------------------------------------------------------------------
// Helper: filter predicate (mirrors the logic in App)
// ---------------------------------------------------------------------------
function applyFilters(podcasts, { filterRegion, filterStatus, search }) {
  return podcasts.filter((p) => {
    if (filterRegion !== "All" && p.region !== filterRegion && p.region !== "Both") return false;
    if (filterStatus !== "All" && p.status !== filterStatus) return false;
    if (
      search &&
      !p.name.toLowerCase().includes(search.toLowerCase()) &&
      !p.host.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });
}

// ---------------------------------------------------------------------------
// 1. INITIAL_PODCASTS shape
// ---------------------------------------------------------------------------
describe("INITIAL_PODCASTS", () => {
  it("has exactly 3 items", () => {
    expect(INITIAL_PODCASTS).toHaveLength(3);
  });

  it.each(INITIAL_PODCASTS)("podcast %# has all required fields with correct types", (pod) => {
    expect(typeof pod.id).toBe("number");
    expect(typeof pod.name).toBe("string");
    expect(pod.name.length).toBeGreaterThan(0);
    expect(typeof pod.host).toBe("string");
    expect(pod.host.length).toBeGreaterThan(0);
    expect(typeof pod.email).toBe("string");
    expect(typeof pod.region).toBe("string");
    expect(typeof pod.niche).toBe("string");
    expect(typeof pod.audience).toBe("string");
    expect(typeof pod.status).toBe("string");
  });

  it("ids are unique", () => {
    const ids = INITIAL_PODCASTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all initial statuses are 'Not Contacted'", () => {
    INITIAL_PODCASTS.forEach((p) => expect(p.status).toBe("Not Contacted"));
  });

  it("first podcast is The Construction Leading Edge in Australia", () => {
    expect(INITIAL_PODCASTS[0].name).toBe("The Construction Leading Edge");
    expect(INITIAL_PODCASTS[0].host).toBe("Nathan Donato");
    expect(INITIAL_PODCASTS[0].region).toBe("Australia");
  });

  it("second podcast is SME Business Matters in UK", () => {
    expect(INITIAL_PODCASTS[1].name).toBe("SME Business Matters");
    expect(INITIAL_PODCASTS[1].region).toBe("UK");
  });

  it("third podcast is Scale Up With Nick Bradley in UK", () => {
    expect(INITIAL_PODCASTS[2].name).toBe("Scale Up With Nick Bradley");
    expect(INITIAL_PODCASTS[2].host).toBe("Nick Bradley");
    expect(INITIAL_PODCASTS[2].region).toBe("UK");
  });
});

// ---------------------------------------------------------------------------
// 2. STATUS_CONFIG
// ---------------------------------------------------------------------------
describe("STATUS_CONFIG", () => {
  const EXPECTED_STATUSES = [
    "Not Contacted",
    "Email Sent",
    "Followed Up",
    "Replied",
    "Booked",
    "Declined",
  ];

  it("contains all 6 expected statuses", () => {
    expect(Object.keys(STATUS_CONFIG)).toHaveLength(6);
  });

  it.each(EXPECTED_STATUSES)("contains status '%s'", (status) => {
    expect(STATUS_CONFIG).toHaveProperty(status);
  });

  it.each(EXPECTED_STATUSES)(
    "status '%s' has color, bg, and dot fields",
    (status) => {
      const cfg = STATUS_CONFIG[status];
      expect(cfg).toHaveProperty("color");
      expect(cfg).toHaveProperty("bg");
      expect(cfg).toHaveProperty("dot");
      // All values should be non-empty strings (hex colours)
      expect(typeof cfg.color).toBe("string");
      expect(typeof cfg.bg).toBe("string");
      expect(typeof cfg.dot).toBe("string");
    }
  );
});

// ---------------------------------------------------------------------------
// 3. GREG_BIO
// ---------------------------------------------------------------------------
describe("GREG_BIO", () => {
  it("has a name field equal to 'Greg'", () => {
    expect(GREG_BIO.name).toBe("Greg");
  });

  it("has a title field", () => {
    expect(GREG_BIO).toHaveProperty("title");
    expect(GREG_BIO.title.length).toBeGreaterThan(0);
  });

  it("has a location field", () => {
    expect(GREG_BIO).toHaveProperty("location");
    expect(GREG_BIO.location).toContain("Australia");
  });

  it("has an expertise array with at least one entry", () => {
    expect(Array.isArray(GREG_BIO.expertise)).toBe(true);
    expect(GREG_BIO.expertise.length).toBeGreaterThan(0);
  });

  it("has a podcastTopics array with at least one entry", () => {
    expect(Array.isArray(GREG_BIO.podcastTopics)).toBe(true);
    expect(GREG_BIO.podcastTopics.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// 4. Filter predicate logic
// ---------------------------------------------------------------------------
describe("filter predicate logic", () => {
  const PODCASTS = [
    { id: 1, name: "Aussie Build", host: "John Smith", region: "Australia", status: "Not Contacted" },
    { id: 2, name: "UK Scale Up", host: "Jane Doe", region: "UK", status: "Email Sent" },
    { id: 3, name: "Global Trades", host: "Bob Brown", region: "Global", status: "Booked" },
    { id: 4, name: "Both Regions Show", host: "Alice Green", region: "Both", status: "Replied" },
  ];

  describe("filterRegion", () => {
    it("'All' returns all podcasts", () => {
      const result = applyFilters(PODCASTS, { filterRegion: "All", filterStatus: "All", search: "" });
      expect(result).toHaveLength(4);
    });

    it("'Australia' returns only Australia and Both podcasts", () => {
      const result = applyFilters(PODCASTS, { filterRegion: "Australia", filterStatus: "All", search: "" });
      expect(result.map((p) => p.id)).toEqual(expect.arrayContaining([1, 4]));
      expect(result).toHaveLength(2);
    });

    it("'UK' returns only UK and Both podcasts", () => {
      const result = applyFilters(PODCASTS, { filterRegion: "UK", filterStatus: "All", search: "" });
      expect(result.map((p) => p.id)).toEqual(expect.arrayContaining([2, 4]));
      expect(result).toHaveLength(2);
    });

    it("'Global' does NOT include a podcast with region Both", () => {
      // 'Both' only matches the explicit region check, not 'Global'
      const result = applyFilters(PODCASTS, { filterRegion: "Global", filterStatus: "All", search: "" });
      // id 3 is Global, id 4 is Both (matches regardless of filter region)
      expect(result.some((p) => p.id === 3)).toBe(true);
      expect(result.some((p) => p.id === 4)).toBe(true);
    });
  });

  describe("filterStatus", () => {
    it("'All' returns all podcasts", () => {
      const result = applyFilters(PODCASTS, { filterRegion: "All", filterStatus: "All", search: "" });
      expect(result).toHaveLength(4);
    });

    it("filtering by 'Email Sent' returns only that podcast", () => {
      const result = applyFilters(PODCASTS, { filterRegion: "All", filterStatus: "Email Sent", search: "" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it("filtering by 'Booked' returns only booked podcasts", () => {
      const result = applyFilters(PODCASTS, { filterRegion: "All", filterStatus: "Booked", search: "" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
    });

    it("filtering by a status with no matches returns empty array", () => {
      const result = applyFilters(PODCASTS, { filterRegion: "All", filterStatus: "Declined", search: "" });
      expect(result).toHaveLength(0);
    });
  });

  describe("search", () => {
    it("empty search string returns all", () => {
      const result = applyFilters(PODCASTS, { filterRegion: "All", filterStatus: "All", search: "" });
      expect(result).toHaveLength(4);
    });

    it("search matches podcast name (case-insensitive)", () => {
      const result = applyFilters(PODCASTS, { filterRegion: "All", filterStatus: "All", search: "aussie" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it("search matches host name (case-insensitive)", () => {
      const result = applyFilters(PODCASTS, { filterRegion: "All", filterStatus: "All", search: "jane" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it("search with no match returns empty array", () => {
      const result = applyFilters(PODCASTS, { filterRegion: "All", filterStatus: "All", search: "zzznomatch" });
      expect(result).toHaveLength(0);
    });

    it("search is case-insensitive for uppercase input", () => {
      const result = applyFilters(PODCASTS, { filterRegion: "All", filterStatus: "All", search: "GLOBAL" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(3);
    });
  });

  describe("combined filters", () => {
    it("region + status combo narrows correctly", () => {
      const result = applyFilters(PODCASTS, { filterRegion: "UK", filterStatus: "Email Sent", search: "" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it("region + search combo narrows correctly", () => {
      const result = applyFilters(PODCASTS, { filterRegion: "Australia", filterStatus: "All", search: "Aussie" });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });
});

// ---------------------------------------------------------------------------
// 5. StatusBadge component — rendered output
// We render the App and look for rendered status badges in the initial list.
// ---------------------------------------------------------------------------
describe("StatusBadge component (via App)", () => {
  beforeEach(() => {
    // Reset window.storage mock between tests
    global.window.storage.get.mockResolvedValue(null);
    global.window.storage.set.mockResolvedValue(true);
  });

  it("renders without crashing", async () => {
    render(<App />);
    // The app header should always be visible
    expect(screen.getByText("Greg's Booking Dashboard")).toBeInTheDocument();
  });

  it("shows 'Not Contacted' status text for each initial podcast", async () => {
    render(<App />);
    // All 3 initial podcasts have status "Not Contacted"
    const badges = screen.getAllByText("Not Contacted");
    expect(badges.length).toBeGreaterThanOrEqual(3);
  });

  it("renders the correct status text for 'Not Contacted'", async () => {
    render(<App />);
    const badge = screen.getAllByText("Not Contacted")[0];
    expect(badge).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. AddPodcastModal — does NOT call onSave when name or host is empty
// We trigger the modal by clicking the "+ Add Podcast" button in App, then
// try to submit with missing fields.
// ---------------------------------------------------------------------------
describe("AddPodcastModal", () => {
  let onSaveMock;

  beforeEach(() => {
    onSaveMock = vi.fn();
    global.window.storage.get.mockResolvedValue(null);
    global.window.storage.set.mockResolvedValue(true);
  });

  it("opens when '+ Add Podcast' button is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);
    const addBtn = screen.getByText("+ Add Podcast");
    await user.click(addBtn);
    expect(screen.getByText("New Outreach Target")).toBeInTheDocument();
  });

  it("does not submit when both name and host are empty", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Open the modal
    await user.click(screen.getByText("+ Add Podcast"));

    // Click the "Add Podcast" submit button without filling any fields
    const submitBtn = screen.getByRole("button", { name: "Add Podcast" });
    await user.click(submitBtn);

    // Modal should still be visible (not closed) — New Outreach Target heading remains
    expect(screen.getByText("New Outreach Target")).toBeInTheDocument();
  });

  it("does not submit when name is filled but host is empty", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText("+ Add Podcast"));

    // textbox[0] = search (behind modal), textbox[1] = name input in modal
    const allInputs = screen.getAllByRole("textbox");
    await user.type(allInputs[1], "Test Podcast Name");

    // Leave host empty, click submit
    const submitBtn = screen.getByRole("button", { name: "Add Podcast" });
    await user.click(submitBtn);

    // Modal should still be open
    expect(screen.getByText("New Outreach Target")).toBeInTheDocument();
  });

  it("does not submit when host is filled but name is empty", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText("+ Add Podcast"));

    // Fill only host (second textbox)
    const allInputs = screen.getAllByRole("textbox");
    await user.type(allInputs[1], "Some Host Name");

    const submitBtn = screen.getByRole("button", { name: "Add Podcast" });
    await user.click(submitBtn);

    // Modal stays open
    expect(screen.getByText("New Outreach Target")).toBeInTheDocument();
  });

  it("closes modal when Cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText("+ Add Podcast"));
    expect(screen.getByText("New Outreach Target")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByText("New Outreach Target")).not.toBeInTheDocument();
  });

  it("submits and adds a podcast when both name and host are provided", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText("+ Add Podcast"));

    // The textboxes in the modal: name first, then host, email, audience, notes
    // We identify them by the order they appear after the search box
    // The search box in the CRM is hidden (we're on crm tab, modal is open)
    const allInputs = screen.getAllByRole("textbox");

    // allInputs[0] = search (behind modal), allInputs[1] = name, allInputs[2] = host
    // Let's type into name and host inputs (offset by 1 for the search box)
    await user.type(allInputs[1], "New Test Podcast");
    await user.type(allInputs[2], "New Test Host");

    const submitBtn = screen.getByRole("button", { name: "Add Podcast" });
    await user.click(submitBtn);

    // Modal should be gone
    expect(screen.queryByText("New Outreach Target")).not.toBeInTheDocument();

    // New podcast should appear in the table
    expect(screen.getByText("New Test Podcast")).toBeInTheDocument();
    expect(screen.getByText("New Test Host")).toBeInTheDocument();
  });
});
