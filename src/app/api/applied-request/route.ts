import { NextRequest } from 'next/server';

type GroupSelection = {
    groupId: string;
    permissions: string[];
}

type ResponseJson = {
    consumidor: string;
    identificacaoCliente: string;
    selectedGroups: GroupSelection[];
    prazo: string;
    idProcesso: string;
}


export async function GET() {    

    const fs = require('fs');
    const yaml = require('js-yaml');
    const path = require('path');
    const filePath = path.resolve('src/app/api/demo-save-consent/demo.yml');
    const file = fs.readFileSync(filePath, 'utf8');
    const userDataDoc = yaml.load(file);

    // Vamos criar um objeto com os dados do doc
    let userData = [];
    for (const key in userDataDoc) {
        userData.push({ key: key, value: userDataDoc[key] });
    }

    const idProcesso = userData[0].value.idProcesso;

    const dataUrl = process.env.DATA_URL;
    if (!dataUrl) {
        return new Response("URL dos dados não encontrada", { status: 400 });
    }

    // Realizamos um get em DATA_URL + /idProcesso
    const responseProcData = await fetch(dataUrl + "/" + idProcesso);
    const procData = await responseProcData.json();


    const selectedGroups = procData.selectedGroups;

    if (!procData) {
        return new Response("Processo não encontrado", { status: 404 });
    }

    const apiUrl = process.env.PERMISSIONS_OPTIONS_API_URL
    if(!apiUrl) {
        return new Response("API URL não encontrada", { status: 400 });
    }
    
    const response = await fetch(apiUrl);
    const dataApi = await response.json();


    let id = 0;
    let permissionId = 0;
    let optionsList: object[] = [];
    


    // Faremos uma optionsList apenas com os dados selecionados em SelectedGroups
    for (const group of dataApi) {
        id++;
        // Se tiver o displayName e permissions E se o grupo estiver selecionado
        if (group.displayName && group.dataPermissions && selectedGroups.find((selectedGroup: any) => selectedGroup.groupId == id)) {
            let displayName: string = '';
            let permissions: object[] = [];
            
            displayName = group.displayName;
            permissionId = 0;
            // Se o dataPermissions for iterável, então vamos iterar sobre ele
            if (Symbol.iterator in Object(group.dataPermissions)) {
                for (const permission of group.dataPermissions) {
                    let permissionName: string = permission.displayName;
                    let permissionDetail: string = permission.detail;
                    permissionId++;

                    // Se a permissão estiver selecionada
                    if (selectedGroups.find((selectedGroup: any) => selectedGroup.groupId == id).permissions.includes(permissionId.toString())) {
                        permissions.push({ id: permissionId, name: permissionName, detail: permissionDetail });
                    }
                }
            }
            
            optionsList.push({ id: id, displayName: displayName, permissions: permissions });

        }
    }

    const respData = { 
        options: optionsList,  // Data to be shared
        consumidor: procData.consumidor,
        identificacaoCliente: procData.identificacaoCliente,
        codigoSolitacao: procData.idProcesso,
        receptor: 'Receptor X',
        dataConsent: new Date().toISOString(),
        prazo: procData.prazo,
    };

    const responseJson = JSON.stringify(respData);


    // let data2 = JSON.stringify(data);

    return new Response(JSON.stringify(responseJson), { status: 200 });
}
