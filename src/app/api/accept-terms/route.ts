import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        if (!req.body) {
            return new Response("Dados incompletos", { status: 400 });
        }

        const { consumidor, identificacaoCliente, selectedGroups, prazo } = await req.json();

        // Teste
        // return new Response(JSON.stringify({ consumidor, identificacaoCliente, selectedGroups }), {
        //     headers: { "Content-Type": "application/json" },
        // });

        // Código aleatório de numeros inteiros, por estética
        const idProcesso = Math.floor(Math.random() * 1000000);
        // Enviando os dados para o endpoint
        const response = await fetch("http://localhost:3000/api/accept-terms-request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                consumidor: consumidor,
                identificacaoCliente: identificacaoCliente,
                selectedGroups: selectedGroups,
                prazo: prazo,
                idProcesso: idProcesso
            }),            
        });

        // Retornando a resposta do endpoint
        return response;
    } catch (error) {
        console.error("Erro ao processar a solicitação:", error);
        // Retornando uma resposta de erro
        return new Response("Erro interno do servidor", { status: 500 });
    }    
}
