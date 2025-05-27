import Calculadora from "./components/calculadora/Calculadora";
import ContaDias from "./components/contadorDias/ContaDias";
import InterestCalculator from "./components/taxa/Taxa";

export default function Home() {
  return (
    <div className=" flex items-center justify-center  p-4">
      <div className=" ">
        <InterestCalculator></InterestCalculator>
        <ContaDias />
        <Calculadora />
      </div>
    </div>
  );
}
