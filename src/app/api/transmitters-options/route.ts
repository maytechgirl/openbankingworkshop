import { NextResponse } from 'next/server';

export async function GET() {
    const response = await fetch("https://run.mocky.io/v3/88715074-23c3-4d87-bbeb-04b8973fec2a");
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
