import { NextResponse } from 'next/server';

export async function GET() {
    const response = await fetch("https://run.mocky.io/v3/a4ff0f51-2b34-4369-ac5d-3deeb9797410");
    const data = await response.json();


    let optionsList: object[] = [];
    // Vamos criar um objeto assim: {0:{"name": "Datos de registro", "permissions": [{"name": "Datos de registro", "detail": "Nombre completo, Nombre social, Identificación de persona expuesta políticamente, etc."}, {...} }]}}

    let id = 0;
    let permissionId = 0;
    for (const group of data) {
        let displayName: string = '';
        let permissions: object[] = [];

        if (group.displayName && group.dataPermissions) {
            displayName = group.displayName;
            permissionId = 0;
            // Se o dataPermissions for iterável, então vamos iterar sobre ele
            if (Symbol.iterator in Object(group.dataPermissions)) {
                for (const permission of group.dataPermissions) {
                    let permissionName: string = permission.displayName;
                    let permissionDetail: string = permission.detail;
                    permissionId++;
                    permissions.push({id:permissionId, name: permissionName, detail: permissionDetail });
                }
            }
        }
        id++;
        optionsList.push({ id:id, displayName: displayName, permissions: permissions });
    }

    const responseJson = JSON.stringify(optionsList);

    // let data2 = JSON.stringify(data);

    return new Response(responseJson, {
        headers: { "Content-Type": "application/json" },
    });
}
