// Remove os avisos de segurança e ignora o certificado da rede (Proxy/Firewall)
process.removeAllListeners('warning')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

getPrevisao7Dias('Americana')

async function findCity(city) {
    // Adicionado um User-Agent mais único para evitar bloqueios
    const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json&limit=1`

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'SENAC-V1'
            }
        })

        // Verifica se a resposta é válida antes de tentar converter para JSON
        const text = await response.text();
        try {
            const data = JSON.parse(text);
            if (data && data.length > 0) {
                const { lat, lon, name } = data[0]
                return { lat, lon, name }
            }
        } catch (e) {
            console.error("A API não retornou um JSON válido. Ela retornou isso:", text.substring(0, 100));
            return null;
        }

        console.log("Cidade não encontrada.")
        return null;

    } catch (error) {
        console.error("Erro na conexão da busca:", error.message)
        return null;
    }
}

async function getPrevisao7Dias(cityName) {

    const cityData = await findCity(cityName)

    // VERIFICAÇÃO ESSENCIAL: Só prossegue se cityData existir
    if (!cityData) {
        console.log("⚠️ Abortando: Não foi possível obter as coordenadas da cidade.");
        return;
    }

    const { lat, lon, name } = cityData

    // url de consulta da API
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,uv_index_max,weathercode,relative_humidity_2m_mean&timezone=America%2FSao_Paulo`

    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Falha na requisição da Open-Meteo')

        const data = await response.json()
        const daily = data.daily

        console.log(`\n--- PREVISÃO PARA OS PRÓXIMOS 7 DIAS ---\n`)
        console.log(`Localização: ${name}`)
        console.log(`Lat ${lat}, Lon ${lon}\n`)

        daily.time.forEach((dataDia, i) => {
            const tempMax = daily.temperature_2m_max[i]
            const uv = daily.uv_index_max[i]
            const umidadeMedia = daily.relative_humidity_2m_mean[i]
            const codigoTempo = daily.weathercode[i]
            const condicao = interpretarCodigoWMO(codigoTempo)

            console.log(`Data: ${dataDia}`)
            console.log(`  🌡️ Temp Máx: ${tempMax}°C`)
            console.log(`  ☀️ Raio UV: ${uv}`)
            console.log(`  💧 Umidade Média: ${umidadeMedia}%`) // 3. Alterado o texto para o usuário
            console.log(`  ☁️ Condição: ${condicao}`)
            console.log(`---------------------------------------`)
        })

    } catch (error) {
        console.error("Erro ao buscar dados climáticos:", error.message)
    }
}

function interpretarCodigoWMO(codigo) {
    const codigos = {
        0: "Céu limpo",
        1: "Principalmente limpo",
        2: "Parcialmente nublado",
        3: "Encoberto",
        45: "Nevoeiro",
        51: "Chuvisco",
        61: "Chuva leve",
        63: "Chuva moderada",
        80: "Pancadas de chuva leves"
    }
    return codigos[codigo] || `Código ${codigo} (Veja doc)`
}