document.addEventListener("DOMContentLoaded", function () {
    var gerarBtn = document.getElementById('gerarBtn');
    var resultadosDiv = document.getElementById('resultados');

    // Oculta a div resultadosDiv inicialmente
    resultadosDiv.style.display = 'none';

    gerarBtn.addEventListener('click', function () {
        gerarSQL();

        // Mostra a div resultadosDiv após clicar no botão
        resultadosDiv.style.display = 'block';
    });

    function gerarSQL() {
        var xmlInput = document.getElementById('xmlInput');

        try {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xmlInput.value, 'text/xml');

            var tagsDhEmi = xmlDoc.getElementsByTagName('dhEmi');
            var cNFValue = xmlDoc.getElementsByTagName('cNF')[0].textContent;
            var serieValue = xmlDoc.getElementsByTagName('serie')[0].textContent;

            if (tagsDhEmi.length > 0) {
                var valoresDhEmi = [];
                for (var i = 0; i < tagsDhEmi.length; i++) {
                    var valor = tagsDhEmi[i].textContent;
                    valoresDhEmi.push(valor);
                }

                var sqlUpdate = 'UPDATE VW50_NFE\nSET IDE_DEMI = ';

                if (valoresDhEmi.length === 1) {
                    sqlUpdate += "'" + formatarData(valoresDhEmi[0]) + "'\n";
                    sqlUpdate += "WHERE CFG_NUMERO_NF = " + cNFValue;
                    sqlUpdate += '\nAND CFG_SERIE_NF = ' + serieValue;
                    sqlUpdate += '\nAND CFG_UN = '
                } else {
                    sqlUpdate += "CASE\n";
                    for (var j = 0; j < valoresDhEmi.length; j++) {
                        sqlUpdate += "    WHEN OUTRA_COLUNA = 'ALGUM_VALOR' THEN '" + formatarData(valoresDhEmi[j]) + "'\n";
                    }
                    sqlUpdate += '    ELSE IDE_DEMI\nEND\n';
                    sqlUpdate += "WHERE CFG_NUMERO_NF = " + cNFValue;
                    sqlUpdate += '\nAND CFG_SERIE_NF = ' + serieValue;
                    sqlUpdate += '\nAND CFG_UN = '
                }

                resultadosDiv.innerHTML = '<h3>Resultados:</h3><p>Valor da tag dhEmi:</p><pre>' + valoresDhEmi.join('\n') + '</pre><h3>Instrução SQL UPDATE:</h3><pre>' + sqlUpdate + '</pre>';
            } else {
                alert('Nenhuma tag <dhEmi> encontrada.');
            }
        } catch (error) {
            alert('Erro ao analisar o XML: ' + error);
        }
    }

    function formatarData(data) {
        // Use uma expressão regular para remover o fuso horário (-03:00, -04:00, etc.)
        data = data.replace(/-\d{2}:\d{2}$/, '');

        // Divida a data em partes: data e hora
        var partes = data.split('T');
        var dataParte = partes[0];
        var horaParte = partes[1];

        // Divida a parte da data em ano, mês e dia
        var dataDividida = dataParte.split('-');
        var dia = dataDividida[2];
        var mes = dataDividida[1];
        var ano = dataDividida[0];

        // Formate a data no formato desejado: dd/mm/aaaa hh:mm:ss
        var dataFormatada = dia + '/' + mes + '/' + ano + ' ' + horaParte;

        return dataFormatada;
    }
});
