import { NextResponse } from 'next/server';

export async function GET() {

    const apiUrl = process.env.TRANSMITTERS_OPTIONS_API_URL
    if(!apiUrl) {
        return new Response("API URL não encontrada", { status: 400 });
    }
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Faremos um for no data para obter uma lista com todos os CustomerFriendlyDescription
    let optionsList: string[] = [];
    for (const value of data) {
        if (value.AuthorisationServers) {
            for (const server of value.AuthorisationServers) {
                optionsList.push(server.CustomerFriendlyDescription);
            }
        }
    }

    // Enviamos o optionsList para o front
    let responseJson = JSON.stringify({ options: optionsList });

    return new Response(responseJson, {
        headers: { "Content-Type": "application/json" },
    });
}
