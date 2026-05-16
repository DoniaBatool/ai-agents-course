import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import path from "path";

const config: Config = {
  title: "AI Agents Development Course",
  tagline: "Build intelligent AI agents with OpenAI Agents SDK",
  favicon: "img/favicon.ico",
  url: "https://ai-agents-course.vercel.app",
  baseUrl: "/",
  organizationName: "your-github-username",
  projectName: "ai-agents-course",
  onBrokenLinks: "throw",
  markdown: { mermaid: true, hooks: { onBrokenMarkdownLinks: "warn" } },
  themes: ["@docusaurus/theme-mermaid"],

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [
    function webpackAliasPlugin() {
      return {
        name: "webpack-alias-plugin",
        configureWebpack() {
          return {
            resolve: {
              alias: {
                "@": path.resolve(__dirname, "src"),
              },
              // Allow ESM-only packages (e.g. @splinetool/react-spline)
              conditionNames: ["import", "require", "default", "browser", "module"],
            },
          };
        },
      };
    },
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: "AI Agents Course",
      logo: {
        alt: "AI Agents Logo",
        src: "img/logo.svg",
        href: "/",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "courseSidebar",
          position: "left",
          label: "Course",
        },
        {
          // TODO after deploy: change to https://your-auth-project.vercel.app/login
          href: process.env.NEXT_PUBLIC_AUTH_URL
            ? `${process.env.NEXT_PUBLIC_AUTH_URL}/login`
            : "http://localhost:3001/login",
          label: "Login",
          position: "right",
          className: "navbar-login-btn",
        },
        {
          // TODO after deploy: change to https://your-auth-project.vercel.app/signup
          href: process.env.NEXT_PUBLIC_AUTH_URL
            ? `${process.env.NEXT_PUBLIC_AUTH_URL}/signup`
            : "http://localhost:3001/signup",
          label: "Sign Up",
          position: "right",
          className: "navbar-signup-btn",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} AI Agents Course`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["python", "bash", "json"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
