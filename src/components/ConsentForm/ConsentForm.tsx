'use client';
import React, { useState, useEffect } from "react";
import CheckBoxStyled from "../CheckBoxStyled/CheckBoxStyled";
import "./ConsentForm.css";

export default function ConsentForm() {

    type Option = {
        id: number;
        displayName: string;
        permissions: {
            id: number;
            name: string;
            detail: string;
        }[];
    };

    // Será enviado para a API quando enviarmos o formulário
    interface GroupSelection {
        groupId: string;
        permissions: string[];
    }
    
    interface RequestBody {
        consumidor: string;
        identificacaoCliente: string;
        selectedGroups: GroupSelection[];
        prazo: string;
    }

    interface ResponseData {
        id: string;
        dados: string;
    }

    const [options, setOptions] = useState<string[]>([]);
    const [checkboxes, setCheckboxes] = useState<Option[]>([]);

    console.log(checkboxes);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch("/api/transmitters-options");
                const dataOptions = await response.json();
                const options = dataOptions.options;

                const responsePermissions = await fetch("/api/permissions-options");
                const permissionsData = await responsePermissions.json();


                // console.log(permissionsData)
                
                setOptions(options);
                setCheckboxes(permissionsData);


            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, []);


    const showList = (index: number) => {
        const list = document.querySelector(`.info-list-${index}`);
        if (list) {
            // Verifica se o atributo hidden está presente
            if (!list.hasAttribute("hidden")) {
                // Adiciona o atributo hidden
                list.setAttribute("hidden", "true");
            } else {
                // Remove o atributo hidden
                list.removeAttribute("hidden");
            }
            
            
        }
    }


    try {
        const htmlCheckboxes = document.querySelectorAll<HTMLInputElement>(".permission-group");

        htmlCheckboxes.forEach(checkbox => {
            checkbox.addEventListener("change", () => {
                
                const list = checkbox.parentElement?.parentElement?.querySelector(".info-list");
                if (list) {
                    const listCheckboxes = list.querySelectorAll<HTMLInputElement>("input[type='checkbox']");
                    listCheckboxes.forEach(listCheckbox => {
                        listCheckbox.checked = checkbox.checked;
                    });
                }            
            });
        })
    } catch (error) {
        console.error("Error adding event listeners:", error);
    }

    // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const handleSubmit = () => {
        // event.preventDefault();
        const form = document.querySelector("form") as HTMLFormElement;
        const selectedGroups: GroupSelection[] = [];

        // Obtem todos os campos do formulário
        const formData = new FormData(form);
        let prazo = "";


        for (const [key, value] of Array.from(formData)) {
            
            if (key) {
                if (String(key).startsWith("group-")) {
                    const groupId = String(key).split("-")[1];
                    selectedGroups.push({ groupId:groupId, permissions:[]});
                } else if (String(key).startsWith("permission-")) {
                    const groupId = String(key).split("-")[1];
                    const permissionId = String(key).split("-")[2];
                    const group = selectedGroups.find(group => group.groupId === groupId);
                    if (group) {
                        group.permissions.push(permissionId);
                    }
                } else if (String(key) === "prazo") {
                    prazo = String(value);
                }
            }

        }

        // console.log(selectedGroups);
        
        const requestData: RequestBody = {
            consumidor: "Empresa média LTDA",
            identificacaoCliente: "01.234.567/0001-89",
            selectedGroups: selectedGroups,
            prazo: prazo
        };
        
        fetch("/api/accept-terms", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        })
        .then((response: Response) => {
            return response.json();
        })
        .then((data: any) => {
            // Faz o redirecionamento para o URL do data
            window.location.href = data;
        })
        .catch((error: Error) => {
            console.error("Error accepting terms:", error);
        });
        
    };

    return (

        <div className="flex flex-col justify-center items-center text-xl text-black">
            <form className="flex flex-col text-xl text-black">
                <h1 className="text-3xl font-bold text-center mb-5">Consentimento</h1>
                <div className="mb-4">
                    <label className="font-bold" htmlFor="consumidor">Consumidor:</label>
                    <input id="consumidor" type="text" name="consumidor" value="Empresa média LTDA" readOnly />
                </div>
                <div className="mb-4">
                    <label className="font-bold" htmlFor="cnpj">Identificação do cliente:</label>
                    <input id="cnpj" type="text" name="cnpj" value="01.234.567/0001-89" readOnly />
                </div>
                <hr />
                <div className="mb-4 mt-3">
                    <p>A fim de oferecer o serviço A, o Receptor X precisa coletar algumas informações.</p>
                </div>
                <div className="mb-4">
                    <label className="font-bold" htmlFor="institituição">Instituição transmissora:</label>

                    {/* min-width: 10rem;
                    padding: 5px 13px;
                    background-color: #642ae1;
                    color: #fff;
                    border-radius: 7px;
                    font-weight: 500; */}
                    <select id="instituicao" name="instituicao" className="bg-violet-800 text-white rounded-md p-2 m-2">
                        {options.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                
                <div>
                    <h2 className="font-bold" >Dados a serem compartilhados</h2>
                    {checkboxes.map((checkbox, index) => (
                        <div key={index}>
                            <div className="flex">
                                {/* <div className="flex items-center space-x-2">
                                    <input type="checkbox" className={`permission-group permission-group-${index}`} id={`group-${checkbox.id}`} name={`group-${checkbox.id}`} value={`${checkbox.id}`}/>
                                    <label htmlFor={`group-${checkbox.id}`}>{checkbox.displayName}</label>
                                </div> */}
                                <CheckBoxStyled
                                    wrapperClassName="flex items-center space-x-2"
                                    className={`permission-group permission-group-${index}`}
                                    id={`group-${checkbox.id}`}
                                    name={`group-${checkbox.id}`}
                                    value={`${checkbox.id}`}
                                    labelText={checkbox.displayName}
                                />

                                <img alt="chevron" onClick={() => showList(index)}  src="/chevron-right.svg" className="chevron-icon" />
                            </div>
                            
                            <ul className={`info-list-${index} info-list pl-5 permission-list`} hidden>
                                {checkbox.permissions.map((permission: any, index: number) => (
                                    <li key={index} className="flex flex-col">
                                        {/* <div className="flex items-center space-x-2">
                                            <input type="checkbox" name={`permission-${checkbox.id}-${permission.id}`} value={`${permission.id}`} />
                                            <label htmlFor={`permission-${permission.id}`}>{permission.name}</label>
                                        </div> */}
                                        <CheckBoxStyled
                                            wrapperClassName="flex items-center space-x-2"
                                            className="permission-checkbox"
                                            id={`permission-${checkbox.id}-${permission.id}`}
                                            name={`permission-${checkbox.id}-${permission.id}`}
                                            value={`${permission.id}`}
                                            labelText={permission.name}
                                        />
                                        <div className="pl-9 text-sm mb-4">
                                            <span>{permission.detail}</span>
                                        </div>
                                        
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>


                <br></br>
                <hr></hr>
                <br></br>
                <div className="ml-0 mt-4">
                    <label htmlFor="prazo">Prazo:</label>
                    <select id="prazo" name="prazo" className="bg-violet-800 text-white rounded-md p-2 m-2">
                        <option value="1">1 mês</option>
                        <option value="2">2 meses</option>
                        <option value="3">3 meses</option>
                        <option value="6">6 meses</option>
                        <option value="12">12 meses</option>
                    </select>
                </div>
                <br></br>
                {/* <div>
                    <input type="checkbox" id="termos" name="termos" value="termos" onChange={handleSubmit} />
                    <label htmlFor="termos" >Termos e condições</label>
                </div> */}
                <CheckBoxStyled
                    wrapperClassName="flex items-center justify-center space-x-2"
                    className="permission-checkbox"
                    id="termos"
                    name="termos"
                    value="termos"
                    labelText="Termos e condições"
                    labelClassName="custom-label-link"
                    onChange={handleSubmit} 
                />
            </form>
        </div>
    );
}
