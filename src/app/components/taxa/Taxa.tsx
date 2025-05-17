"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function InterestCalculator() {
  const [valorInicial, setValorInicial] = useState(0);
  const [taxa, setTaxa] = useState(0);
  const [dias, setDias] = useState(0);
  const [intervalo, setIntervalo] = useState(0);
  const [cotacao, setCotacao] = useState<number | null>(null);
  const [resultado, setResultado] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);

  const calcular = () => {
    const ciclos = dias / intervalo;
    const taxaDecimal = taxa / 100;
    const valorFinal = valorInicial * Math.pow(1 + taxaDecimal, ciclos);
    setResultado(Number(valorFinal.toFixed(2)));
  };

  const clearAll = () => {
    setValorInicial(0);
    setTaxa(0);
    setDias(0);
    setIntervalo(0);
    setResultado(null);
    setErro(false);
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

    const intervaloId = setInterval(fetchDolar, 3 * 3600);
    return () => clearInterval(intervaloId);
  }, []);

  console.log(cotacao?.toFixed(2));
  return (
    <Card className="w-full max-w-md p-6 shadow-xl border border-gray-300 rounded-3xl bg-gradient-to-br ">
      <CardContent className="space-y-6">
        <div className="text-right flex justify-end gap-1">
          <h3>US$:</h3>
          <p>R${cotacao?.toFixed(2).replace(".", ",")} 💵 </p>
        </div>
        <h2 className="text-2xl font-extrabold text-center text-slate-800 tracking-tight">
          💹 Simulador de Juros Compostos
        </h2>
        {erro && <p>Por favor, preencha todos os campos</p>}
        <div className="grid gap-4">
          <div>
            <Label htmlFor="valorInicial" className="text-sm text-slate-600">
              Valor Inicial (US$)
            </Label>
            <Input
              id="valorInicial"
              type="number"
              value={valorInicial > 0 ? valorInicial : ""}
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
              value={taxa > 0 ? taxa : ""}
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
              value={dias > 0 ? dias : ""}
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
              value={intervalo > 0 ? intervalo : ""}
              onChange={(e) => setIntervalo(Number(e.target.value))}
              className="mt-1"
            />
          </div>
        </div>
        <div className="flex gap-5">
          <Button
            onClick={
              intervalo > 0
                ? calcular
                : () => {
                    setErro(true);
                  }
            }
            className=" bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:brightness-110 transition"
          >
            Calcular
          </Button>

          <Button onClick={clearAll} variant={"destructive"}>
            Limpar
          </Button>
        </div>

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
