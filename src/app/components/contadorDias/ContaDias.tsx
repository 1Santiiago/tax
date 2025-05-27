"use client";
import React, { useState, useEffect, Children } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

function ContaDias() {
  const hojeStr: string = new Date().toISOString().split("T")[0];

  const [dataInicial, setDataInicial] = useState<string>(hojeStr);
  const [diasPassados, setDiasPassados] = useState<number>(0);

  useEffect(() => {
    const calcularDias = () => {
      const hojeDate: Date = new Date();
      const inicioDate: Date = new Date(dataInicial + "T00:00:00");
      const diferencaEmMs: number = hojeDate.getTime() - inicioDate.getTime();
      const dias: number = Math.floor(diferencaEmMs / (1000 * 60 * 60 * 24));
      setDiasPassados(dias);
    };

    calcularDias();
  }, [dataInicial]);

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
            <div>
              <p>
                <span className="font-semibold">Data atual</span> {hojeStr}
              </p>
              <p>
                <span className="font-semibold">Quantidade de dias</span>{" "}
                <span className="text-primary font-bold">{diasPassados}</span>
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="data">Alterar data inicial:</Label>
              <Input
                id="data"
                type="date"
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ContaDias;
