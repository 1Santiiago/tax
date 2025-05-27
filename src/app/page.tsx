import ContaDias from "./components/contadorDias/ContaDias";
import InterestCalculator from "./components/taxa/Taxa";

export default function Home() {
  return (
    <div className="wfull flex items-center justify-center  p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
        <InterestCalculator></InterestCalculator>
        <ContaDias />
      </div>
    </div>
  );
}
