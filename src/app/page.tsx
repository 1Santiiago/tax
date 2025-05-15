import InterestCalculator from "./components/taxa/Taxa";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <InterestCalculator />
    </div>
  );
}
