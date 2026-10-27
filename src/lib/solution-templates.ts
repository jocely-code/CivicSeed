/**
 * CivicSeed — rule-based solution templates.
 *
 * Given a project category and problem description, produces three
 * draft solution approaches. Each is labeled a "starting point that
 * requires research" — the student must edit and justify their choice.
 *
 * Pure, deterministic, no side effects.
 */

import type { Category, SolutionOption, Difficulty } from "./types";

/** A rule-based template that maps to a SolutionOption. */
interface SolutionTemplate {
  category: Category | "all";
  // Returns true if this template applies to the given project.
  matches: (p: { category: Category | ""; description: string }) => boolean;
  title: string;
  action: string;
  benefits: string;
  limitations: string;
  difficulty: Difficulty;
  unintended: string;
}

/** All templates. The "all" category entries apply regardless of category. */
const TEMPLATES: SolutionTemplate[] = [
  // --- School -------------------------------------------------------
  {
    category: "School",
    matches: (p) => p.category === "School",
    title: "Add an express or fast lane",
    action:
      "Open a second service line for students with simple orders (e.g. pre-packed meals) to split traffic.",
    benefits: "Reduces wait time for the largest group of students with minimal new staffing.",
    limitations: "Doesn't help students with complex orders; needs extra counter space.",
    difficulty: "Medium",
    unintended:
      "Students in the regular line may feel the express line is unfair if eligibility isn't clear.",
  },
  {
    category: "School",
    matches: (p) => p.category === "School",
    title: "Stagger lunch periods by grade",
    action:
      "Release grades to lunch in rotating waves so not all students arrive at the line at once.",
    benefits: "Spreads demand evenly across the lunch period; no construction needed.",
    limitations: "Requires changing the bell schedule and coordinating with teachers.",
    difficulty: "Low",
    unintended:
      "Some students may get lunch unusually early or late, affecting after-class focus.",
  },
  {
    category: "School",
    matches: (p) => p.category === "School",
    title: "Pre-order lunch via classroom sign-up",
    action:
      "Students submit lunch orders in homeroom; kitchen pre-assembles meals for faster pickup.",
    benefits: "Cuts line time to near zero for participants; improves order accuracy.",
    limitations: "Needs daily sign-up discipline and kitchen prep lead time.",
    difficulty: "High",
    unintended:
      "Students who forget to sign up may still face long waits at pickup.",
  },

  // --- Accessibility -------------------------------------------------
  {
    category: "Accessibility",
    matches: (p) => p.category === "Accessibility",
    title: "Install automatic door openers",
    action:
      "Add motion-sensor or push-button automatic openers to main building entrances.",
    benefits: "Students using wheelchairs, crutches, or carrying trays can enter independently.",
    limitations: "Requires electrical work and vendor installation.",
    difficulty: "High",
    unintended:
      "Sensor malfunctions could temporarily block access until repaired.",
  },
  {
    category: "Accessibility",
    matches: (p) => p.category === "Accessibility",
    title: "Add curb cuts and tactile paving",
    action:
      "Install curb cuts at crosswalks and tactile warning surfaces at transit stops near school.",
    benefits: "Improves safe, independent travel for students with mobility or visual impairments.",
    limitations: "Involves city permits and sidewalk construction timelines.",
    difficulty: "High",
    unintended:
      "Construction may temporarily reroute foot traffic during installation.",
  },
  {
    category: "Accessibility",
    matches: (p) => p.category === "Accessibility",
    title: "Provide adjustable-height desks in classrooms",
    action:
      "Replace fixed desks with height-adjustable options in high-use classrooms.",
    benefits: "Accommodates students of different heights and mobility needs without stigma.",
    limitations: "Higher per-unit cost than standard desks.",
    difficulty: "Medium",
    unintended:
      "Adjustable mechanisms may need more maintenance over time.",
  },

  // --- Public Health -------------------------------------------------
  {
    category: "Public Health",
    matches: (p) => p.category === "Public Health",
    title: "Install water bottle refill stations",
    action:
      "Replace or augment water fountains with bottle-refill stations in hallways and cafeteria.",
    benefits: "Encourages hydration and reduces single-use plastic waste.",
    limitations: "Requires plumbing access and filter maintenance budget.",
    difficulty: "Medium",
    unintended:
      "Stations may cluster use at peak passing periods if poorly placed.",
  },
  {
    category: "Public Health",
    matches: (p) => p.category === "Public Health",
    title: "Add hand-sanitizing stations at entry points",
    action:
      "Place touchless sanitizer dispensers at cafeteria entrances and high-traffic hallways.",
    benefits: "Reduces germ transmission during cold and flu season.",
    limitations: "Needs regular refilling; not a substitute for handwashing.",
    difficulty: "Low",
    unintended:
      "Over-reliance on sanitizer could reduce handwashing with soap and water.",
  },
  {
    category: "Public Health",
    matches: (p) => p.category === "Public Health",
    title: "Launch a student peer-health ambassador program",
    action:
      "Train student volunteers to share health information and refer peers to counseling services.",
    benefits: "Students may be more receptive to health messaging from peers.",
    limitations: "Requires adult supervision, training time, and confidentiality protocols.",
    difficulty: "Medium",
    unintended:
      "Ambassadors could feel overburdened if not given clear boundaries.",
  },

  // --- Environment ---------------------------------------------------
  {
    category: "Environment",
    matches: (p) => p.category === "Environment",
    title: "Set up cafeteria compost and recycling stations",
    action:
      "Provide clearly labeled bins for compost, recycling, and landfill with student monitors.",
    benefits: "Diverts waste from landfill and builds sorting habits school-wide.",
    limitations: "Needs custodial buy-in and ongoing student education.",
    difficulty: "Medium",
    unintended:
      "Contamination of compost/recycling streams if signage is unclear.",
  },
  {
    category: "Environment",
    matches: (p) => p.category === "Environment",
    title: "Plant a native pollinator garden on campus",
    action:
      "Convert an underused lawn area into a garden with native flowering plants.",
    benefits: "Supports local pollinators and provides an outdoor learning space.",
    limitations: "Requires watering, weeding, and summer maintenance plan.",
    difficulty: "Medium",
    unintended:
      "Garden may attract bees/wasps near high-traffic areas if sited poorly.",
  },
  {
    category: "Environment",
    matches: (p) => p.category === "Environment",
    title: "Switch to reusable foodware in cafeteria",
    action:
      "Replace disposable trays and cutlery with washable reusables and a dishwashing routine.",
    benefits: "Eliminates single-use waste from daily lunch service.",
    limitations: "Needs dishwashing capacity, storage, and breakage replacement budget.",
    difficulty: "High",
    unintended:
      "Reusables could go missing, creating ongoing replacement costs.",
  },

  // --- Transportation -------------------------------------------------
  {
    category: "Transportation",
    matches: (p) => p.category === "Transportation",
    title: "Add a walking school bus route",
    action:
      "Organize supervised groups of students walking to school along set routes and times.",
    benefits: "Reduces car traffic at drop-off and increases daily physical activity.",
    limitations: "Needs adult volunteers and safe route planning.",
    difficulty: "Medium",
    unintended:
      "Late students may miss the walking group and still arrive by car.",
  },
  {
    category: "Transportation",
    matches: (p) => p.category === "Transportation",
    title: "Install bike racks and a bike-repair station",
    action:
      "Add secure covered bike parking and basic repair tools near the main entrance.",
    benefits: "Makes biking a safer, more practical option for students.",
    limitations: "Requires space and may need lighting/security measures.",
    difficulty: "Medium",
    unintended:
      "More bikes on campus could increase congestion at entry points.",
  },
  {
    category: "Transportation",
    matches: (p) => p.category === "Transportation",
    title: "Request a student bus-pass subsidy program",
    action:
      "Partner with the transit agency to offer discounted or free passes to students.",
    benefits: "Lowers cost barrier to using public transit for school trips.",
    limitations: "Depends on transit agency agreement and funding source.",
    difficulty: "High",
    unintended:
      "Subsidy may not cover all routes or times students need.",
  },

  // --- Youth Services -------------------------------------------------
  {
    category: "Youth Services",
    matches: (p) => p.category === "Youth Services",
    title: "Open an after-school drop-in center",
    action:
      "Designate a supervised room with snacks, homework help, and activities after school.",
    benefits: "Gives students a safe place to go instead of unsupervised time.",
    limitations: "Needs staffing, space, and funding for snacks and supplies.",
    difficulty: "High",
    unintended:
      "Drop-in use may concentrate students who need different kinds of support.",
  },
  {
    category: "Youth Services",
    matches: (p) => p.category === "Youth Services",
    title: "Create a peer mentorship program",
    action:
      "Pair older students with younger students for weekly check-ins and academic help.",
    benefits: "Builds connection and leadership for both mentors and mentees.",
    limitations: "Requires coordinator time, training, and matching process.",
    difficulty: "Medium",
    unintended:
      "Mismatched pairs could reduce engagement if not monitored.",
  },
  {
    category: "Youth Services",
    matches: (p) => p.category === "Youth Services",
    title: "Expand free meal programs to weekends",
    action:
      "Partner with a local food bank or nonprofit to provide weekend meal kits.",
    benefits: "Closes the nutrition gap when school meals aren't available.",
    limitations: "Depends on external partner capacity and food safety rules.",
    difficulty: "High",
    unintended:
      "Distribution logistics could create stigma if not handled discreetly.",
  },

  // --- Other / fallback ----------------------------------------------
  {
    category: "all",
    matches: () => true,
    title: "Form a student-led advisory committee",
    action:
      "Convene students, staff, and administrators to meet monthly and recommend changes.",
    benefits: "Builds student ownership and surfaces ideas adults might miss.",
    limitations: "Recommendations aren't binding; needs administrator sponsorship.",
    difficulty: "Low",
    unintended:
      "Committee could lose momentum if meetings feel like they go nowhere.",
  },
  {
    category: "all",
    matches: () => true,
    title: "Launch a pilot program before scaling",
    action:
      "Test the chosen idea with one class, grade, or hallway for one term before expanding.",
    benefits: "Limits risk and lets you measure impact before full rollout.",
    limitations: "Slower than a school-wide launch; needs evaluation plan.",
    difficulty: "Low",
    unintended:
      "Students not in the pilot may feel left out or unfairly treated.",
  },
  {
    category: "all",
    matches: () => true,
    title: "Survey affected users to refine the problem",
    action:
      "Distribute an anonymous survey to students and staff to gather more data before deciding.",
    benefits: "Grounds the proposal in real evidence rather than assumptions.",
    limitations: "Takes time to design, distribute, and analyze results.",
    difficulty: "Low",
    unintended:
      "Low response rates could skew the data toward the most vocal voices.",
  },
];

/**
 * Produce three draft solution options for the given category and description.
 * Always returns exactly three options (falls back to generic templates).
 */
export function suggestSolutions(
  category: Category | "",
  description: string
): SolutionOption[] {
  const matches = TEMPLATES.filter((t) =>
    t.matches({ category: category as Category, description })
  );

  // Prefer category-specific templates, then generic "all" templates.
  const specific = matches.filter((t) => t.category !== "all");
  const generic = matches.filter((t) => t.category === "all");

  const selected = [
    ...specific.slice(0, 2),
    ...generic.slice(0, 3 - specific.slice(0, 2).length),
  ];

  return selected.map((t, index) => ({
    id: crypto.randomUUID(),
    templateId: t.title,
    title: t.title,
    action: t.action,
    benefits: t.benefits,
    limitations: t.limitations,
    difficulty: t.difficulty,
    unintended: t.unintended,
    selected: index === 0, // pre-select the first option
    whyChosen: "",
    userEdited: false,
  }));
}
