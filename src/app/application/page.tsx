'use client'; // Como não há autenticação do usuário, precisamos obter as informaçoes do usuário a partir do "code"
import React, { useEffect, useState } from "react";
import DataSharingOptions from "../../components/DataSharingOptions/DataSharingOptions";
import ReadOnlyInput from "../../components/ReadOnlyInput/ReadOnlyInput";
import './page.css';

type Content = {
    options: string[];
    consumidor: string;
    identificacaoCliente: string;
    codigoSolitacao: string;
    receptor: string;
    dataConsent: string;
    prazo: string;
    idProcesso: string;
};

type OptionsList = {
    id: number;
    displayName: string;
    permissions: {
        id: number;
        name: string;
    }[];
};

// export default function SharedDataList(props: Content) {
export default function Application() {
    const [responseJson, setResponseJson] = useState<Content>();
    const [optionsList, setOptionsList] = useState<OptionsList[]>([]);

    useEffect(() => {
        fetch(`/api/applied-request`, { // Isso também seria feito sem uma API
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            data = JSON.parse(data);
            console.log(data.options);
            setResponseJson(data);
            
            // Se mês for igual  1, concatenamos " mês" se for maior, concatenamos " meses", só por estética
            if (data.prazo == 1) {
                data.prazo = "1 mês";
            } else {
                data.prazo = `${data.prazo} meses`;
            }

            setOptionsList(data.options);

        })
        .catch(error => {
            console.error('Error getting permissions:', error);
        });
    }, []);

    return (
        // Se responseJson E handleConsent estiverem setados, então renderiza o componente
        responseJson? (
            <main className="flex min-h-screen flex-col items-center justify-between px-24 py-8 bg-white">
            <div className="flex flex-col justify-center items-center w-full text-xl text-black" >
                <h1 className="text-3xl font-bold mb-5">Cumplimiento de la Solicitud</h1>
                <div className="flex flex-row text-xl text-black mb-5 w-min">
                    <div className="p-4 custom-icon w-56">
                        <img src="/checkmark.svg" alt="check" />
                    </div>
                    <div >
                        Mônica, ¡tu solicitud para compartir datos fue exitosa!
                    </div>
                </div>

                <div className="mb-4 bg-gray-100 w-auto p-4 rounded-xl text-1xl">
                    <ReadOnlyInput label="Código de solicitud" id="codigoSolitacao" value={responseJson?.codigoSolitacao} readOnly />
                    <ReadOnlyInput label="Consumidor" id="consumidor" value={responseJson?.consumidor} readOnly />
                    <ReadOnlyInput label="Identificación del cliente" id="cnpj" value={responseJson?.identificacaoCliente} readOnly />
                    <ReadOnlyInput label="Receptor" id="receptor" value={responseJson?.receptor} readOnly />
                    <ReadOnlyInput label="Fecha de consentimiento" id="dataConsent" value={responseJson?.dataConsent} readOnly />

                    <DataSharingOptions optionsList={optionsList} />
                    <ReadOnlyInput label="Término" id="prazo" value={`${responseJson?.prazo}`} readOnly />
                    
                </div>
                    <div className="mb-4 text-center align-center w-96">
                        Puede iniciar un nuevo flujo de solicitud o continuar su proceso anterior
                    </div>
                    <button className="bg-violet-800 hover:bg-violet-900 text-white font-bold m-3 py-3 px-4 rounded w-80" onClick={() => window.location.href = `http://localhost:3001/data-sharing`}>
                        Continuar 
                    </button>
                </div>
        </main>

    ) : <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white text-black">
        Carregando...</main>
    );
};