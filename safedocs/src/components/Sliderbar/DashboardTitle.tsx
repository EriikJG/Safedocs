import { TypographyH3 } from "@/components/ui/typography";
import { SidebarTrigger } from "@/components/ui/sidebar";

type DashboardTitleProps = {
  children: React.ReactNode;
};

export function DashboardTitle({ children }: DashboardTitleProps) {
  return (
    <div className="flex items-center gap-2 border-b pb-4 pt-6 pl-6">
      <SidebarTrigger />
      <TypographyH3 className="text-xl">{children}</TypographyH3>
    </div>
  );
}
