import { LandingScreen } from "@/features/public/features/landing/screen/landing-screen";

export const revalidate = 3600;

export default function HomePage() {
  return <LandingScreen />;
}
