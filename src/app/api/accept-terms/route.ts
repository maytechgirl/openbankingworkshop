import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        if (!req.body) {
            return new Response("Dados incompletos", { status: 400 });
        }

        const { consumidor, identificacaoCliente, selectedGroups, prazo } = await req.json();

        const transmissoraUrl = process.env.TRANSMISSORA_URL;
        if (!transmissoraUrl) {
            return new Response("URL da transmissora não encontrada", { status: 400 });
        }


        const dataUrl = process.env.DATA_URL;
        if (!dataUrl) {
            return new Response("URL dos dados não encontrada", { status: 400 });
        }

        // Qualquer coisa, já que a api do mockapi.io faz autoincremento, então o idProcesso pode ser qualquer coisa
        const anyIdProceso = Math.floor(Math.random() * 1000);

        const dataToPost = {
            consumidor: consumidor,
            identificacaoCliente: identificacaoCliente,
            selectedGroups: selectedGroups,
            prazo: prazo,
            terms: 'pending',
            idProcesso: anyIdProceso
        };

        // realizamos um POST em DATA_URL, para criar o processo
        const responseNewProcess = await fetch(dataUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToPost),
        });

        // Vamos mudar o idProcesso para o id gerado pelo mockApi.
        const idProcesso = (await responseNewProcess.json()).idProcesso;


        console.log(idProcesso)

        // Simula o processo de guardar o id do processo do usuário
        const fs = require('fs');
        const yaml = require('js-yaml');
        const path = require('path');
        const filePath = path.resolve('src/app/api/demo-save-consent/demo.yml');
        const file = fs.readFileSync(filePath, 'utf8');
        const doc = yaml.load(file);

        const currentHardCodedUser = 'usuario'

        if (doc[currentHardCodedUser]) {
            doc[currentHardCodedUser] = {
                idProcesso: idProcesso,
                consent: 'pending'
            };
        } else {
            doc[currentHardCodedUser] = {
                idProcesso: idProcesso,
                consent: 'pending'
            };
        }

        const yamlString = yaml.dump(doc);

        fs.writeFileSync(filePath, yamlString, 'utf8');

        
        const apiUrl = process.env.TRANSMISSORA_URL;

        if (!apiUrl) {
            return new Response("URL da transmissora não encontrada", { status: 400 });
        }
        
        const urlToRedirect = process.env.TRANSMISSORA_URL + "/authorize/" + idProcesso;
        return new Response(JSON.stringify(urlToRedirect), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Erro ao processar a solicitação:", error);
        // Retornando uma resposta de erro
        return new Response("Erro interno do servidor", { status: 500 });
    }    
}
