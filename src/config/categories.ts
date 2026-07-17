/**
 * Category Configuration — Single Source of Truth
 * 
 * All categories are centrally defined here.
 * The UI renders categories dynamically from this configuration.
 * To add a new category, simply add an entry to this array.
 * No code changes required anywhere else in the application.
 */

export interface CategoryConfig {
  id: string;
  slug: string;
  displayName: string;
  description: string;
  icon: string;
  accentColor: string;
  gradient: string;
  sortOrder: number;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "cat-chrome-extension",
    slug: "chrome-extension",
    displayName: "Chrome Extension",
    description: "Browser extensions used to improve productivity and daily workflow.",
    icon: "🌐",
    accentColor: "#FF6FB5",
    gradient: "linear-gradient(135deg, #FF6FB5 0%, #FF9ED2 100%)",
    sortOrder: 1,
  },
  {
    id: "cat-vscode-extension",
    slug: "vscode-extension",
    displayName: "VS Code Extension",
    description: "Extensions for Visual Studio Code to enhance development experience.",
    icon: "💎",
    accentColor: "#7C6DFF",
    gradient: "linear-gradient(135deg, #7C6DFF 0%, #B8AFFF 100%)",
    sortOrder: 2,
  },
  {
    id: "cat-cursor-extension",
    slug: "cursor-extension",
    displayName: "Cursor Extension",
    description: "Extensions, utilities, and tools designed specifically for Cursor IDE.",
    icon: "✨",
    accentColor: "#00C9A7",
    gradient: "linear-gradient(135deg, #00C9A7 0%, #72EFD4 100%)",
    sortOrder: 3,
  },
  {
    id: "cat-opencode-extension",
    slug: "opencode-extension",
    displayName: "OpenCode Extension",
    description: "Extensions, plugins, and resources related to OpenCode development workflow.",
    icon: "🔮",
    accentColor: "#FF8C42",
    gradient: "linear-gradient(135deg, #FF8C42 0%, #FFB88C 100%)",
    sortOrder: 4,
  },
  {
    id: "cat-prompt",
    slug: "prompt",
    displayName: "Prompt",
    description: "AI prompts for coding, architecture, automation, design, and productivity.",
    icon: "💬",
    accentColor: "#E879F9",
    gradient: "linear-gradient(135deg, #E879F9 0%, #F0ABFC 100%)",
    sortOrder: 5,
  },
  {
    id: "cat-blueprint",
    slug: "blueprint",
    displayName: "Blueprint",
    description: "Project blueprints, architecture documents, and technical planning resources.",
    icon: "📐",
    accentColor: "#38BDF8",
    gradient: "linear-gradient(135deg, #38BDF8 0%, #7DD3FC 100%)",
    sortOrder: 6,
  },
  {
    id: "cat-template",
    slug: "template",
    displayName: "Template",
    description: "Reusable project templates, boilerplates, and starter kits for rapid development.",
    icon: "📋",
    accentColor: "#FB923C",
    gradient: "linear-gradient(135deg, #FB923C 0%, #FDBA74 100%)",
    sortOrder: 7,
  },
  {
    id: "cat-script",
    slug: "script",
    displayName: "Script",
    description: "Standalone scripts, UserScripts, and utilities for automation and productivity.",
    icon: "⚡",
    accentColor: "#FACC15",
    gradient: "linear-gradient(135deg, #FACC15 0%, #FDE68A 100%)",
    sortOrder: 8,
  },
  {
    id: "cat-automation",
    slug: "automation",
    displayName: "Automation",
    description: "Automation tools, workflows, bots, and CI/CD scripts.",
    icon: "🤖",
    accentColor: "#34D399",
    gradient: "linear-gradient(135deg, #34D399 0%, #6EE7B7 100%)",
    sortOrder: 9,
  },
  {
    id: "cat-source-code",
    slug: "source-code",
    displayName: "Source Code",
    description: "Complete source code packages, libraries, and reusable code modules.",
    icon: "🧩",
    accentColor: "#F472B6",
    gradient: "linear-gradient(135deg, #F472B6 0%, #F9A8D4 100%)",
    sortOrder: 10,
  },
  {
    id: "cat-github-repository",
    slug: "github-repository",
    displayName: "GitHub Repository",
    description: "Links and references to GitHub repositories and open-source projects.",
    icon: "🐙",
    accentColor: "#A78BFA",
    gradient: "linear-gradient(135deg, #A78BFA 0%, #C4B5FD 100%)",
    sortOrder: 11,
  },
  {
    id: "cat-documentation",
    slug: "documentation",
    displayName: "Documentation",
    description: "Technical documentation, API references, guides, and how-to articles.",
    icon: "📚",
    accentColor: "#60A5FA",
    gradient: "linear-gradient(135deg, #60A5FA 0%, #93C5FD 100%)",
    sortOrder: 12,
  },
  {
    id: "cat-assets",
    slug: "assets",
    displayName: "Assets",
    description: "Visual assets, icons, images, stickers, and design resources.",
    icon: "🎨",
    accentColor: "#F87171",
    gradient: "linear-gradient(135deg, #F87171 0%, #FCA5A5 100%)",
    sortOrder: 13,
  },
  {
    id: "cat-learning-resources",
    slug: "learning-resources",
    displayName: "Learning Resources",
    description: "Tutorials, courses, articles, and learning materials for developers.",
    icon: "📖",
    accentColor: "#2DD4BF",
    gradient: "linear-gradient(135deg, #2DD4BF 0%, #5EEAD4 100%)",
    sortOrder: 14,
  },
];

/**
 * Get a category config by its slug.
 */
export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/**
 * Get a category config by its id.
 */
export function getCategoryById(id: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
