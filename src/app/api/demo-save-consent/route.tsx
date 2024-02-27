import { NextResponse } from 'next/server';

/**
 * Essa API só servirá para "simular" o salvamento do consentimento
 * Que posteriormente seria resgatado do DB real através do idProcesso
 * o idProcesso seria associado ao usuário já autenticado, assim resgatariamos posteriormente
 */

export async function GET() {
    const fs = require('fs');
    const yaml = require('js-yaml');
    const path = require('path');
    const filePath = path.resolve('src/app/api/demo-save-consent/demo.yml');
    const file = fs.readFileSync(filePath, 'utf8');
    const doc = yaml.load(file);

    // Vamos criar um objeto com os dados do doc
    let data = [];
    for (const key in doc) {
        data.push({ key: key, value: doc[key] });
    }

    return new Response(JSON.stringify(data), {
        headers: { 
            "Content-Type": "application/json",
        },
    });
}

export async function POST(req:any, res:any) {
    try {
        let data = await req.json();

        if (!data.idProcesso || !data.consent) {
            return new Response("Dados incompletos", { status: 400 });
        }

        const fs = require('fs');
        const yaml = require('js-yaml');
        const path = require('path');
        // src > app > api 
        const filePath = path.resolve('src/app/api/demo-save-consent/demo.yml');
        const file = fs.readFileSync(filePath, 'utf8');
        const doc = yaml.load(file);
        
        if (doc.usuario) {
            doc.usuario = {
                idProcesso: data.idProcesso,
                consent: data.consent
            };
        } else {
            doc.usuario = {
                idProcesso: data.idProcesso,
                consent: data.consent
            };
        }
        const yamlStr = yaml.dump(doc);
        fs.writeFileSync(filePath, yamlStr, 'utf8');
        
        return new Response(JSON.stringify(doc), {
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (error) {
        console.error("Erro ao processar a solicitação:", error);
        return new Response("Erro interno do servidor", { status: 500 });
    }
}
