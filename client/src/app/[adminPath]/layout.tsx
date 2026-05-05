
interface AdminPathLayoutProps {
  children: React.ReactNode;
  params: Promise<{ adminPath: string }>;
}

export default async function AdminPathLayout({
  children,
  params,
}: AdminPathLayoutProps) {
  // secretPath validation is handled by middleware
  return <>{children}</>;
}
