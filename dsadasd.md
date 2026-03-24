# 🌦️ Previsão do Tempo 7 Dias - Node.js

Este projeto é uma ferramenta em Node.js que consulta a previsão do tempo para os próximos 7 dias de qualquer cidade informada. Ele utiliza integração entre duas APIs distintas para transformar o nome de uma cidade em coordenadas geográficas e, em seguida, obter os dados meteorológicos.

## 🚀 Como o Projeto Funciona

O fluxo de execução do script segue três etapas principais:

1.  **Geocodificação:** O nome da cidade é enviado para a API Nominatim (OpenStreetMap) para obter a **latitude** e **longitude**.
2.  **Consulta Meteorológica:** As coordenadas obtidas são enviadas para a API Open-Meteo.
3.  **Processamento e Exibição:** O script interpreta os códigos técnicos da API (WMO Codes) para termos amigáveis e exibe os resultados no console.

---

## 🛠️ Tecnologias e APIs Utilizadas

| Componente | Tecnologia/Serviço | Finalidade |
| :--- | :--- | :--- |
| **Runtime** | Node.js | Execução do código JavaScript no servidor/máquina local. |
| **Geocoding API** | [Nominatim](https://nominatim.org/) | Converter nomes de cidades em coordenadas (Lat/Lon). |
| **Weather API** | [Open-Meteo](https://open-meteo.com/) | Fornecer dados de temperatura, UV, umidade e condições climáticas. |

---

## 📡 Consumo das APIs

### 1. Busca de Coordenadas (Nominatim)
A função `findCity(city)` realiza uma requisição `GET` para o endpoint:
`https://nominatim.openstreetmap.org/search?city={NOME}&format=json&limit=1`

* **Header Necessário:** É obrigatório o envio de um `User-Agent` identificado.
* **Tratamento:** Utilizamos `encodeURIComponent()` para garantir que cidades com espaços ou acentos não quebrem a URL.

### 2. Previsão do Tempo (Open-Meteo)
A função `getPrevisao7Dias(city)` utiliza as coordenadas para consultar:
`https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,uv_index_max,weathercode,relative_humidity_2m_max&timezone=America%2FSao_Paulo`

**Parâmetros solicitados:**
* `temperature_2m_max`: Temperatura máxima prevista.
* `uv_index_max`: Índice ultravioleta máximo do dia.
* `weathercode`: Código numérico que representa a condição do tempo (WMO).
* `relative_humidity_2m_max`: Umidade relativa máxima do ar.

---

## ⚠️ Observações de Segurança e Ambiente

O projeto contém as seguintes configurações globais:

* **`process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'`**: Esta linha desabilita a verificação de certificados SSL. É útil em ambientes corporativos com Firewalls/Proxies rigorosos que costumam bloquear requisições HTTPS, mas deve ser usada com cautela em produção.
* **`process.removeAllListeners('warning')`**: Remove avisos do Node.js no console para manter o output da previsão limpo.

---

## 📦 Como Executar

1. Certifique-se de ter o **Node.js** instalado (versão 18 ou superior, que já possui a função `fetch` nativa).
2. Clone o repositório.
3. Execute o arquivo principal:
   ```bash
   node seu_arquivo.js
   ```

---

> **Nota:** Os códigos de condição do tempo (WMO) são traduzidos pela função `interpretarCodigoWMO()`. Caso a API retorne um código não mapeado, o script exibirá o número original para referência.