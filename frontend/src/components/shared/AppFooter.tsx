export function AppFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-default-200 py-6 text-center text-sm text-default-500">
      © {year} Assets Platform. All rights reserved.
    </footer>
  );
}
