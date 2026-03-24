// Remove os avisos de segurança e ignora o certificado da rede (Proxy/Firewall)
process.removeAllListeners('warning')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

getPrevisao7Dias('Americana')

async function findCity(city) {
    // O encodeURIComponent serve para tratar espaços ou acentos no nome da cidade
    const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&format=json&limit=1`

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'SENAC'
            }
        })

        const data = await response.json()

        if (data.length > 0) {
            const { lat, lon, name } = data[0]

            return { lat, lon, name }
        } else {
            console.log("Cidade não encontrada.")
        }
    } catch (error) {
        console.error("Erro na busca:", error)
    }
}

// URL com os parâmetros para 7 dias: temperatura máx, UV, código do tempo e umidade relativa

async function getPrevisao7Dias(city) {
    
    city = await findCity(city)
    
    const {lat, lon, name} = city
    
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,uv_index_max,weathercode,relative_humidity_2m_max&timezone=America%2FSao_Paulo`

    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Falha na requisição')
        
        const data = await response.json()
        const daily = data.daily

        console.log(`\n--- PREVISÃO PARA OS PRÓXIMOS 7 DIAS ---`)
        console.log(`Localização: ${name} \nLat ${lat}, Lon ${lon}\n`)

        // Loop para percorrer os 7 dias (0 a 6)
        daily.time.forEach((dataDia, i) => {
            const tempMax = daily.temperature_2m_max[i]
            const uv = daily.uv_index_max[i]
            const umidade = daily.relative_humidity_2m_max[i]
            const codigoTempo = daily.weathercode[i]

            // Tradução simples do código do tempo (WMO Code)
            const condicao = interpretarCodigoWMO(codigoTempo)

            console.log(`Data: ${dataDia}`)
            console.log(`  🌡️ Temp Máx: ${tempMax}°C`)
            console.log(`  ☀️ Raio UV: ${uv}`)
            console.log(`  💧 Umidade Máx: ${umidade}%`)
            console.log(`  ☁️ Condição: ${condicao}`)
            console.log(`---------------------------------------`)
        })

    } catch (error) {
        console.error("Erro ao buscar dados:", error.message)
    }
}

// Função auxiliar para traduzir os códigos da API
function interpretarCodigoWMO(codigo) {
    const codigos = {
        0: "Céu limpo",
        1: "Principalmente limpo",
        2: "Parcialmente nublado",
        3: "Encoberto",
        45: "Nevoeiro",
        51: "Drizzle (Chuvisco)",
        61: "Chuva leve",
        63: "Chuva moderada",
        80: "Pancadas de chuva leves"
    }
    return codigos[codigo] || `Código ${codigo} (Veja doc)`
}
