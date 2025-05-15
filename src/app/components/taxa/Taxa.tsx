"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function InterestCalculator() {
  const [valorInicial, setValorInicial] = useState(0);
  const [taxa, setTaxa] = useState(0); // em porcentagem
  const [dias, setDias] = useState(0);
  const [intervalo, setIntervalo] = useState(0);
  const [cotacao, setCotacao] = useState<number | null>(null);
  const [resultado, setResultado] = useState<number | null>(0);
  const [dolar, setDolar] = useState(0);
  const [loading, setLoading] = useState(false);

  const calcular = () => {
    const ciclos = dias / intervalo;
    const taxaDecimal = taxa / 100;
    const valorFinal = valorInicial * Math.pow(1 + taxaDecimal, ciclos);
    setResultado(Number(valorFinal.toFixed(2)));
  };

  useEffect(() => {
    async function fetchDolar() {
      setLoading(true);
      try {
        const res = await fetch(
          "https://economia.awesomeapi.com.br/json/last/USD-BRL"
        );
        const data = await res.json();
        setCotacao(parseFloat(data.USDBRL.bid));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchDolar();

    const intervaloId = setInterval(fetchDolar, 5 * 3600000);
    return () => clearInterval(intervaloId);
  }, []);

  console.log(cotacao?.toFixed(2));
  return (
    <Card className="w-full max-w-md p-6 shadow-xl border border-gray-300 rounded-3xl bg-gradient-to-br ">
      <CardContent className="space-y-6">
        <h2 className="text-2xl font-extrabold text-center text-slate-800 tracking-tight">
          💹 Simulador de Juros Compostos
        </h2>

        <div className="grid gap-4">
          <div>
            <Label htmlFor="valorInicial" className="text-sm text-slate-600">
              Valor Inicial (US$)
            </Label>
            <Input
              id="valorInicial"
              type="number"
              value={valorInicial}
              onChange={(e) => setValorInicial(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="taxa" className="text-sm text-slate-600">
              Taxa por ciclo (%)
            </Label>
            <Input
              id="taxa"
              type="number"
              value={taxa}
              onChange={(e) => setTaxa(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="dias" className="text-sm text-slate-600">
              Total de Dias
            </Label>
            <Input
              id="dias"
              type="number"
              value={dias}
              onChange={(e) => setDias(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="intervalo" className="text-sm text-slate-600">
              Intervalo (dias por ciclo)
            </Label>
            <Input
              id="intervalo"
              type="number"
              value={intervalo}
              onChange={(e) => setIntervalo(Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>

        <Button
          onClick={calcular}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:brightness-110 transition"
        >
          Calcular
        </Button>

        {resultado !== null && (
          <>
            <div className="mt-4 text-center text-xl font-bold text-green-600">
              💰 Valor final: US$ {resultado.toFixed(2)}
            </div>
            {cotacao !== null && (
              <>
                <div className="mt-2 text-center font-semibold text-green-700">
                  💰 Valor aproximado em reais: R$
                  {(resultado * cotacao).toFixed(2)}
                </div>
                <div className="mt-2 text-center font-semibold text-green-700">
                  📈 Juros mensais (30% do valor em reais): R$
                  {(resultado * cotacao * 0.3).toFixed(2)}
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
