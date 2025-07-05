"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type RelatorioMensal = {
  mes: number;
  dias: number;
  saldoAntesSaque: number;
  saque: number;
  saldoRestante: number;
};

export default function InterestCalculator({ Children }: any) {
  const [valorInicial, setValorInicial] = useState(0);
  const [taxa, setTaxa] = useState(0);
  const [dias, setDias] = useState(0);
  const [intervalo, setIntervalo] = useState(0);
  const [cotacao, setCotacao] = useState<number | null>(null);
  const [resultado, setResultado] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);
  const [percentualSaque, setPercentualSaque] = useState(30);
  const [relatorio, setRelatorio] = useState<RelatorioMensal[]>([]);

  const calcular = () => {
    const ciclos = dias / intervalo;
    const taxaDecimal = taxa / 100;
    const valorFinal = valorInicial * Math.pow(1 + taxaDecimal, ciclos);
    setResultado(Number(valorFinal.toFixed(2)));

    const relatorioMensal = gerarRelatorioMensal(
      valorInicial,
      taxa,
      intervalo,
      12,
      percentualSaque
    );
    setRelatorio(relatorioMensal);
  };

  const gerarRelatorioMensal = (
    valorInicial: number,
    taxaPorCiclo: number,
    intervaloDias: number,
    meses: number,
    percentualSaque: number
  ): RelatorioMensal[] => {
    const taxaDecimal = taxaPorCiclo / 100;
    const saqueDecimal = percentualSaque / 100;
    const relatorio: RelatorioMensal[] = [];
    let saldo = valorInicial;

    for (let mes = 1; mes <= meses; mes++) {
      const diasAcumulados = mes * 30;
      const ciclos = Math.floor(diasAcumulados / intervaloDias);
      const saldoBruto = valorInicial * Math.pow(1 + taxaDecimal, ciclos);
      const saque = saldoBruto * saqueDecimal;
      const saldoFinal = saldoBruto - saque;

      relatorio.push({
        mes,
        dias: diasAcumulados,
        saldoAntesSaque: parseFloat(saldoBruto.toFixed(2)),
        saque: parseFloat(saque.toFixed(2)),
        saldoRestante: parseFloat(saldoFinal.toFixed(2)),
      });
    }

    return relatorio;
  };

  const clearAll = () => {
    setValorInicial(0);
    setTaxa(0);
    setDias(0);
    setIntervalo(0);
    setResultado(null);
    setErro(false);
    setRelatorio([]);
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

  return (
    <Card className="w-full max-w-md p-6 shadow-xl border border-gray-300 rounded-3xl bg-gradient-to-br">
      <CardContent className="space-y-6">
        <div className="flex justify-between gap-1">
          <div>
            <h3>US$:</h3>
            <p>R${cotacao?.toFixed(2).replace(".", ",")} 💵 </p>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-center text-slate-800 tracking-tight">
          💹 Simulador de Juros Compostos
        </h2>

        {erro && <p>Por favor, preencha todos os campos</p>}

        <div className="grid gap-4">
          <div>
            <Label htmlFor="valorInicial">Valor Inicial (R$)</Label>
            <Input
              id="valorInicial"
              type="number"
              value={valorInicial > 0 ? valorInicial : ""}
              onChange={(e) => setValorInicial(Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="taxa">Taxa por ciclo (%)</Label>
            <Input
              id="taxa"
              type="number"
              value={taxa > 0 ? taxa : ""}
              onChange={(e) => setTaxa(Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="dias">Total de Dias</Label>
            <Input
              id="dias"
              type="number"
              value={dias > 0 ? dias : ""}
              onChange={(e) => setDias(Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="intervalo">Intervalo (dias por ciclo)</Label>
            <Input
              id="intervalo"
              type="number"
              value={intervalo > 0 ? intervalo : ""}
              onChange={(e) => setIntervalo(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="percentualSaque">Porcentagem a sacar (%)</Label>
          <Input
            id="percentualSaque"
            type="number"
            min={0}
            max={100}
            value={percentualSaque}
            onChange={(e) => setPercentualSaque(Number(e.target.value))}
          />
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
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:brightness-110 transition"
          >
            Calcular
          </Button>
          <Button onClick={clearAll} variant={"destructive"}>
            Limpar
          </Button>
        </div>

        {Children}

        {resultado !== null && (
          <>
            <div className="mt-4 text-center text-xl font-bold text-green-600">
              💰 Valor final: US$ {resultado.toFixed(2)}
              <span className="block text-sm text-gray-500 mt-1">
                📅 Mês estimado: {Math.floor(dias / 30)}º mês
              </span>
            </div>

            {cotacao !== null && (
              <>
                <div className="mt-2 text-center font-semibold text-green-700">
                  💰 Valor aproximado em reais: R${" "}
                  {(resultado * cotacao).toFixed(2)}
                </div>

                <div className="mt-2 text-center font-semibold text-green-700">
                  💸 Saque simulado (R$): R$
                  {(resultado * cotacao * (percentualSaque / 100)).toFixed(2)}
                </div>

                <div className="mt-2 text-center font-semibold text-green-700">
                  💸 Saque simulado (US$): US$
                  {(resultado * (percentualSaque / 100)).toFixed(2)}
                </div>

                <div className="mt-2 text-center font-semibold text-blue-600">
                  🧾 Valor restante (R$): R$
                  {(
                    resultado *
                    cotacao *
                    ((100 - percentualSaque) / 100)
                  ).toFixed(2)}
                </div>

                <div className="mt-2 text-center font-semibold text-blue-600">
                  💵 Valor restante (US$): US$
                  {(resultado * ((100 - percentualSaque) / 100)).toFixed(2)}
                </div>
              </>
            )}
          </>
        )}

        {relatorio.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-center text-slate-800 mb-4">
              📊 Relatório Mensal com Saques (US$)
            </h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b gap-1">
                  <th className="text-left py-2">Mês</th>
                  <th className="text-left py-2">Dias</th>
                  <th className="text-left py-2">Saldo antes</th>
                  <th className="text-left py-2">Saque</th>
                  <th className="text-left py-2">Restante</th>
                </tr>
              </thead>
              <tbody className="gap-2">
                {relatorio.map((r) => (
                  <tr key={r.mes} className="border-b gap-2">
                    <td className="py-1 gap-0.5 px-0.5">📅 {r.mes} </td>
                    <td className="py-1">{r.dias} dias </td>
                    <td className="py-1 text-green-700 font-medium">
                      US$ {r.saldoAntesSaque.toFixed(2)}
                    </td>
                    <td className="py-1 text-red-600 font-medium">
                      -US$ {r.saque.toFixed(2)}
                    </td>
                    <td className="py-1 text-blue-600 font-semibold">
                      US$ {r.saldoRestante.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
