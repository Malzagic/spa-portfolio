// app/loading.tsx
import FullPageLoader from "@/components/UI/FullPageLoader";

/**
 * Next.js 16.2 Streaming Convention
 * This component will be shown instantly while the server is streaming
 * the Page content. No manual Suspense needed in page.tsx.
 */
export default function Loading() {
  return <FullPageLoader />;
}
