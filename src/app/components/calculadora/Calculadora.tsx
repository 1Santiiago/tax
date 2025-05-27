"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";

function Calculadora() {
  const [numero1, setNumero1] = useState("");
  const [numero2, setNumero2] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);

  const calcular = (operacao: string) => {
    const n1 = parseFloat(numero1);
    const n2 = parseFloat(numero2);

    if (isNaN(n1) || isNaN(n2)) return;

    let res = 0;

    switch (operacao) {
      case "+":
        res = n1 + n2;
        break;
      case "-":
        res = n1 - n2;
        break;
      case "*":
        res = n1 * n2;
        break;
      case "/":
        res = n1 / n2;
        break;
    }
    setResultado(res);
  };

  return (
    <div>
      <Card className="w-full max-w-md mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Calcule Rápido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numero1">Número 1</Label>
            <Input
              id="numero1"
              type="number"
              value={numero1}
              onChange={(e) => setNumero1(e.target.value)}
              placeholder="Digite o primeiro número"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="numero2">Número 2</Label>
            <Input
              id="numero2"
              type="number"
              value={numero2}
              onChange={(e) => setNumero2(e.target.value)}
              placeholder="Digite o segundo número"
            />
          </div>

          <div className="flex justify-between gap-2">
            <Button onClick={() => calcular("+")}>+</Button>
            <Button onClick={() => calcular("-")}>−</Button>
            <Button onClick={() => calcular("*")}>×</Button>
            <Button onClick={() => calcular("/")}>÷</Button>
          </div>
          {resultado !== null && (
            <div className="text-center text-lg font-semibold">
              Resultado:{" "}
              <span className="text-primary">
                {isNaN(resultado) ? "Erro" : resultado}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Calculadora;
