'use client'; // Como não há autenticação do usuário, precisamos obter as informaçoes do usuário a partir do "code"
import React, { useEffect, useState } from "react";

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
            setOptionsList(data.options);

        })
        .catch(error => {
            console.error('Error getting permissions:', error);
        });
    }, []);

    return (
        // Se responseJson E handleConsent estiverem setados, então renderiza o componente
        responseJson? (
            <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
            <div className="flex flex-col justify-center items-center w-full text-xl text-black" >
                <h1>Efetivação da solicitação</h1>

                <div className="flex justify-center items-center w-full text-xl text-black" >
                    <div className="p-2">
                    </div>
                    <div className="" >
                        Mônica, sua solicitação de compartilhamento de dados foi efetivada com sucesso!
                    </div>
                </div>

                <div>
                    <div className="mb-4">
                        <label htmlFor="consumidor">Consumidor:</label>
                        <input id="consumidor" type="text" name="consumidor" value={`${responseJson?.consumidor}`} readOnly />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="cnpj">Identificação do cliente:</label>
                        <input id="cnpj" type="text" name="cnpj" value={`${responseJson?.identificacaoCliente}`} readOnly />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="codigoSolitacao">Código de solicitação:</label>
                        <input id="codigoSolitacao" type="text" name="consumidor" value={`${responseJson?.codigoSolitacao}`} readOnly />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="receptor">Receptor:</label>
                        <input id="receptor" type="text" name="receptor" value={`${responseJson?.receptor}`} readOnly />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="dataConsent">Data de consentimento:</label>
                        <input id="dataConsent" type="text" name="dataConsent" value={`${responseJson?.dataConsent}`} readOnly />
                    </div>

                    { <div>
                        <label htmlFor="dataConsent">Dados a serem compartilhados:</label>
                        
                        {optionsList.map((option, index) => (
                            <div key={index}>
                                <h4>{option?.displayName}</h4>
                                <ul>
                                    {option?.permissions.map((permission, index) => (
                                        <li key={index + permission.name} className="px-5">
                                            {permission.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div> }
                    <div>
                        <label htmlFor="prazo">Prazo:</label>
                        <input id="prazo" type="text" name="prazo" value={`${responseJson?.prazo}`} readOnly />
                    </div>
                </div>
                    <div>
                        Você pode iniciar um novo fluxo de solicitação ou continuar seu processo anterior.
                        <button> Continuar </button>
                    </div>
                </div>
        </main>

    ) : <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white text-black">
        Carregando...</main>
    );
};