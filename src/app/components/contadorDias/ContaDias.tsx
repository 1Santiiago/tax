"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

function ContaDias() {
  const hojeStr: string = new Date().toISOString().split("T")[0];

  const [dataInicial, setDataInicial] = useState<string>(hojeStr);
  const [dataFinal, setDataFinal] = useState<string>(hojeStr);
  const [diasEntre, setDiasEntre] = useState<number>(0);

  useEffect(() => {
    const calcularDias = () => {
      const inicio = new Date(dataInicial + "T00:00:00");
      const fim = new Date(dataFinal + "T00:00:00");
      const diferencaMs = fim.getTime() - inicio.getTime();
      const dias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));
      setDiasEntre(dias);
    };

    calcularDias();
  }, [dataInicial, dataFinal]);

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Contador de Dias
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicial">Data Inicial</Label>
              <Input
                id="dataInicial"
                type="date"
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFinal">Data Final</Label>
              <Input
                id="dataFinal"
                type="date"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
              />
            </div>

            <Separator />

            <p className="text-center text-lg font-semibold">
              🗓️ Dias entre as datas:{" "}
              <span className="text-primary font-bold">{diasEntre}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ContaDias;
