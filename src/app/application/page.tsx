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
                    <ReadOnlyInput label="Plazo" id="prazo" value={`${responseJson?.prazo}`} readOnly />
                    
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
        <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
        </main>
    );
};