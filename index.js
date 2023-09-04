document.addEventListener("DOMContentLoaded", function () {
  var gerarBtn = document.getElementById('gerarBtn');

  gerarBtn.addEventListener('click', function () {
      gerarSQL();
  });

  function gerarSQL() {
      var xmlInput = document.getElementById('xmlInput');
      var idLista = document.getElementById('idListaInput').value;

      try {
          var parser = new DOMParser();
          var xmlDoc = parser.parseFromString(xmlInput.value, 'text/xml');

          var tagsDhEmi = xmlDoc.getElementsByTagName('dhEmi');

          if (tagsDhEmi.length > 0) {
              var valoresDhEmi = [];
              for (var i = 0; i < tagsDhEmi.length; i++) {
                  var valor = tagsDhEmi[i].textContent;
                  valoresDhEmi.push(valor);
              }

              var sqlUpdate = 'UPDATE VW50_NFE\nSET IDE_DEMI = ';

              if (valoresDhEmi.length === 1) {
                  sqlUpdate += "'" + formatarData(valoresDhEmi[0]) + "'\n";
                  sqlUpdate += "WHERE ID_LISTA = " + idLista;
              } else {
                  sqlUpdate += "CASE\n";
                  for (var j = 0; j < valoresDhEmi.length; j++) {
                      sqlUpdate += "    WHEN OUTRA_COLUNA = 'ALGUM_VALOR' THEN '" + formatarData(valoresDhEmi[j]) + "'\n";
                  }
                  sqlUpdate += '    ELSE IDE_DEMI\nEND\n';
                  sqlUpdate += "WHERE ID_LISTA = " + idLista;
              }

              var sqlUpdateDiv = document.getElementById('sqlUpdate');
              sqlUpdateDiv.innerHTML = '<h3>Instrução SQL UPDATE:</h3><pre>' + sqlUpdate + '</pre>';
          } else {
              alert('Nenhuma tag <dhEmi> encontrada.');
          }
      } catch (error) {
          alert('Erro ao analisar o XML: ' + error);
      }
  }

  function formatarData(data) {
      // Remova o fuso horário (-03:00)
      data = data.replace(/-03:00$/, '');

      var partes = data.split('T');
      var dataParte = partes[0];
      var horaParte = partes[1];
      var dataFormatada = dataParte.split('-').reverse().join('/') + ' ' + horaParte;
      return dataFormatada;
  }
});
