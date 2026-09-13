import { db } from "@/lib/db";
import { livechatTemplate as livechatTemplateTable } from "@/lib/schema";
import { desc, asc } from "drizzle-orm";
import LivechatTemplateManager from "@/components/LivechatTemplateManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Template Livechat CS | Pinkspace",
  description: "Pusat template balasan cepat ke member untuk Livechat Customer Service",
};

export default async function LivechatTemplatePage() {
  const templates = await db.query.livechatTemplate.findMany({
    orderBy: [
      desc(livechatTemplateTable.isFavorite),
      asc(livechatTemplateTable.sortOrder),
      desc(livechatTemplateTable.createdAt),
    ],
  });

  return (
    <div className="animate-in fade-in duration-300">
      <LivechatTemplateManager initialTemplates={templates} />
    </div>
  );
}
