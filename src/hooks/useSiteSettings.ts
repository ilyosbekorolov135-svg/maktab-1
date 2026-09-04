import { useState, useEffect } from "react";

export interface SiteSettings {
  siteName: string;
  siteBadge: string;
  siteTagline: string;
  headerLogo: string;
  heroBadge1: string;
  heroBadge2: string;
  // Navigation labels
  navMain: string;
  navTeachers: string;
  navTalented: string;
  navSchedule: string;
  navScheduleBadge: string;
  navReviews: string;
  // Footer
  footerAboutTitle: string;
  footerAboutText: string;
  footerContactTitle: string;
  footerContactAddress: string;
  footerContactDesc: string;
  footerCopyright: string;
}

const DEFAULTS: SiteSettings = {
  siteName: "1-Maktab",
  siteBadge: "ANGOR TUMANI",
  siteTagline: "Surxondaryo viloyati 1-sonli maktab portali",
  headerLogo: "/uploads/angor_1_maktab_official_logo.jpg",
  heroBadge1: "Surxondaryo #1 Tayanch Maktabi",
  heroBadge2: "Vazir Jamg'armasi 100% Ustamasi",
  navMain: "1-Maktab Asosiy",
  navTeachers: "Fidoiy Ustozlar",
  navTalented: "Iqtidorli O'quvchilar",
  navSchedule: "Dars Jadvali",
  navScheduleBadge: "2026",
  navReviews: "Fikr va Takliflar",
  footerAboutTitle: "EduStats Maktablar",
  footerAboutText: "O'zbekiston Respublikasi umumta'lim va ixtisoslashgan maktablarining milliy ochiq reyting va jamoatchilik fikri platformasi.",
  footerContactTitle: "Angor 1-maktab Markazi",
  footerContactAddress: "Surxondaryo viloyati, Angor tumani, Mustaqillik ko'chasi 12-uy.",
  footerContactDesc: "Zakovat va Al-Xorazmiy olimpiadasi tayanch maktabi.",
  footerCopyright: "© 2026 EduStats Maktablar Portali. Barcha huquqlar himoyalangan.",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings({ ...DEFAULTS, ...data });
      }
    } catch {
      // defaults remain
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettings = async (updates: Partial<SiteSettings>): Promise<boolean> => {
    try {
      const token = sessionStorage.getItem("admin_token") || "";
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        setSettings((prev) => ({ ...prev, ...updates }));
        return true;
      }
    } catch {}
    return false;
  };

  return { settings, loading, saveSettings, refetch: fetchSettings };
}
