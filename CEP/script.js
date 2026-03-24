async function buscar(e) {
    const cep = e.target.value

    if (cep.length < 8) return

    try {

        const tabela = document.querySelector('#tabela')
        const rua = document.querySelector('#rua')
        const bairro = document.querySelector('#bairro')
        const cidade = document.querySelector('#cidade')
        const estado = document.querySelector('#estado')
        
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const data = await response.json()

            tabela.classList.remove('oculto')
            rua.innerText = data.logradouro
            bairro.innerText = data.bairro
            cidade.innerText = data.localidade
            estado.innerText = data.estado
        } catch (error) {
            console.error(error)
        }



}