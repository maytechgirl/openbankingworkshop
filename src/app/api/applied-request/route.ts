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

    const procData = await fetch(`http://localhost:3000/api/accept-terms-request`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const proc = await procData.json();
    
    // const doc = proc.find((doc: any) => doc.value.idProcesso == idProcesso);
    let doc = null;

    for (const d of proc) {
        if (d.value.idProcesso == idProcesso) {
            doc = d;
            break;
        }
    }
    
    if (!doc.value){
        return new Response("Processo não encontrado", { status: 404 });
    }

    const selectedGroups = doc.value.selectedGroups;

    if (!doc) {
        return new Response("Processo não encontrado", { status: 404 });
    }

    const response = await fetch("https://run.mocky.io/v3/a4ff0f51-2b34-4369-ac5d-3deeb9797410");
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
        consumidor: doc.value.consumidor,
        identificacaoCliente: doc.value.identificacaoCliente,
        codigoSolitacao: '123456',
        receptor: 'Receptor X',
        dataConsent: new Date().toISOString(),
        prazo: doc.value.prazo,
    };

    const responseJson = JSON.stringify(respData);


    // let data2 = JSON.stringify(data);

    return new Response(JSON.stringify(responseJson), { status: 200 });
}
