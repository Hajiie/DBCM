import { THEMES } from "../shared/enums";
import { useRouter } from "next/router";
import { iSEO } from "../shared/interfaces";
import { WEBSITE_NAME, WEBSITE_URL } from "../../BLOG_CONSTANTS/_BLOG_SETUP";
import { MOCK_ARTICLES_LIST } from "../constants/mocks";
import { GAEvent } from "../../google";

// env
const env = process.env.NODE_ENV;
export const IS_DEV_MODE = env === "development" ? true : false;

/**
 *
 * @param classes string
 * @returns string
 */
export const combineClasses = function (...classes: any): string {
  return classes.filter((item: any) => !!item).join(" ");
};

/**
 * Changes Dark / Light Theme
 */
export const changeTheme = (): void => {
  const lsTheme = localStorage.getItem("theme");
  localStorage.setItem(
    "theme",
    lsTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT
  );

  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  location.reload();
};

/**
 * Returns Device Type tablet , mobile, desktop
 * @returns string
 */
export const getDeviceType = (): string => {
  const ua = typeof window !== "undefined" ? navigator.userAgent : 'desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
};

/**
 * Returns true if desktop
 * @returns boolean
 */
export const isDesktopDevice = (): boolean => {
  if (getDeviceType() === "desktop") {
    return true;
  } else {
    return false;
  }
};

/**
 * Returns true if mobile
 * @returns boolean
 */
export const isMobileDevice = (): boolean => {
  if (getDeviceType() === "mobile") {
    return true;
  } else {
    return false;
  }
};

/**
 * Add no scroll class to body when modal isopen
 */
export const addBodyNoScroll = (): void => {
  document.body.classList.add("no-scroll");
};

/**
 * Removes no scroll class to body when modal isopen
 */
export const removeBodyNoScroll = (): void => {
  document.body.classList.remove("no-scroll");
};

export const getArticleDetails = () => {
  const router = useRouter();
  const articlePath = "/pages" + router.pathname + ".tsx";
  return MOCK_ARTICLES_LIST.find((article) => article.path === articlePath);
};

/**
 * Removes /pages from article path
 * @param path
 * @returns
 */
export const transformPath = (path = ""): string => {
  return path.replace(/^\/pages\//, "/").replace(/\.tsx(?=\/?([?#]|$))/, "");
};

/**
 * Removes /public from images path
 * @param path
 * @returns string
 */
export const transformImagePaths = (path = ""): string => {
  return path.replace(/^\/public\//, "/");
};

/**
 * Creates SEO Config from ArticleDetails.preview || ArticleDetails.seo ||  PAGE_SEO
 * @param PAGE_SEO : iSEO
 * @returns SEO config
 */
export const CREATE_SEO_CONFIG = (PAGE_SEO: iSEO) => {
  /**
   * We can create SEO Config from
   * ARTICLE_DETAILS or SEO object passed in article list or layout
   */
  const router = useRouter();
  const ARTICLE_DETAILS = getArticleDetails();

  const path = transformPath(ARTICLE_DETAILS?.path) || router.asPath.split(/[?#]/)[0];
  const url = WEBSITE_URL ? WEBSITE_URL.replace(/\/$/, "") + path : undefined;
  const meta_description = PAGE_SEO.description || ARTICLE_DETAILS?.preview.shortIntro;
  const keywords = PAGE_SEO.keywords || ARTICLE_DETAILS?.preview.tags;
  const imagePath = transformImagePaths(PAGE_SEO.ogImage || ARTICLE_DETAILS?.preview.thumbnail);
  const ogImage = imagePath.startsWith("/") && WEBSITE_URL ? WEBSITE_URL.replace(/\/$/, "") + imagePath : imagePath;
  const twitterHandle = PAGE_SEO.twitterHandle || "";
  const author = ARTICLE_DETAILS?.preview.author.name || PAGE_SEO.author;
  const pageTitle = ARTICLE_DETAILS?.preview.articleTitle || PAGE_SEO.title || WEBSITE_NAME;
  const title = [pageTitle, pageTitle === WEBSITE_NAME ? undefined : WEBSITE_NAME, author].filter(Boolean).join(" | ");

  let seo_config = {
    title: title,
    description: meta_description,
    canonical: url,
    additionalMetaTags: keywords ? [{ name: "keywords", content: keywords }] : [],
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      site_name: WEBSITE_NAME,
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : undefined,
    },
    twitter: {
      handle: twitterHandle,
      site: url,
      cardType: "summary_large_image",
    },
  };
  return seo_config;
};

/**
 * Share link or article method
 * @returns false if desktop else open share window on mobile devices
 */
export const webShare = () => {
  const pageTitle = document.title;
  const url =
    typeof window !== "undefined" ? window.location.href : WEBSITE_URL;

  GAEvent({
    action: "share_clicked",
    event_category: "click",
    label: url,
    value: null,
  });

  if (isDesktopDevice()) {
    return false;
  } else {
    if (typeof window !== "undefined" && navigator) {
      navigator
        .share({
          text: pageTitle,
          url: url,
        })
        .catch(console.error);
      return true;
    } else {
      return false;
    }
  }
};
